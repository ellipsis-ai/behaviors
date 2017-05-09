function(meeting, agenda, ellipsis) {
  const Formatter = require('ellipsis-cal-date-format');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const calendarId = meeting.calendarId;
const eventId = meeting.id;

fetchNextInstance().then(instance => {
  fetchNextExceptionBefore(new Date(instance.start.dateTime)).then( exception => {
    const instanceToUse = exception || instance;
    updateDescriptionOf(instanceToUse).then(result => {
      ellipsis.success(instanceToUse.htmlLink);
    });
  });
}).catch(ellipsis.error);

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

function fetchNextExceptionBefore(beforeTime) {
  return new Promise((resolve, reject) => {
    const start = (new Date()).toISOString();
    const options = {
      timeMin: start,
      timeMax: beforeTime.toISOString(),
      orderBy: 'startTime',
      singleEvents: true
    };
    cal.events.list(calendarId, options, (err, instances) => {
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
