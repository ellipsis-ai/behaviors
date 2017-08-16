function(ellipsis) {
  "use strict";

const moment = require('moment-timezone');
moment.tz.setDefault(ellipsis.teamInfo.timeZone);
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const Formatter = require('ellipsis-cal-date-format');

list();

function list() {
  const now = moment();
  const min = now.clone();
  const max = now.clone().add(8, 'minutes');
  cal.events.list("primary", {
    timeMin: min.toISOString(),
    timeMax: max.toISOString(),
    orderBy: 'startTime',
    singleEvents: true
  }, (err, res) => {
    if (err) {
      ellipsis.error(`Error ${err.code}: ${err.message}`);
    } else if (!res.items) {
      ellipsis.error("There was a problem fetching your calendar. Google Calendar may be experiencing a hiccup.");
    } else {
      const tz = res.timeZone || ellipsis.teamInfo.timeZone;
      moment.tz.setDefault(tz);
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
          items: items.map((event) => {
            return Object.assign({}, event, {
              formattedEvent: Formatter.formatEvent(event, tz, now.format(Formatter.formats.YMD), { details: true })
            });
          })
        });
      }
    }
  });
}
}
