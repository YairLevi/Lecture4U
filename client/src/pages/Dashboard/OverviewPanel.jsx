import CourseCard from "../../components/CourseCard/CourseCard";
import { Col } from "react-bootstrap";
import React from "react";
import Card from "./Card";
import CardWrapper from "./CardWrapper";


export default function OverviewPanel({ assignments, subjects, discussions, recentLogin }) {
    return (
        <>
            <h2 className={'p-3'} style={{ fontWeight: "normal" }}>Overview</h2>
            <CardWrapper>
                <Card title={'Active Assignments'}
                      value={assignments.count}
                      subtitle={'Most Recent'}
                      subvalue={
                          assignments.count === 0 ?
                              'No Active Assignments' :
                              new Date(assignments.mostUrgent.date).getMonthAndDay() + '\n' + assignments.mostUrgent.courseName
                      }
                      color={'red'}
                      icon={null}/>
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
                      color={'red'}
                      icon={null}
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
                      color={'red'}
                      icon={null}
                />
            </CardWrapper>
        </>
    )
}