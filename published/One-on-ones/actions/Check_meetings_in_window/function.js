function(windowStartsInHours, windowLengthInHours, ellipsis) {
  const moment = require('moment-timezone');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const Formatter = require('ellipsis-cal-date-format');
const meetings = require('meetings');
const calendars = require('calendars');

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

meetings.get(ellipsis).then(meetings => {
  Promise.all(meetings.map(ea => {
    return calendars.fetchNextInstanceToUseFor(ea.calendarId, ea.id, cal);
  })).then(instances => {
    const toNotify = instances.filter(ea => ea).filter(ea => calendars.shouldNotify(ea, notifyWindowStart, notifyWindowEnd)).map(ea => {
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
}
