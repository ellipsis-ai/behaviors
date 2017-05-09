function(meeting, ellipsis) {
  const Formatter = require('ellipsis-cal-date-format');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const ellipsisApi = require('ellipsis-post-message');

const calendarId = meeting.calendarId;
const eventId = meeting.id;

fetchNextInstance().then(instance => {
  fetchNextExceptionBefore(new Date(instance.start.dateTime)).then( exception => {
    const instanceToUse = exception || instance;
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
}).catch(ellipsis.error);

function existingAgendaPromptFor(existingAgenda) {
  if (existingAgenda.trim().length === 0) {
    return "No one has set an agenda for this meeting yet";
  } else {
    return `Your existing agenda is:  \n\`\`\`\n${existingAgenda}\n\`\`\``;
  }
}

function fetchNextExceptionBefore(beforeTime) {
  return new Promise((resolve, reject) => {
    const start = (new Date()).toISOString();
    const options = {
      timeMin: start,
      timeMax: beforeTime.toISOString(),
      orderBy: 'startTime',
      singleEvents: true
    };
    cal.events.list(meeting.calendarId, options, (err, instances) => {
      if (err) {
        reject(err);
      }  else {
        resolve(instances.items.filter(ea => ea.recurringEventId === eventId)[0]);
      }
    })
  });
}

function fetchNextInstance() {
  return new Promise((resolve, reject) => {
    const start = (new Date()).toISOString();
    const options = {
      timeMin: start,
      maxResults: 1
    };
    cal.events.instances(calendarId, eventId, options, (err, instances) => {
      if (err) {
        reject(err);
      }  else {
        resolve(instances.items[0]);
      }
    })
  });
}
}
