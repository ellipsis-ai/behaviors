function(ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');
const RandomResponse = require('ellipsis-random-response');
const greeting = RandomResponse.greetingForTimeZone(ellipsis.teamInfo.timeZone);

ellipsisApi.promiseToSay({ message: greeting, ellipsis: ellipsis })
  .then(response1 => {
    ellipsisApi.promiseToRunAction({
      actionName: "goal-history",
      args: [{ name: "whoseGoals", value: "my" }],
      ellipsis: ellipsis
    }).then(response2 => {
      ellipsisApi.promiseToRunAction({
        actionName: "set-goals",
        ellipsis: ellipsis
      }).then(response3 => {
        ellipsis.noResponse();
      });
    });
  });
}
