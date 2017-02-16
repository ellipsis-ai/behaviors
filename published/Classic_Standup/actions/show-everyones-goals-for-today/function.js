function(ellipsis) {
  const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;

const from = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();

function mostRecentByUserIn(arr) {
  const byUser = groupBy(arr, "userIdForContext");
  Object.keys(byUser).forEach(key => {
    byUser[key] = byUser[key].sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)[0];
  });
  return byUser;
}

function userResultsIn(dailyGoalsByUser) {
  const userResults = {};
  Object.keys(dailyGoalsByUser).forEach(user => {
    userResults[user] = { goals: dailyGoalsByUser[user] }; 
  });
  return Object.keys(userResults).map(user => {
    return Object.assign({}, { user: user }, userResults[user]);
  });
}

function dailyGoals() {
  return new Promise((resolve, reject) => {
    getActionLogs({ 
      action: "ask me about my goals for today",
      from: from,
      to: new Date(),
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  })
}
 
dailyGoals().then(dailyGoalsResponse => {
  const results = userResultsIn(mostRecentByUserIn(dailyGoalsResponse));
  ellipsis.success(results.map(ea => {
    return {
      user: ea.user,
      goals: (ea.goals ? ea.goals.paramValues.goals : "_(no response yet)_")
    };
  }));
});
}
