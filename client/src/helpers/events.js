if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

Date.prototype.parseEventDate = function() {
    const day = this.getDate()
    const month = this.toLocaleString('default', { month: 'short' })
    const hour = this.getHours()
    const dayTime = hour > 11 ? 'PM' : 'AM'
    const minute = this.getMinutes()
    return `${month} ${day}\n${hour}:${minute} ${dayTime}`
}

const colors = {
    GREEN: '#37c225',
    BLUE: '#317de8',
    RED: '#cf3232',
    YELLOW: '#e8e241',
    GREY: '#787878',
}

export const eventSettings = {
    // added
    group_created: {
        color: colors.RED,
        text: 'You created a new group, {0}',
    },
    // added
    left_group: {
        color: colors.RED,
        text: 'You left group {0}, you are no longer a member'
    },
    // added
    added_to_group: {
        color: colors.RED,
        text: '{0} has added you to the group {1}',
    },
    // added
    new_files: {
        color: colors.RED,
        text: '{0} has uploaded new files to group {1}',
    },
    // added
    profile_update: {
        color: colors.YELLOW,
        text: 'You have updated your profile details or image',
    },
    // added
    course_added: {
        color: colors.BLUE,
        text: 'You enrolled in course {0}. Take a seat!',
    },
    // added
    left_course: {
        color: colors.BLUE,
        text: 'You left course {0}, you will no longer be a student there',
    },
    // added
    new_material: {
        color: colors.BLUE,
        text: 'New material has been uploaded to course {0}',
    },
    // added
    updated_material: {
        color: colors.BLUE,
        text: 'Some existing material has been updated in course {0}',
    },
    // added
    deleted_course: {
        color: colors.BLUE,
        text: 'You deleted your course {0}',
    },
    // added
    new_course: {
        color: colors.BLUE,
        text: 'You created a new course, {0}',
    },
    // added
    new_assignment: {
        color: colors.GREEN,
        text: 'A new assignment has been uploaded at course {0}',
    },
    // added
    submitted_assignment: {
        color: colors.GREEN,
        text: 'You submitted your solution to assignment {0} at course {1}',
    },
    speech_to_text: {
        color: colors.GREY,
        text: 'You used the Speech to Text tool',
    },
    image_to_text: {
        color: colors.GREY,
        text: 'You used the Image to Text tool',
    },
    calendar_update: {
        color: colors.GREY,
        text: 'You changed tour schedule in the calendar',
    },
}


