import sys
import os
import io
from google.cloud import speech
from google.cloud import storage
from google.oauth2 import service_account
from googleapiclient.discovery import build
import googleapiclient.discovery

from moviepy.editor import AudioFileClip
import asyncio
import aiohttp
from gcloud.aio.storage import Storage
import wave

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'speech_to_text_cloud.json'


# Write speech to document instead of txt file.
def create_document(doc_name=None, doc_content=None):
    credentials = service_account.Credentials.from_service_account_file(
        filename=os.environ['GOOGLE_APPLICATION_CREDENTIALS'])

    service = googleapiclient.discovery.build('docs', 'v1', credentials=credentials)
    title = 'My Document'
    body = {
        'title': title
    }
    doc = service.documents().create(body=body).execute()
    print('Created document with title: {0}'.format(doc.get('title')))


# Convert .4ma to .wav file.
def convert_video_2_audio(zoom_video_file_name, transcribed_audio_file_name):
    audio_clip = AudioFileClip(zoom_video_file_name)
    audio_clip.write_audiofile(transcribed_audio_file_name)


# Upload a given record to the bucket in gcs repo.
def upload_file_to_bucket(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)


async def async_upload_to_bucket(bucket_name, destination_blob_name, file_object):
    async with aiohttp.ClientSession() as session:
        my_storage = Storage(session=session)
        status = await my_storage.upload(bucket_name, destination_blob_name, file_object)
        return status['selfLink']


async def main(file_name):
    with io.open(file_name, 'rb') as audio_file:
        content = audio_file.read()
        url = await async_upload_to_bucket('lecture4u-1', 'speech to text files/transcribed_speech.wav', content)
        print(url)


# key_words = ['new', 'topic', 'end']
def search_word(key_words, my_word_list, my_timestamps):
    topic_name = []
    topic_content = []
    topic_timestamp = []
    topic_indexes = []
    start_words = []
    end_words = []

    # find the index of each topic:
    for word_index in range(0, len(my_word_list) - 1):
        if my_word_list[word_index] == key_words[0] and my_word_list[word_index + 1] == key_words[1]:
            start_words.append(word_index + 1)
        elif my_word_list[word_index] == key_words[2]:
            end_words.append(word_index)

    for start_index in start_words:
        for end_index in end_words:
            if end_index > start_index:
                topic_indexes.append((start_index, end_index))
                topic_name.append(my_word_list[start_index + 1: end_index])
                break

    for index in range(0, len(topic_indexes) - 1):
        first = topic_indexes[index]
        second = topic_indexes[index + 1]
        topic_content.append(my_word_list[first[1] + 1: second[0] - 1])
        start_time = my_timestamps[first[1] + 1][0]
        end_time = my_timestamps[second[0] - 1][1]
        topic_timestamp.append((start_time.total_seconds(), end_time.total_seconds()))

    # get the last topic content:
    if len(topic_indexes) > 0:
        last_topic = topic_indexes[len(topic_indexes) - 1]
        topic_content.append(my_word_list[last_topic[1] + 1: len(my_word_list)])
        start_time = my_timestamps[last_topic[1] + 1][0]
        end_time = my_timestamps[len(my_word_list) - 1][1]
        topic_timestamp.append((start_time.total_seconds(), end_time.total_seconds()))

    return topic_name, topic_content, topic_timestamp


# Transcribe the given audio file and return the word time offsets.
def transcribe_gcs_with_word_time_offsets(gcs_uri, number_of_channels, sample_rate_hertz, my_language_code):
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=gcs_uri)
    config = speech.RecognitionConfig(
        sample_rate_hertz=sample_rate_hertz,
        language_code=my_language_code,
        enable_word_time_offsets=True,
        audio_channel_count=number_of_channels
    )

    operation = client.long_running_recognize(config=config, audio=audio)

    print("Waiting for operation to complete...")
    result = operation.result(timeout=90)
    word_list = []
    word_time_list = []

    for result in result.results:
        alternative = result.alternatives[0]
        print("Transcript: {}".format(alternative.transcript))
        print("Confidence: {}".format(alternative.confidence))

        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time
            word_list.append(word)
            word_time_list.append((start_time, end_time))

            print(
                f"Word: {word}, start_time: {start_time.total_seconds()}, end_time: {end_time.total_seconds()}"
            )

    return word_list, word_time_list


# Input:
source_file_name, transcribed_audio_file_name, language = sys.argv[1], sys.argv[2], sys.argv[3]

# convert .m4a --> .wav file :
convert_video_2_audio(source_file_name, transcribed_audio_file_name)

# upload file to google cloud storage:
path = 'speech to text files/{}'.format(transcribed_audio_file_name)
upload_file_to_bucket('lecture4u-1', transcribed_audio_file_name, path)

# upload async to google cloud storage :
# print('Start Async Uploading.')
# asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
# asyncio.run(main('transcribed_speech.wav'))
# print("Finish Uploading.")

# settings:
path = 'gs://lecture4u-1/speech to text files/{}'.format(transcribed_audio_file_name)
f1 = wave.open(transcribed_audio_file_name, "r")
num_of_channels = int(f1.getnchannels())
sample_rate = int(f1.getframerate())
language_code = ''

if language == "english":
    language_code = 'en-US'
elif language == "hebrew":
    language_code = 'iw-IL'

print("\nFile settings:")
print("num_of_channels = {}".format(num_of_channels))
print("sample width = {}".format(sample_rate))
print("language_code = {}\n".format(language_code))

# transcribe:
word_list, timestamps = transcribe_gcs_with_word_time_offsets(path, num_of_channels, sample_rate, language_code)

if language == "english":
    word_list = [word.lower() for word in word_list]

my_keywords = []
if language == "english":
    my_keywords = ['new', 'topic', 'end']
elif language == "hebrew":
    my_keywords = ['נושא', 'חדש', 'סוף']

topics_names, topics_content, topics_timestamps = search_word(my_keywords, word_list, timestamps)
print(topics_names)
print(topics_content)
print(topics_timestamps)
