function(ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');
const RandomResponse = require('ellipsis-random-response');
const greeting = RandomResponse.greetingForTimeZone(ellipsis.teamInfo.timeZone);

ellipsisApi.promiseToSay({ message: greeting, ellipsis: ellipsis }).then(response => {
  ellipsisApi.promiseToRunAction({
    actionName: "Answer status questions",
    ellipsis: ellipsis
  }).then(response => ellipsis.noResponse());
});
}
