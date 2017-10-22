function(channel, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;
const ActionLogs = require('action-logs')(channel, ellipsis);
const moment = require('moment-timezone');

const userId = ellipsis.ellipsisUserId;

ActionLogs.questionLogs(userId).then(questionLogs => {
  if (questionLogs.length) {
    const lastAskedTimestamp = moment(questionLogs[0].timestamp).toDate();
    ActionLogs.answerLogs(ellipsis.ellipsisUserId, lastAskedTimestamp).then(answerLogs => {
      if (answerLogs.length) {
        ellipsis.noResponse(); // already answered
      } else {
        const args = [{ name: "channel", value: channel }];
        api.run({ actionName: "Check standup status", args: args }).then(response => ellipsis.noResponse());
      }
    });
  } else {
    ellipsis.noResponse(); // wasn't asked
  }
});
}
