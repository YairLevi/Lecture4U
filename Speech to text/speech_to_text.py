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

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'speech_to_text_cloud.json'


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


def convert_video_2_audio(zoom_video_file_name, transcribed_audio_file_name):
    audio_clip = AudioFileClip(zoom_video_file_name)
    audio_clip.write_audiofile(transcribed_audio_file_name)


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
    last_topic = topic_indexes[len(topic_indexes) - 1]
    topic_content.append(my_word_list[last_topic[1] + 1: len(my_word_list)])
    start_time = my_timestamps[last_topic[1] + 1][0]
    end_time = my_timestamps[len(my_word_list) - 1][1]
    topic_timestamp.append((start_time.total_seconds(), end_time.total_seconds()))

    return topic_name, topic_content, topic_timestamp


# Transcribe the given audio file asynchronously and output the word time offsets.
def transcribe_gcs_with_word_time_offsets(gcs_uri):
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=gcs_uri)
    config = speech.RecognitionConfig(
        sample_rate_hertz=44100,
        enable_automatic_punctuation=True,
        language_code='iw-IL',
        enable_word_time_offsets=True,
        audio_channel_count=2
    )

    # for english wav:
    # sample_rate_hertz = 16000,
    # enable_automatic_punctuation=True,
    # language_code = "en-US",
    # enable_word_time_offsets = True

    # for hebrew wav:
    # sample_rate_hertz = 44100,
    # enable_automatic_punctuation = True,
    # language_code = 'iw-IL',
    # enable_word_time_offsets = True,
    # audio_channel_count = 2

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


transcribed_audio_file_name, language = sys.argv[1], sys.argv[2]
convert_video_2_audio('audio_hebrew.m4a', transcribed_audio_file_name)

# upload file to google cloud storage:
# upload_file_to_bucket('lecture4u-1', 'transcribed_speech.wav', 'speech to text files/transcribed_speech.wav')

# upload async to google cloud storage :
print('Start Async Uploading.')
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
asyncio.run(main('transcribed_speech.wav'))
print("Finish Uploading.")

word_list, timestamps = transcribe_gcs_with_word_time_offsets(
    'gs://lecture4u-1/speech to text files/transcribed_speech.wav')

my_keywords = []
if language == "english":
    my_keywords = ['new', 'topic', 'end']
elif language == "hebrew":
    my_keywords = ['נושא', 'חדש', 'סוף']

topics_names, topics_content, topics_timestamps = search_word(my_keywords, word_list, timestamps)
print(topics_names)
print(topics_content)
print(topics_timestamps)
