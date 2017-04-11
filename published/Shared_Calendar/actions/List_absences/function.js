function(calendar, when, ellipsis) {
  "use strict";

const moment = require('moment-timezone');
moment.tz.setDefault(ellipsis.teamInfo.timeZone);
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const now = moment();
const Formatter = require('ellipsis-cal-date-format');
const parseDate = require('parse-messy-time');

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

let min, max;
if (/^today$/i.test(when)) {
  min = now;
  max = now.clone().startOf('day').add(1, 'days');
} else if (/^tomorrow$/i.test(when)) {
  min = now.clone().startOf('day').add(1, 'days');
  max = min.clone().add(1, 'days');
} else {
  try {
    min = moment(parseDateIntoObject(when));
    max = min.clone().startOf('day').add(1, 'days');
  } catch(e) {
    ellipsis.error(`I couldn’t understand the date you entered: “${when}”\n\nTry “today” or “tomorrow” or a date like “2020-01-01”.`);
  }
}

const formattedPeriod = min.format(Formatter.formats.ALL_DAY);

cal.events.list(calendar.id, {
  timeMin: min.toISOString(),
  timeMax: max.toISOString(),
  orderBy: 'startTime',
  singleEvents: true
}, (err, res) => {
  if (err) {
    ellipsis.error(`Error ${err.code}: ${err.message}`);
  } else {
    const items = res.items.slice()
    const result = {
      isEmpty: items.length === 0,
      formattedPeriod: formattedPeriod,
      header: (
        items.length === 1 ?
          `1 vacation for ${formattedPeriod}:` :
          `${items.length} vacations for ${formattedPeriod}:`
      ),
      items: items.map((ea) => {
        return Object.assign({}, ea, {
          formattedEventTime: Formatter.formatEvent(ea, ellipsis.teamInfo.timeZone)
        });
      })
    };
    ellipsis.success(result);
  }
});
}
