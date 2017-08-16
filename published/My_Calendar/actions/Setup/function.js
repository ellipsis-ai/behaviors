function(whenToAnnounce, shouldRemind, ellipsis) {
  "use strict";

const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const PM = require('ellipsis-post-message');
const schedule = PM.promiseToSchedule;
const unschedule = PM.promiseToUnschedule;
let successMessage = "";
let calendarName;

cal.calendars.get("primary", (err, res) => {
  if (err) {
    ellipsis.error(`Error retrieving your primary calendar (${err.code}): ${err.message}`);
  } else {
    calendarName = res.summary;
    doScheduling();
  }
});

function doScheduling() {
  unschedule({
    actionName: "Agenda",
    userId: ellipsis.userInfo.ellipsisUserId,
    ellipsis: ellipsis
  }).then(r => {
    unschedule({
      actionName: "Reminders",
      userId: ellipsis.userInfo.ellipsisUserId,
      ellipsis: ellipsis
    });
  }).then(r => {
    if (whenToAnnounce !== "none") {
      schedule({
        actionName: "Agenda",
        recurrence: `every weekday at ${whenToAnnounce}`,
        ellipsis: ellipsis
      });
    }
  }).then(r => {
    const calendarNameText = calendarName ? `the calendar **${calendarName}**` : "your primary calendar";
    successMessage += whenToAnnounce === "none" ?
      `OK. I won’t send you an agenda in this channel.` :
      `OK! I’ll show you the events on ${calendarNameText} every weekday at ${whenToAnnounce} in this channel.`;
    if (shouldRemind) {
      successMessage += whenToAnnounce === "none" ?
        `\n\nHowever, I will send you reminders a few minutes before each event begins.` :
        `\n\nI’ll also send you reminders a few minutes before each event begins.`;
      return schedule({
        actionName: "Reminders",
        recurrence: "every 5 minutes",
        ellipsis: ellipsis
      });
    } else {
      return true;
    }
  }).then(r => ellipsis.success(successMessage + "\n\nTo change these settings, say “setup my calendar” again." ))
    .catch(e => ellipsis.error(e));
}
}
