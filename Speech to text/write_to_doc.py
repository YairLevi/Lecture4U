from docx import Document
from datetime import date


def write(document_name, university_name, course_name, language, topics_names, topics_content, topics_timestamps):
    today = date.today()

    # Textual month, day and year
    today = today.strftime("%B %d, %Y")

    document = Document()

    section = document.sections[0]
    header = section.header
    paragraph = header.paragraphs[0]
    paragraph.text = "{}\t{}\t{}".format(today, university_name, course_name)
    paragraph.style = document.styles["Header"]

    document.add_heading(document_name, 0)

    for topic, content, timestamp in zip(topics_names, topics_content, topics_timestamps):
        heading = ""
        for word in topic:
            heading += (word + " ")

        heading += " (Timestamp In Lecture: {} - {})".format(timestamp[0], timestamp[1])
        document.add_heading(heading, 1)

        topic_content = ""
        for word in content:
            topic_content += (word + " ")

        document.add_paragraph(topic_content)

    document.save('{}.docx'.format(document_name))


# my_university_name = "Bar Ilan University"
# my_course_name = "My Course"
#
# write("Lecture 1", my_university_name, my_course_name, "English", [['topic', 'one'], ['topic', 'two']],
#       [['My', 'name', 'is', 'tal'], ['I', 'like', 'football']],
#       [(5, 11.4), (11.4, 17.8)])
