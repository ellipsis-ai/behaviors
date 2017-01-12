function(reason, channels, calendar, ellipsis) {
  "use strict";

const fetch = require('node-fetch');
const FormData = require('form-data');
const util = require('util');
const moment = require('moment-timezone');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const ellipsisApiToken = ellipsis.token;
const Formatter = require('ellipsis-cal-date-format');

add();

function getDetails() {
  const userName = getUserName();
  const todayDate = moment().tz(ellipsis.teamInfo.timeZone).format('Y-MM-DD');
  const tomorrowDate = moment().tz(ellipsis.teamInfo.timeZone).add(1, 'days').format('Y-MM-DD');
  return {
    summary: `${userName} away from work`,
    description: `Reason: ${reason}`,
    start: {
      date: todayDate
    },
    end: {
      date: tomorrowDate 
    }
  }
}

function getUserName() {
  try {
    return ellipsis.userInfo.messageInfo.details.profile.realName;
  } catch(e) {
    ellipsis.error("This action needs to be triggered from Slack so I know who is away.");
  }
}

function add() {
  cal.events.insert(calendar.id, getDetails(), (err, result) => {
    if (err) {    
      ellipsis.error(`Error ${err.code}: ${err.message}`);
    } else {
      notify({
        summary: result.summary,
        link: result.htmlLink,
        when: Formatter.formatEvent(result, ellipsis.userInfo.timeZone),
        location: (result.location || "").trim(),
        hasLocation: !!result.location
      });
    }
  });
}

function notify(eventDetails) {
  const channelNames = channels.split(",").map((ea) => ea.trim());
  const numChannels = channelNames.length;
  const message = `...announce ${getUserName()} will be away ${eventDetails.when} because ${reason}`;
  let responses = [];
  channelNames.forEach((channelName, index) => {
    const data = new FormData();
    data.append('token', ellipsisApiToken);
    data.append('message', message);
    data.append('channel', channelName);
    data.append('responseContext', 'slack');
    fetch('https://bot.ellipsis.ai/api/post_message', {
      method: 'POST',
      body: data
    }).then((response) => {
      responses.push(channelName);
      if (responses.length === numChannels) {
        const result = Object.assign({
          channelNames: channelNames
        }, eventDetails);
        ellipsis.success(result);
      }
    }).catch((err) => {
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
