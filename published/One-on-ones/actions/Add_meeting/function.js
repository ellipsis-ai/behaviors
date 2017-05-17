function(calendarEvent, ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');
const meetings = require('meetings');

meetings.get(ellipsis).then(existing => {
  meetings.add(calendarEvent, ellipsis).then(res => {
    const message = `👥 OK, I added it ${existingMeetingsTextFor(existing.length)}.`;
    ellipsisApi.promiseToSay({ message: message, ellipsis: ellipsis }).then(res => {
      ellipsisApi.promiseToRunAction({
        actionName: "Check add another meeting",
        ellipsis: ellipsis
      }).then(res => ellipsis.noResponse());
    });
  });                     
});

function existingMeetingsTextFor(existingLength) {
  if (existingLength === 0) {
    return "as the first meeting I'm tracking for you";
  } else if (existingLength === 1) {
    return "as the second meeting I'm tracking for you";
  } else {
    return `to the ${existingLength} meetings I'm already tracking for you`;
  }
}
}
