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

const eventTypes = {
    GROUP_CREATED: 'group-created',
}

export const eventStrings = {
    'group-created': {
        color: '#f55',
        text: 'You created a new group, {0}'
    },
}


