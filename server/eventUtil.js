


const User = require("./models/User");
const Dashboard = require("./models/Dashboard");
const Event = require("./models/Event");

module.exports = {
    // To make sure there are no typos when sending an event as parameter.
    events: {
        group_created: 'group_created',
        left_group: 'left_group',
        added_to_group: 'added_to_group',
        new_files: 'new_files',
        profile_update: 'profile_update',
        course_added: 'course_added',
        left_course: 'left_course',
        new_material: 'new_material',
        updated_material: 'updated_material',
        deleted_course: 'deleted_course',
        new_course: 'new_course',
        new_assignment: 'new_assignment',
        submitted_assignment: 'submitted_assignment',
        speech_to_text: 'speech_to_text',
        image_to_text: 'image_to_text',
        calendar_update: 'calendar_update',
    },

    addDashboardEvent: async function (userId, title, ...args) {
        const user = await User.findById(userId)
        const dashboard = await Dashboard.findById(user.dashboard)

        const event = await Event.create({ title, args })
        dashboard.events.push(event._id)
        await dashboard.save()
    },
}