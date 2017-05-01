function(ellipsis) {
  "use strict";

const moment = require('moment-timezone');
moment.tz.setDefault(ellipsis.teamInfo.timeZone);
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const now = moment();
const Formatter = require('ellipsis-cal-date-format');

function format(event) {
  return Formatter.formatEvent(event, ellipsis.teamInfo.timeZone, now.format(Formatter.formats.YMD));
}

let min = now.clone();
let max = now.clone().add(8, 'minutes');

cal.events.list("primary", {
  timeMin: min.toISOString(),
  timeMax: max.toISOString(),
  orderBy: 'startTime',
  singleEvents: true
}, (err, res) => {
  if (err) {
    ellipsis.error(`Error ${err.code}: ${err.message}`);
  } else {
    const items = res.items.filter((ea) => {
      return moment(ea.start.dateTime).isAfter(now.clone().add(2, 'minutes').add(30, 'seconds'))
    });
    if (items.length === 0) {
      ellipsis.noResponse();
    } else {
      ellipsis.success({
        heading: items.length > 1 ?
          `Reminder: there are ${items.length} events on your calendar.` :
          `Reminder: there’s an event on your calendar.`,
        items: items.map((ea) => {
          let optionalData = "";
          if (ea.description) {
            optionalData += `${ea.description}  \n`;
          }
          if (ea.location) {
            optionalData += `_Where: ${ea.location}_  \n`;
          }
          return Object.assign({}, ea, {
            formattedEventTime: format(ea),
            optionalHangoutLink: ea.hangoutLink ? `[Join hangout](${ea.hangoutLink})` : "",
            optionalData: optionalData
          });
        })
      });
    }
  }
});
}
