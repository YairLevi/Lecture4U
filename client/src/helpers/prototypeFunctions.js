Date.prototype.getMonthAndDay = function () {
    const day = this.getDate()
    const month = this.toLocaleString('default', { month: 'short' })
    return `${month} ${day}`
}

Date.prototype.parseEventDate = function () {
    const day = this.getDate()
    const month = this.toLocaleString('default', { month: 'short' })
    const hour = this.getHours()
    const dayTime = hour > 11 ? 'PM' : 'AM'
    let minute = this.getMinutes()
    if (minute < 10) { minute = `0${minute}`}
    return `${month} ${day}\n${hour}:${minute} ${dayTime}`
}

Date.prototype.getTimeString = function () {
    const hour = this.getHours()
    const minute = this.getMinutes() < 10 ? `0${this.getMinutes()}` : this.getMinutes()
    const period = hour > 11 ? 'PM' : 'AM'
    return `${hour}:${minute} ${period}`
}

Date.prototype.todayString = function () {
    const today = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = days[today.getDay()]
    const date = this.getMonthAndDay()
    return `${day}, ${date}`
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
