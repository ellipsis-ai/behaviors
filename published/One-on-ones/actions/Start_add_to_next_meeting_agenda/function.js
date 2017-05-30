function(meeting, ellipsis) {
  const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);

const calendars = require('calendars');

const calendarId = meeting.calendarId;
const eventId = meeting.id;

calendars.fetchNextInstanceToUseFor(calendarId, eventId, cal).then(instanceToUse => {
  const existingAgenda = instanceToUse.description || "";
  api.say({ message: existingAgendaPromptFor(existingAgenda) }).then(res => {
    api.run({
      actionName: "Add to next meeting agenda",
      args: [ 
        { name: "meeting", value: meeting.id }, 
        { name: "existingAgenda", value: existingAgenda }
      ]
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
