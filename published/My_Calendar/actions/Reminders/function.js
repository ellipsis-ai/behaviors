function(ellipsis) {
  "use strict";

const moment = require('moment-timezone');
moment.tz.setDefault(ellipsis.userInfo.timeZone || ellipsis.teamInfo.timeZone);
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
    const errorMessage = "An error occurred while checking your Google calendar for upcoming events. You may try running `...what's on my calendar now` to see if it happens again. The problem may be temporary.";
    if (err) {
      throw new ellipsis.Error(`Error ${err.code}: ${err.message}`, {
        userMessage: errorMessage
      });
    } else if (!res.items) {
      throw new ellipsis.Error("Google Calendar returned an invalid response (no items).", {
        userMessage: errorMessage
      });
    } else {
      const tz = res.timeZone || ellipsis.teamInfo.timeZone;
      moment.tz.setDefault(tz);
      const items = res.items.filter((ea) => {
        return moment(ea.start.dateTime).isAfter(now.clone().add(2, 'minutes').add(30, 'seconds'))
      });
      if (items.length === 0) {
        if (ellipsis.event.originalEventType === "scheduled") {
          ellipsis.noResponse();
        } else {
          ellipsis.success({
            hasItems: false
          });
        }
      } else {
        ellipsis.success({
          hasItems: true,
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
