function(channel, whenToAsk, whenToDisplaySummary, ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

function unscheduleAction(actionName) {
  return ellipsisApi.promiseToUnschedule({
    actionName: actionName,
    channel: channel.trim(),
    ellipsis: ellipsis
  });
}

function scheduleAction(actionName, timeOfDay, useDM) {
  const recurrence = `every weekday at ${timeOfDay}`;
  return ellipsisApi.promiseToSchedule({
    actionName: actionName,
    responseContext: "slack",
    channel: channel.trim(),
    recurrence: recurrence,
    useDM: useDM,
    ellipsis: ellipsis
  });
}

function setUpAction(action, newTimeOfDay, useDM) {
  return unscheduleAction(action).then(response => {
    return scheduleAction(action, newTimeOfDay, useDM)
  });
}

setUpAction("Check standup status", whenToAsk, true).
  then(() => setUpAction("Standup status summary", whenToDisplaySummary, false), ellipsis.error ).
  then(() => ellipsis.success("All done!"), ellipsis.error )
}
