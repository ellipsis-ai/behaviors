function(channel, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;
const RandomResponse = require('ellipsis-random-response');
const greeting = RandomResponse.greetingForTimeZone(ellipsis.teamInfo.timeZone);

api.say({ message: greeting }).then(response => {
  api.say({message: `This is a standup checkin for ${channel}` }).then(response => {
    const name = "Answer status questions";
    const args = [ { name: "channel", value: channel }];
    api.run({ actionName: name, args: args }).then(response => ellipsis.noResponse());
  });
});
}
