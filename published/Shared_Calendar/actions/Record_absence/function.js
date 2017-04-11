function(channels, description, start, end, calendar, ellipsis) {
  "use strict";

const fetch = require('node-fetch');
const moment = require('moment-timezone');
moment.tz.setDefault(ellipsis.teamInfo.timeZone);
const parseDate = require('parse-messy-time');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const Formatter = require('ellipsis-cal-date-format');
const PostMessage = require('ellipsis-post-message');

add();

function getDetails() {
  const userName = getUserName();
  const dateRange = getDateRange();
  return {
    summary: `${userName} away from work`,
    description: description,
    start: dateRange.start,
    end: dateRange.end
  }
}

function parseDateIntoObject(dateString) {
  const d = parseDate(dateString);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    hours: d.getHours(),
    minutes: d.getMinutes()
  };
}

function getDateRange() {
  const startMoment = moment(parseDateIntoObject(start));
  const endMoment = moment(parseDateIntoObject(end));
  const isAllDay = startMoment.hours() === 0 && startMoment.minutes() === 0 &&
        endMoment.hours() === 0 && endMoment.minutes() === 0;
  if (isAllDay) {
    return {
      start: {
        date: startMoment.format('Y-MM-DD')
      },
      end: {
        date: endMoment.format('Y-MM-DD')
      }
    };
  } else {
    return {
      start: {
        dateTime: startMoment.toISOString()
      },
      end: {
        dateTime: endMoment.toISOString()
      }
    };
  }
}

function getUserName() {
  let name;
  try {
    name = ellipsis.userInfo.messageInfo.details.profile.realName;
  } catch(e) {
    ellipsis.error("This action needs to be triggered from Slack so I know who will be away.");
  }
  return name || "Unknown";
}

function add() {
  cal.events.insert(calendar.id, getDetails(), (err, result) => {
    if (err) {    
      ellipsis.error(`Error ${err.code}: ${err.message}`);
    } else {
      notify({
        summary: result.summary,
        link: result.htmlLink,
        when: Formatter.formatEvent(result, ellipsis.teamInfo.timeZone),
        location: (result.location || "").trim(),
        hasLocation: !!result.location
      });
    }
  });
}

function notify(eventDetails) {
  const channelNames = channels.split(",").map((ea) => ea.trim());
  const numChannels = channelNames.length;
  const message = `🗓 I'm sorry to report that ${getUserName()} will be away from the office ${eventDetails.when} (${description})`;
  let responses = [];
  channelNames.forEach((channelName, index) => {
    PostMessage.promiseToSay({
      ellipsis: ellipsis,
      message: message,
      channel: channelName
    }).then(response => {
        responses.push(channelName);
        if (responses.length === numChannels) {
          const result = Object.assign({
            channelNames: channelNames
          }, eventDetails);
          ellipsis.success(result);
        }
      }).catch(err => {
        ellipsis.error(
          `I had trouble notifying the channel “${channelName}”, but `+
          (responses.length > 0 ? 
            `I notified ${responses.join(', ')} and ` : '') +
          `the event was created: ${eventDetails.link}.`
        );
      });
  });
}
}
