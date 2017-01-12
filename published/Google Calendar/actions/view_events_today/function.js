function(calendar, ellipsis) {
  "use strict";

const util = require('util');
const moment = require('moment-timezone')
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const now = moment().tz(ellipsis.teamInfo.timeZone);
const todayEnd = moment().tz(ellipsis.teamInfo.timeZone).add(1, 'days').startOf('day');
const Formatter = require('ellipsis-cal-date-format');

cal.events.list(calendar.id, {
  timeMin: now.toISOString(),
  timeMax: todayEnd.toISOString(),
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
          `Today’s only event:` :
          `${items.length} events today:`
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
