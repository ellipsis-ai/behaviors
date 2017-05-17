function(meeting, ellipsis) {
  const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const ellipsisApi = require('ellipsis-post-message');
const calendars = require('calendars');

const calendarId = meeting.calendarId;
const eventId = meeting.id;

calendars.fetchNextInstanceToUseFor(calendarId, eventId, cal).then(instanceToUse => {
  const existingAgenda = instanceToUse.description || "";
  ellipsisApi.promiseToSay({
    message: existingAgendaPromptFor(existingAgenda),
    ellipsis: ellipsis
  }).then(res => {
    ellipsisApi.promiseToRunAction({
      actionName: "Add to next meeting agenda",
      args: [ 
        { name: "meeting", value: meeting.id }, 
        { name: "existingAgenda", value: existingAgenda }
      ],
      ellipsis: ellipsis
    }).then(res => ellipsis.noResponse());
  });
});

function existingAgendaPromptFor(existingAgenda) {
  if (existingAgenda.trim().length === 0) {
    return "No one has set an agenda for this meeting yet";
  } else {
    return `Your existing agenda is:  \n\`\`\`\n${existingAgenda}\n\`\`\``;
  }
}
}
