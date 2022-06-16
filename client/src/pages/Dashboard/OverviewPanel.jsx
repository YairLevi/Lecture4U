import CourseCard from "../../components/CourseCard/CourseCard";
import { ButtonGroup, Col, ToggleButton } from "react-bootstrap";
import React from "react";
import Card from "./Card";
import CardWrapper from "./CardWrapper";
import useLocalStorage from "../../hooks/useLocalStorage";


const colors = {
    assignments: {
        mainColor: '#eafce5',
        subColor: '#afd3a9',
    },
    subjects: {
        mainColor: '#e2f2fd',
        subColor: '#a3b9cc',
    },
    discussions: {
        mainColor: '#fff3e5',
        subColor: '#d0c1ad'
    }
}


export default function OverviewPanel({ assignments, subjects, discussions, recentLogin }) {
    return (
        <div>
            <h2 className={'p-3 ms-5'} style={{ fontWeight: "normal" }}>Overview</h2>
            <div className={'d-flex justify-content-evenly'}>
                <CardWrapper>
                    <Card title={'Active Assignments'}
                          value={assignments.count}
                          subtitle={'Most Recent'}
                          subvalue={
                              assignments.count === 0 ?
                                  'No Active Assignments' :
                                  new Date(assignments.mostUrgent.date).getMonthAndDay() + '\n' + assignments.mostUrgent.courseName
                          }
                          {...colors.assignments}
                          icon={'bx bx-task'}/>
                </CardWrapper>
                <CardWrapper>
                    <Card title={'New Subjects in Courses'}
                          value={subjects.count}
                          subtitle={'Most Recent'}
                          subvalue={
                              subjects.count === 0 ?
                                  'No New Subjects' :
                                  new Date(subjects.mostRecent.date).getMonthAndDay() + ' ' + subjects.mostRecent.courseName
                          }
                          {...colors.subjects}
                          icon={'bx bx-book'}
                    />
                </CardWrapper>
                <CardWrapper>
                    <Card title={'New Discussions'}
                          value={discussions.count}
                          subtitle={'Most Recent'}
                          subvalue={
                              discussions.count === 0 ?
                                  'No New Discussions' :
                                  new Date(discussions.mostRecent.date).getMonthAndDay() + ' ' + discussions.mostRecent.courseName
                          }
                          {...colors.discussions}
                          icon={'bx bx-chat'}
                    />
                </CardWrapper>
            </div>
        </div>
    )
}