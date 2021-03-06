function(when, ellipsis) {
  const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;

function dateWithOffset(offset) {
  const date = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();
  date.setDate(date.getDate()+offset);
  return date;
}

function fromDateFor(text) {
  const today = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();
  switch (text) {
    case "yesterday":
      return dateWithOffset(-1);
    case "today":
      return dateWithOffset(0);
    default:
      return null;
  }
}

function toDateFor(fromDate) {
  if (from) {
    const to = new Date(from.getTime());
    to.setDate(from.getDate()+1);
    return to;
  } else {
    return null;
  }
}

const from = fromDateFor(when);
const to = toDateFor(from);

if (!from) {
  ellipsis.error(`Sorry, I don't know how to look up results for \`${when}\``);
}

function mostRecentByUserIn(arr) {
  const byUser = groupBy(arr, "userIdForContext");
  Object.keys(byUser).forEach(key => {
    byUser[key] = byUser[key].sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)[0];
  });
  return byUser;
}

function userResultsIn(dailyGoalsByUser, resultsByUser) {
  const userResults = {};
  Object.keys(dailyGoalsByUser).forEach(user => {
    userResults[user] = { goals: dailyGoalsByUser[user] }; 
  });
  Object.keys(resultsByUser).forEach(user => {
    userResults[user] = Object.assign({}, userResults[user], { result: resultsByUser[user] }); 
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
      to: to,
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  })
}

function outcome(dailyGoals) {
  return new Promise((resolve, reject) => {
    getActionLogs({
      action: "ask me how my day went",
      from: from,
      to: new Date(),
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  });
}
 
dailyGoals().then(dailyGoalsResponse => {
  outcome(dailyGoalsResponse).then(outcomeResponse => {
  const results = userResultsIn(mostRecentByUserIn(dailyGoalsResponse), mostRecentByUserIn(outcomeResponse));
    ellipsis.success(results.map(ea => {
      return {
        user: ea.user,
        goals: (ea.goals ? ea.goals.paramValues.goals : "_(no response yet)_"),
        wasSuccessful: (ea.result ? ea.result.paramValues.wasSuccessful.label : "_(no response yet)_"),
        why: (ea.result ? ea.result.paramValues.why : "_(no response yet)_")
      };
    }));
  });
});
}
