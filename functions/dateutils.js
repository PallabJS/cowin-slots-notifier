/**
 * Returns the date after daycount days ahead
 * @param {*} daycount days ahead to increment to
 * @returns String Date: "d-m-y"
 */
export function getNextDateFormatted(daycount = 0) {
    // 86400000 is one day in millis
    let daysIntoMillis = daycount * 86400000;

    let today = new Date();

    let newDate = today.getTime() + daysIntoMillis;
    newDate = new Date(newDate);

    return `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;
}
