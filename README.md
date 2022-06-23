  <div align="center">
    <!-- PROJECT LOGO -->
    <img src="https://github.com/YairLevi/Lecture4U/blob/main/client/src/assets/header.svg"/>
    <h1 align="center">Anyone Can Share Knowledge, Anywhere, Anytime.</h1>
    <div align="center">
      <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
      <img src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white"/>
      <img src="https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white"/>
      <img src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white"/>
      <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
    </div>
    <div align="center">
      <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
      <img src="https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white"/>
      <img src="https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white"/>
    </div>
  </div>

</br>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#motivation">Motivation</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Uage</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#folder-structure">Folder Structure</a></li>
        <li><a href="#installation-and-running">Installation & Running</a></li>
        <li><a href="#run-demo">Run Demo</a></li>
      </ul>
    </li>
    <li>
      <a href="#project-architecture">Project Architecture</a>
      <ul>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#database">Database</a></li>
        <li>
          <a href="#microservices">Microservices</a>
          <ul>
            <li><a href="#ocr">OCR</a></li>
            <li><a href="#speech-to-text">Speech to text</a></li>
            <li><a href="#constraint-satisfaction-problems-csps">Constraint Satisfaction Problems (CSPs)</a></li>
         </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ol>
</details>


## About The Project
Final project in the Computer Science Department, Bar Ilan University. </br>
**Lecture4U** is a courses management system, which allows users to take part in courses, learning groups with their friends, or manage their courses as lecturers. Our system provides each user machine learning tools which makes it easier for them to learn and manage their time.  
### Motivation
https://user-images.githubusercontent.com/72911486/173763873-6dc298d7-b43d-4ca8-b595-a55777bc0784.mp4
### Features
- [x] **Course management tools -** _As a student_ you can view the study units that uploaded by the lecturer, rate them according to your knowledge, see the assignments you need to submit, and chat with other course members in the forum. </br> _As a lecturer_ you can upload study units, add assignments. You can also select one of the courses you teach, see the knowledge of each study unit in this course (according to students ratings), and see how many students saw the course study units each day.  
- [x] **Learning Groups -** Users can create groups with their friends, they can chat in the group forum, share files, and work on a shared document (like Google Docs).
- [x] **OCR tool -** Given an handwriting image, creates a .docx file, with the text that appears in the image.
- [x] **Speech to text tool -** Given .m4a audio file, creates a transcript file (.docx), and divide the transcription to topics (with the timestamps of each topic) according to known keywords. You can keep track of the transcript process according to the progress bar. Each user also has a TimeLine that show his recent actions with the speech to text module.   
- [x] **Scheduler tool -** Each user has it's own calendar, he schedules his constraints and their priorities, and the scheduler creates a schedule that satisfy his constraints.
## Usage


## Getting Started
### Folder Structure
```
├── client
|   ├── src
|   |   ├── assets
|   |   ├── components
|   |   ├── contexts
|   |   ├── helpers
|   |   ├── hooks
|   |   ├── icons
|   |   ├── modals
|   |   ├── pages
├── server
|   ├── cloud
|   ├── models
|   ├── routes
├── microservices
|   ├── OCR
|   ├── Speech to text
|   ├── Scheduler
└── Additional files
|   ├── Architecture document
|   ├── Jira document
|   ├── group's work documentation.pdf
```
### Installation And Running
#### Browse to the website
This is the quickest way to get a running instance of Lecture4U! </br> 
Just Browse to http://35.195.53.125:3000
#### From Sources
1. Run dependencies.bat (for the python dependencies).
2. Install node.js
3. Run git clone https://github.com/YairLevi/Lecture4U.git 
4. Go into the client and server folders, and run lines 5-6:
5. Run npm install (only has to be done before first start or when you change the source code)
6. Run npm start
7. Browse to http://localhost:3000
### Run Demo
There are several demo files, which is highly recommended to run.
- For speech to text tool, go into: microservices -> Speech to text -> demos.
- For OCR tool, go into: microservices -> OCR -> image examples.


## Project Architecture

### Backend
Our backend is an API server implemented using NodeJS and ExpressJS, with the Mongoose API to connect with the database.
We use GCP as the cloud platform for providing both storage and remote services.
### Frontend
We designed our website's UI with ReactJS and other 3rd party UI libraries, including MaterialUI and Bootstrap. 
### Database
We used MongoDB as our database. Non-relational databases are our-kind of databases :)
### Microservices
#### OCR

Given an handwriting image, creates a .docx file, with the text that appears in the image. 

Each image may conatin a few sentences, and in each sentence a few words.
First, we split the given image, into several images, that contain only one word. In order to to that, we use the [Otsu threshold](https://en.wikipedia.org/wiki/Otsu%27s_method). In the simplest form, this algorithm returns a single intensity threshold that separate pixels into two classes, foreground and background. Then, choose the right kernel size for each image. 

Different users have a different font size, so we can't pre-adjust the same kernel size for each user, since users with a large font size need a large kernel (to catch the whole word), while users with a small font size need a relatively small kernel. To solve this problem we create a calibration system that enables each user to upload an
image, choose a kernel size, and see if our model was able to marked each word in a green rectangle. To achieve maximum accuracy later on, it's recommended to choose a kernel size that mark each word in a rectangle. 

Now, let's talk about our neural network model. For the training, we used the [IAM Handwriting Database](https://fki.tic.heia-fr.ch/databases/iam-handwriting-database). The model implemented with TensorFlow (TF), and has several [CNN](https://en.wikipedia.org/wiki/Convolutional_neural_network) and [LSTM](https://en.wikipedia.org/wiki/Long_short-term_memory) layers, and a [CTC Loss](https://en.wikipedia.org/wiki/Connectionist_temporal_classification).

We feed the model with the previous images (that contain only one word), and for each image, the model returns a word. We keep the order in which we send the images, so we can put the text back together, in the correct order it appeared in the regular image. Finally. write the model's output to a .docx file.



#### Speech to text
Our goal is to transcibe the given .m4a audio file and write for each topic it's timestamp according to the known keywords. If you haven't already run one of our speech to text demo files, it is recommended to do so (see speech to text Run Demo section).

The model supports transcription into English or Hebrew. The English keyword are: ['new', 'topic', 'end', 'topic], therefore, when the speaker wants to talk about a new topic in his lecture, he should say: "new topic", then the topic's name, and once he has finished saying the topic's name, he will say "end topic". Whatever he says from that moment, until the next time he says: "new topic" will be considered as the same part of his topic. 

Symmetrically, the same thing is done with Hebrew, but with the keywords: ['נושא', 'חדש', 'סוף', 'נושא'].

***For example,*** suppose we have an english audio file in which we wish to speak on two topics: "Compiler", and "Interpreter", so in the recording, when we want to start talking about compilers, we say: "new topic compiler end topic", then start talking about all the content related to compilers, after that say: "new topic interpreter end topic", and start talking about all the content related to interpreter. Finally he will get a transcript of the recording, which is divided into two topics: "Compilers", "interpreter", and the timestamps that these two subjects learned.

Users upload their .m4a audio files to the speech to text microservice (a flask server), choose the language and click the transcribe button.
The microservice uploads the files to a google cloud bucket, then uses the google cloud speech to text api to get a words list and time that each word was said.
Then, our algorithm split the list to topics according to the keywords and calculates the timesatamps that each topic was studied , and finally write to a .docx file.
The user get the transcript file, and get the confidence of the model in the transcript he made.


#### Constraint Satisfaction Problems CSPs
Constraint satisfaction problems (CSPs) are mathematical questions defined as a set of objects whose state must satisfy a number of constraints or limitations. CSPs represent the entities in a problem as a homogeneous collection of finite constraints over variables, which is solved by constraint satisfaction methods.

In our project, each user has it's own calendar, and wish to schedule his tasks according to his time and priorities constrains. The user clicks the 'schedule tasks' button, that will open a form. There he will choose his tasks details, and finally clicks the approve button. Symmetrically, he can also place his tasks directly on the calendar, and then clicks the approve button in the form.

Each task has a priority (rank 1-5, when 1 is the least important). The priority actually means that, if one task is more important than another task, then in each scheduling ,the more important task must appear first on the calendar.

Our scheduler microservice gets the inforamtion, and tries to satisfy the problem. The scheduler may find some different legal solutions and return them to the user. The user has an options drop list that displays all the legal solutions (scheduling), that the scheduler find him. Then the user can choose his prefered schedule, and by clicking the 'save' button, his schedule will save to the DB, and will automatically load when he login again. 

If the user has tasks that are already scheduled on the calendar (from previous algorithm runs), and now wants to add new tasks, then the scheduler creates a new problem that contains the previous tasks, as well as the new tasks and tries to solve (satisfy) the new problem - it's checks that the new tasks do not contradict the previous tasks that already schedule on the calendar.

## Live Display Of The App
https://www.youtube.com/watch?v=D2WP6g5evyw&ab_channel=YairLevi

## Contact
- Tal Sigman
- Yair Levi
- Noam Roth 
