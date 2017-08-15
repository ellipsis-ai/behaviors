function(meeting, ellipsis) {
  const Formatter = require('ellipsis-cal-date-format');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const calendarId = meeting.calendarId;
const eventId = meeting.id;
const calendars = require("calendars");

calendars.fetchNextInstanceToUseFor(meeting.calendarId, meeting.id, cal).then(instanceToUse => {
  ellipsis.success({
    description: instanceToUse.description,
    event: Formatter.formatEvent(instanceToUse)
  });
});
}
