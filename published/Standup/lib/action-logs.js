/*
@exportId UMLHL2_sTjGrBOucKAaJAw
*/
module.exports = (function() {
const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;

return function(channel, ellipsis) {
  return {
    queryWindowStart: queryWindowStartFor(ellipsis),
    questionLogs: questionLogsFn(channel, ellipsis),
    answerLogs: answerLogsFn(channel, ellipsis)
  };
};

function queryWindowStartFor(ellipsis) {
  return moment.tz(new Date(), ellipsis.teamInfo.timeZone).subtract(4, 'day').toDate();
}

function channelForComparison(channel) {
  return channel.trim().replace(/#/, ""); 
}

function filteredByChannel(actionLogs, channel) {
  return actionLogs.filter(ea => {
    return ea.paramValues.channel && 
      (channelForComparison(ea.paramValues.channel) === channelForComparison(channel));
  });
}

function logsFor(actionName, channel, from, ellipsis, optionalUser) {
  return new Promise((resolve, reject) => {
    getActionLogs({
      action: actionName,
      from: from,
      to: new Date(),
      userId: optionalUser,
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  }).then(logs => filteredByChannel(logs, channel));
}

function mostRecentByUserIn(arr) {
  const byUser = groupBy(arr, "userIdForContext");
  const userResults = [];
  Object.keys(byUser).forEach(key => {
    const mostRecent = byUser[key].sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)[0];
    userResults.push(Object.assign({}, mostRecent.paramValues, {user: key, timestamp: mostRecent.timestamp}));
  });
  return userResults;
}

function logsForFn(actionName, channel, ellipsis, optionalStartTimestamp) {
  return function(optionalUser, optionalStartTimestamp) {
    const from = optionalStartTimestamp || queryWindowStartFor(ellipsis);
    return logsFor(actionName, channel, from, ellipsis, optionalUser).then(logs => {
      return mostRecentByUserIn(logs);
    }); 
  }
}

function questionLogsFn(channel, ellipsis, optionalStartTimestamp) {
  return logsForFn('Check standup status', channel, ellipsis, optionalStartTimestamp);
}

function answerLogsFn(channel, ellipsis, optionalStartTimestamp) {
  return logsForFn('Answer status questions', channel, ellipsis, optionalStartTimestamp);
}
})()
     