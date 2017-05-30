function(calendarEvent, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi.ActionsApi(ellipsis);

const meetings = require('meetings');

meetings.get(ellipsis).then(existing => {
  meetings.add(calendarEvent, ellipsis).then(res => {
    const message = `👥 OK, I added it ${existingMeetingsTextFor(existing.length)}.`;
    api.say({ message: message }).then(res => {
      api.run({ actionName: "Check add another meeting" }).then(res => ellipsis.noResponse());
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
