function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);
const RandomResponse = require('ellipsis-random-response');
const greeting = RandomResponse.greetingForTimeZone(ellipsis.teamInfo.timeZone);

api.say({ message: greeting }).then(response => {
  api.run({ actionName: "Start answer status questions" }).then(response => ellipsis.noResponse());
});
}
