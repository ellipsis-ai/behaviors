function(eventDescription, ellipsis) {
  "use strict";

const util = require('util');
const moment = require('moment-timezone');
const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const Formatter = require('ellipsis-cal-date-format');

function add() {
  cal.events.quickAdd('primary', eventDescription, {}, (err, result) => {
    if (err) {    
      ellipsis.error(`Error ${err.code}: ${err.message}`);
    } else {
      ellipsis.success({
        summary: result.summary,
        link: result.htmlLink,
        when: Formatter.formatEvent(result, ellipsis.teamInfo.timeZone),
        location: (result.location || "").trim(),
        hasLocation: !!result.location
      });
    }
  });
}

add();


}
