function(windowStartsInHours, windowLengthInHours, ellipsis) {
  const moment = require('moment-timezone');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const Formatter = require('ellipsis-cal-date-format');

const db = require('ellipsis-default-storage');
const key = ellipsis.userInfo.ellipsisUserId;

const notifyWindowStart = moment().clone().add(windowStartsInHours, "hours");
const notifyWindowEnd = notifyWindowStart.clone().add(windowLengthInHours, "hours");

const now = moment().tz(ellipsis.teamInfo.timeZone);

const fakeEmployeeInfo = [
  {
    email: "m@ellipsis.ai",
    name: "Matteo Melani",
    position: "CEO",
    birthDateThisYear: moment().month("April").day(17)
  },
  {
    email: "luke@ellipsis.ai",
    name: "Luke Andrews",
    position: "VP Product & Design",
    birthDateThisYear: moment().month("July").day(31)
  },
  {
    email: "andrew@ellipsis.ai",
    name: "Andrew Catton",
    position: "CTO",
    birthDateThisYear: moment().month("January").day(14)
  }
];

function fakeEmployeeInfoFor(attendee) {
  if (attendee) {
    const info = fakeEmployeeInfo.find(ea => ea.email === attendee.email);
    if (info) {
      return `**Name:** ${info.name}  \n**Position:** ${info.position}  \n`;
    } else {
      return ""; 
    }
  } else {
    return ""; 
  }
}

getMeetings().then(meetings => {
  Promise.all(meetings.map(ea => {
    return fetchNextInstanceToUseFor(ea.calendarId, ea.id);
  })).then(instances => {
    const toNotify = instances.filter(ea => ea).filter(shouldNotify).map(ea => {
      const formattedEvent = Formatter.formatEvent(ea, ellipsis.teamInfo.timeZone, now.format(Formatter.formats.YMD), { details: true });
      const otherAttendee = (ea.attendees || []).filter(ea => !ea.self)[0];
      const employeeInfo = fakeEmployeeInfoFor(otherAttendee);
      return {
        event: formattedEvent,
        employeeInfo: employeeInfo
      };
    });
    if (toNotify.length) {
      const prompt = (toNotify.length === 1) ?
        "You have a one-on-one meeting coming up." :
        "You have some one-on-one meetings coming up.";
      ellipsis.success({
        prompt: prompt + " Here's some info to help you prepare:",
        meetings: toNotify
      });
    } else {
      ellipsis.noResponse();
    }
  });
}).catch(ellipsis.error);


function format(event) {
  return Formatter.formatEvent(event, ellipsis.teamInfo.timeZone, now.format(Formatter.formats.YMD));
}

function shouldNotify(instance) {
  const start = ensureDateForStartOf(instance);
  return start >= notifyWindowStart && start < notifyWindowEnd;
}

function getMeetings() {
  return new Promise((resolve, reject) => {
    db.getItem({
      itemId: key,
      itemType: "one-on-ones",
      ellipsis: ellipsis,
      onSuccess: function(response, body) {
        resolve(JSON.parse(JSON.parse(body)));
      },
      onError: err => resolve([])
    });
  });
}

function ensureDateFor(dateTimeString) {
  const timestamp = Date.parse(dateTimeString)
  if (isNaN(timestamp)) {
    return new Date();
  } else {
    return new Date(timestamp);
  }
}

function ensureDateForStartOf(instance) {
  const dateTimeString = (instance && instance.start) ? instance.start.dateTime : null;
  return ensureDateFor(dateTimeString);
}

function fetchNextInstanceToUseFor(calendarId, eventId) {
  return fetchNextInstance(calendarId, eventId).then(instance => {
    const start = ensureDateForStartOf(instance);
    return fetchNextExceptionBefore(calendarId, eventId, start).then( exception => {
      return exception || instance;
    });
  });
}

function fetchNextExceptionBefore(calendarId, eventId, beforeTime) {
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

function fetchNextInstance(calendarId, eventId) {
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
