function(calendar, ellipsis) {
  "use strict";

const util = require('util');
const moment = require('moment-timezone')
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const now = moment().toISOString();
const Formatter = require('ellipsis-cal-date-format');
                          
cal.events.list(calendar.id, {
  timeMin: now,
  orderBy: 'startTime',
  singleEvents: true
}, (err, res) => {
  if (err) {
    ellipsis.error(`Error ${err.code}: ${err.message}`);
  } else {
    const truncatedItems = res.items.slice(0, 5)
    const result = {
      isEmpty: truncatedItems.length === 0,
      header: (
        truncatedItems.length === 1 ?
          `The next event:` :
          `The next ${truncatedItems.length} events:`
      ),
      items: truncatedItems.map((ea) => {
        return Object.assign({}, ea, {
          formattedEventTime: Formatter.formatEvent(ea, ellipsis.teamInfo.timeZone)
        });
      })
    };
    ellipsis.success(result);
  }
});
}
