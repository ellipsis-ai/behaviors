function(searchQuery, ellipsis) {
  const moment = require('moment-timezone');
const rrule = require('rrule');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);

const db = require('ellipsis-default-storage');
const itemType = "one-on-ones";
const meetingsKey = ellipsis.userInfo.ellipsisUserId.trim();

const min = moment();
const max = min.clone().startOf('day').add(30, 'days');

fetchCalendars().then(calendars => {
  fetchEvents(calendars).then(events => {
    fetchExistingMeetings().then(meetings => {
      const meetingIds = meetings.map(m => m.id);
      const filtered = events
        .filter(ea => ea.eventType === "recurring")
        .filter(ea => searchQuery.toLowerCase().trim() === "show all" || ea.label.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(ea => meetingIds.indexOf(ea.id) === -1);
      ellipsis.success(filtered);
    });
  });
}).catch(ellipsis.error);

function fetchExistingMeetings() {
  return new Promise((resolve, reject) => {
    db.getItem({
      itemId: meetingsKey,
      itemType: itemType,
      ellipsis: ellipsis,
      onSuccess: function(response, body) {
        resolve(JSON.parse(JSON.parse(body)));
      },
      onError: resolve([])
    }); 
  });
}

function fetchCalendars() {
  return new Promise((resolve, reject) => {
    cal.calendarList.list((err, calendarList) => {
      if (err) {
        reject(err);
      }  else {
        const calendars = calendarList.items
          .filter(ea => ea.accessRole === "owner")
          .map(ea => {
            return { label: ea.summary, id: ea.id };
          });
        resolve(calendars);
      }
    });
  });
}

function flatten(arr) { 
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
    []
  );
}

function recurrenceTextFor(event) {
  if (!event.recurrence) {
    return ""; 
  }
  try {
    const ruleString = event.recurrence.join("\n");
    const rule = rrule.rrulestr(ruleString);
    const tz = event.start.timeZone || ellipsis.teamInfo.timeZone;
    const timeFormat = "HH:mm a zz";
    const startTime = moment(event.start.dateTime).tz(tz).format(timeFormat);
    const endTime = moment(event.end.dateTime).tz(tz).format(timeFormat);
    return rule ? `${rule.toText()} @ ${startTime} - ${endTime}` : ruleString;
  } catch (e) {
    return "";
  }
}

function labelFor(event) {
  const attendees = event.attendees || [];
  const attendeesWithoutSelf = attendees.filter(ea => !ea.self);
  const attendeesText = attendeesWithoutSelf.length ? (" - " + attendeesWithoutSelf.map(ea => ea.email).join(", ")) : "";
  return `${event.summary}${attendeesText} — ${recurrenceTextFor(event)}`;
}

function fetchEvents(calendars) {
  return Promise.all(
    calendars.map(calendar => {
      return new Promise((resolve, reject) => {
        const options = {
          timeMin: min.toISOString(),
          timeMax: max.toISOString()
        };
        cal.events.list(calendar.id, options, (err, eventList) => {
          if (err) {
            reject(err);
          }  else {
            const events = eventList.items.map(ea => {
              return { 
                label: labelFor(ea), 
                id: ea.id, 
                calendarId: calendar.id,
                eventType: (ea.recurrence ? "recurring" : "instance")
              };
            });
            resolve(events);
          }
        })
      });
    })
  ).then(eventLists => flatten(eventLists));
}
}
