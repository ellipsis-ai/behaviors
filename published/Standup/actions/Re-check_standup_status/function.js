function(channel, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;
const ActionLogs = require('action-logs')(channel, ellipsis);
const moment = require('moment-timezone');
const RandomResponse = require('ellipsis-random-response');
const greeting = RandomResponse.greetingForTimeZone(ellipsis.teamInfo.timeZone);

const userId = ellipsis.ellipsisUserId;

ActionLogs.questionLogs(userId).then(questionLogs => {
  if (questionLogs.length) {
    const lastAskedTimestamp = moment(questionLogs[0].timestamp).toDate();
    ActionLogs.answerLogs(ellipsis.ellipsisUserId, lastAskedTimestamp).then(answerLogs => {
      if (answerLogs.length) {
        ellipsis.noResponse(); // already answered
      } else {
        api.say({ message: greeting }).then(response => {
          api.say({message: `Just checking in again with standup questions for ${channel}` }).then(response => {
            const name = "Answer status questions";
            const args = [ { name: "channel", value: channel }];
            api.run({ actionName: name, args: args }).then(response => ellipsis.noResponse());
          });
        });
      }
    });
  } else {
    ellipsis.noResponse(); // wasn't asked
  }
});
}
