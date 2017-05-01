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

let min = now;
let max = now.clone().startOf('day').add(1, 'days');

cal.events.list("primary", {
  timeMin: min.toISOString(),
  timeMax: max.toISOString(),
  orderBy: 'startTime',
  singleEvents: true
}, (err, res) => {
  if (err) {
    ellipsis.error(`Error ${err.code}: ${err.message}`);
  } else {
    const items = res.items.slice();
    let heading = "";
    if (items.length === 0) {
      heading = "🎉 There’s nothing on your calendar for the rest of the day.";
    } else if (items.length === 1) {
      heading = "There’s 1 event on your calendar today:";
    } else {
      heading = `There are ${items.length} events on your calendar today:`;
    }
    const result = {
      heading: heading,
      items: items.map((ea) => {
        return Object.assign({}, ea, {
          formattedEventTime: format(ea),
          optionalHangoutLink: ea.hangoutLink ? `· [Join hangout](${ea.hangoutLink})` : ""
        });
      })
    };
    ellipsis.success(result);
  }
});
}
