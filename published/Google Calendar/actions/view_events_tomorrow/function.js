function(calendar, ellipsis) {
  "use strict";

const util = require('util');
const moment = require('moment-timezone')
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const now = moment().tz(ellipsis.userInfo.timeZone);
const tomorrowStart = moment().tz(ellipsis.teamInfo.timeZone).add(1, 'days').startOf('day');
const tomorrowEnd = moment().tz(ellipsis.teamInfo.timeZone).add(2, 'days').startOf('day');
const Formatter = require('ellipsis-cal-date-format');

cal.events.list(calendar.id, {
  timeMin: tomorrowStart.toISOString(),
  timeMax: tomorrowEnd.toISOString(),
  orderBy: 'startTime',
  singleEvents: true
}, (err, res) => {
  if (err) {
    ellipsis.error(`Error ${err.code}: ${err.message}`);
  } else {
    const items = res.items.slice()
    const result = {
      isEmpty: items.length === 0,
      header: (
        items.length === 1 ?
          `Tomorrow’s only event:` :
          `${items.length} events tomorrow:`
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
