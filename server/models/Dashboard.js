const mongoose = require("mongoose");

const User = require("../models/User");
const Assignment = require("../models/assignments/Assignment");
const Course = require('../models/Course')
const Discussion = require('../models/forum/Discussion')
const Subject = require('../models/Subject')
const Event = require('../models/Event')

const { mapAsync, clone } = require("../mongooseUtil");


const dashboardSchema = new mongoose.Schema({
    userId: mongoose.SchemaTypes.ObjectId,
    assignments: [mongoose.SchemaTypes.ObjectId],
    subjects: [mongoose.SchemaTypes.ObjectId],
    discussions: [mongoose.SchemaTypes.ObjectId],
    events: [mongoose.SchemaTypes.ObjectId],
    recentLogin: Date
})

dashboardSchema.methods.getEvents = async function() {
    return await mapAsync(this.events, async (eventId) => clone(Event, eventId))
}

dashboardSchema.methods.getDashboardData = async function() {
    const data = {
        assignments: {},
        subjects: {},
        discussions: {},
    }

    for (const key of Object.keys(data)) {
        if (key === 'recentLogin') continue
        data[key].count = this[key].length
    }

    if (this.assignments.length !== 0) {
        const mostUrgentAssignmentId = await this.assignments.reduce(async (prevId, currId) => {
            const prevAssignment = await Assignment.findById(await prevId)
            const currAssignment = await Assignment.findById(currId)
            return prevAssignment.dueDate < currAssignment.dueDate ? prevId : currId
        })
        const mostUrgentAssignment = await Assignment.findById(mostUrgentAssignmentId)
        data.assignments.mostUrgent = {
            date: mostUrgentAssignment.dueDate,
            courseName: (await Course.findById(mostUrgentAssignment.courseId)).name
        }
    }

    if (this.subjects.length !== 0) {
        const mostRecentSubjectId = await this.subjects.reduce(async (prevId, currId) => {
            const prevSubject = await Subject.findById(await prevId)
            const currSubject = await Subject.findById(currId)
            return prevSubject.createdAt > currSubject.createdAt ? prevId : currId
        })
        const mostRecentSubject = await Subject.findById(mostRecentSubjectId)
        data.subjects.mostRecent = {
            date: mostRecentSubject.createdAt,
            courseName: (await Course.findById(mostRecentSubject.courseId)).name
        }
    }

    if (this.discussions.length !== 0) {
        const mostRecentDiscussionId = await this.discussions.reduce(async (prevId, currId) => {
            const prevDiscussion = await Discussion.findById(await prevId)
            const currDiscussion = await Discussion.findById(currId)
            return prevDiscussion.createdAt > currDiscussion.createdAt ? prevId : currId
        })
        const mostRecentDiscussion = await Discussion.findById(mostRecentDiscussionId)
        data.discussions.mostRecent = {
            date: mostRecentDiscussion.createdAt,
            courseName: (await Course.findById(mostRecentDiscussion.courseId)).name
        }
    }

    data.recentLogin = this.recentLogin ? this.recentLogin : null
    return data
}


module.exports = mongoose.model('Dashboard', dashboardSchema)