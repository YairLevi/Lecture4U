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
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Uage</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#folder-structure">Folder Structure</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
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
**Lecture4U** is a course management system, which allows users to take part in courses, or manage their courses as lecturer. Our system provides each user machine learning tools which makes it easier for them to learn and manage their time.  
### Motivation
### Features
- [x] **Course management tools -** _As a student_ you can view the study units that uploaded by the lecturer, rate the them according to your knowledge, see the assignments you need to submit, and chat with other course members in the forum. </br> _As a lecturer_ you can upload study units, add assignments. You can also select one of the courses you teach, see the average knowledge of each study unit in this course (according to students ratings), and see how many students saw the course study units.  
- [x] **Learning Groups -** Users can create groups with their friends, they can chat in the group forum, share files, and work on a shared document (like Google Docs).
- [x] **OCR tool -** Given an handwriting image, creates a .docx file, with the text that appears in the image.
- [x] **Speech to text tool -** Given .m4a audio file, creates a transcript file (.docx), and divide the transcription to topics (with the timestamps of each topic) according to known keywords. You can keep track of the transcript process according to the progress bar. Each user also has a TimeLine that show his recent actions with the speech to text module.   
- [x] **Scheduler tool -** Each user has it's own calendar, he schedules his constraints and their priorities, and the scheduler creates a schedule that satisfy his constraints.
### Built With
## Usage


## Getting Started
### Folder Structure
### Prerequisites
### Installation And Running
### Run Demo


## Project Architecture

### Backend
### Frontend
### Database
### Microservices
#### OCR
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

Our algorithm supports backward compatibility, that is, if the user has tasks that are already scheduled on the calendar (from previous algorithm runs), and now he wants to add new tasks, then of course the algorithm will check that there is no discrepancy with the previous tasks he has scheduled.


## Contact
- Tal Sigman
- Yair Levi
- Noam Roth 
