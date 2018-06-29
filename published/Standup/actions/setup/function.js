function(channel, whenToAsk, whenToDisplaySummary, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;

function unscheduleAction(actionName) {
  return api.unschedule({
    actionName: actionName,
    channel: channel.trim()
  });
}

function scheduleAction(actionName, timeOfDay, useDM) {
  const recurrence = `every weekday at ${timeOfDay}`;
  return api.schedule({
    actionName: actionName,
    args: [{ name: "channel", value: channel }],
    channel: channel.trim(),
    recurrence: recurrence,
    useDM: useDM
  });
}

function setUpAction(action, newTimeOfDay, useDM) {
  return unscheduleAction(action).then(() => {
    return scheduleAction(action, newTimeOfDay, useDM)
  });
}

setUpAction("Check standup status", whenToAsk, true).
  then(() => setUpAction("Standup status summary", whenToDisplaySummary, false), ellipsis.error).
  then(() => ellipsis.success("All done!"), ellipsis.error);
}
