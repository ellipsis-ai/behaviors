function(channel, ellipsis) {
  const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;

const from = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();

function mostRecentByUserIn(arr) {
  const byUser = groupBy(arr, "userIdForContext");
  const userResults = [];
  Object.keys(byUser).forEach(key => {
    const mostRecent = byUser[key].sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)[0];
    userResults.push(Object.assign({}, mostRecent.paramValues, {user: key, timestamp: mostRecent.timestamp}));
  });
  return userResults;
}

function channelForComparison(channel) {
  return channel.trim().replace(/#/, ""); 
}

function filteredByChannel(actionLogs) {
  return actionLogs.filter(ea => {
    return ea.paramValues.channel && 
      (channelForComparison(ea.paramValues.channel) === channelForComparison(channel));
  });
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
  }).then(filteredByChannel);
}

function usersAsked() {
  return new Promise((resolve, reject) => {
    getActionLogs({
      action: "Check standup status",
      from: from,
      to: new Date(),
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  }).then(filteredByChannel);
}

const NO_RESPONSE = "_(no response yet)_";

function whenFor(timestamp) {
  const inZone = moment(timestamp).tz(ellipsis.teamInfo.timeZone);
  const todayStart = moment().tz(ellipsis.teamInfo.timeZone).startOf('day');
  if (inZone.isAfter(todayStart)) {
    return inZone.format('h:mma');
  } else {
    return inZone.format('h:mma on MMMM Do');
  }
}
 
usersAsked().then(usersAskedResponse => {
  const askedByUser = mostRecentByUserIn(usersAskedResponse);
  statusAnswers().then(response => {
    const results = mostRecentByUserIn(response);
    const answeredResults = results.map(ea => {
      return {
        user: ea.user,
        yesterday: (ea.yesterday ? ea.yesterday : NO_RESPONSE),
        today: (ea.today ? ea.today : NO_RESPONSE),
        today2: (ea.today2 ? ea.today2 : NO_RESPONSE),
        blockers: (ea.blockers ? ea.blockers : NO_RESPONSE),
        when: whenFor(ea.timestamp)
      };
    });
    const slackers = askedByUser.filter(eaAsked => {
      return results.findIndex(eaAnswered => eaAnswered.user === eaAsked.user) === -1;
    }).map(ea => ea.user);
    ellipsis.success({
      answeredResults: answeredResults,
      slackers: slackers,
      hasSlackers: slackers.length > 0,
      nobodyWasAsked: askedByUser.length === 0,
      timeZone: ellipsis.teamInfo.timeZone
    });
  });
})
}
