function(ellipsis) {
  "use strict";

const moment = require('moment-timezone');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const Formatter = require('ellipsis-cal-date-format');

cal.calendars.get("primary", (err, res) => {
  if (err) {
    throw new ellipsis.Error(`An error occurred retrieving your primary calendar (${err.code}): ${err.message}`, {
      userMessage: "An error occurred while fetching your calendar from Google. You may try running `...what's on my calendar today` again to see if it was temporary."
    });
  } else {
    const tz = res.timeZone;
    list(tz || ellipsis.userInfo.timeZone || ellipsis.teamInfo.timeZone);
  }
});

function list(tz) {
  moment.tz.setDefault(tz);
  const now = moment();
  const min = now.clone();
  const max = now.clone().startOf('day').add(1, 'days');
  cal.events.list("primary", {
    timeMin: min.toISOString(),
    timeMax: max.toISOString(),
    orderBy: 'startTime',
    singleEvents: true
  }, (err, res) => {
    if (err) {
      ellipsis.error(`An error occurred fetching your calendar. (${err.code}: ${err.message})`);
    } else if (!res.items) {
      ellipsis.error("There was a problem fetching your calendar. Google Calendar may be experiencing a hiccup.");
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
        items: items.map((event) => {
          return Object.assign({}, event, {
            formattedEvent: Formatter.formatEvent(event, tz, now.format(Formatter.formats.YMD))
          });
        })
      };
      ellipsis.success(result);
    }
  });
}
}
