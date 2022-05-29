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