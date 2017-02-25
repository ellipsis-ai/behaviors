function(ellipsis) {
  const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;

const from = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();

function mostRecentByUserIn(arr) {
  const byUser = groupBy(arr, "userIdForContext");
  const userResults = [];
  Object.keys(byUser).forEach(key => {
    const pv = byUser[key].sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)[0].paramValues;
    userResults.push({ user: key, today: pv.today, yesterday: pv.yesterday, blockers: pv.blockers });
  });
  return userResults;
}

function statusAnswers() {
  return new Promise((resolve, reject) => {
    getActionLogs({ 
      action: "Answer status questions",
      from: from,
      to: new Date(),
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  });
}

const NO_RESPONSE = "_(no response yet)_";
 
statusAnswers().then(response => {
  const results = mostRecentByUserIn(response);
  ellipsis.success(results.map(ea => {
    return {
      user: ea.user,
      yesterday: (ea.yesterday ? ea.yesterday : NO_RESPONSE),
      today: (ea.today ? ea.today : NO_RESPONSE),
      blockers: (ea.blockers ? ea.blockers : NO_RESPONSE)
    };
  }));
});
}
