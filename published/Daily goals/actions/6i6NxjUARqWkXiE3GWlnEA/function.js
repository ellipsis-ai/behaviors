function(ellipsis) {
  const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;

const from = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();

function mostRecentByMeIn(arr) {
  const byUser = groupBy(arr, "ellipsisUserId");
  Object.keys(byUser).forEach(key => {
    byUser[key] = byUser[key].sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)[0];
  });
  return byUser[ellipsis.userInfo.ellipsisUserId];
}

getActionLogs({ 
  action: "ask me about my goals for today",
  from: from,
  to: new Date(),
  ellipsis: ellipsis,
  success: response => {
    const result = mostRecentByMeIn(response);
    if (result) {
      ellipsis.success({
        hasGoals: true,
        goals: result.paramValues.goals
      });
    } else {
      ellipsis.success({ hasGoals: false });  
    }
  },
  error: ellipsis.error
});

}
