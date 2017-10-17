function(whenToAnnounce, shouldRemind, ellipsis) {
  "use strict";

const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);
const EllipsisApi = ellipsis.require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;
let successMessage = "";
let calendarName;

cal.calendars.get("primary", (err, res) => {
  if (err) {
    throw new ellipsis.Error(`Error retrieving your primary calendar (${err.code}): ${err.message}`, {
      userMessage: "Sorry, an error occurred retrieving your primary calendar."
    });
  } else {
    calendarName = res.summary;
    doScheduling();
  }
});

function doScheduling() {
  api.unschedule({
    trigger: "what's on my calendar today",
    channel: ellipsis.userInfo.messageInfo.channel,
    userId: ellipsis.userInfo.ellipsisUserId
  }).then(r => {
    api.unschedule({
      trigger: "what's on my calendar now",
      channel: ellipsis.userInfo.messageInfo.channel,
      userId: ellipsis.userInfo.ellipsisUserId
    });
  }).then(r => {
    if (whenToAnnounce !== "none") {
      api.schedule({
        trigger: "what's on my calendar today",
        channel: ellipsis.userInfo.messageInfo.channel,
        recurrence: `every weekday at ${whenToAnnounce}`
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
      return api.schedule({
        trigger: "what's on my calendar now",
        channel: ellipsis.userInfo.messageInfo.channel,
        recurrence: "every 5 minutes"
      });
    } else {
      return true;
    }
  }).then(r => ellipsis.success(successMessage + "\n\nTo change these settings, say “setup my calendar” again." ))
    .catch(e => {
      throw new ellipsis.Error(e, { userMessage: "An error occurred while trying to create the schedule." });
    });
}
}
