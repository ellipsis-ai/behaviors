function(meeting, agenda, ellipsis) {
  const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const calendarId = meeting.calendarId;
const eventId = meeting.id;

const calendars = require("calendars");

calendars.fetchNextInstanceToUseFor(calendarId, eventId, cal).then(instanceToUse => {
  updateDescriptionOf(instanceToUse).then(result => {
    ellipsis.success(instanceToUse.htmlLink);
  });
});

function updateDescriptionOf(event) {
  return new Promise((resolve, reject) => {
    const data = {
      description: agenda
    };
    cal.events.patch(calendarId, eventId, data, (err, res) => {
      if (err) {
        reject(err);
      }  else {
        resolve();
      }
    })
  });
}
}
