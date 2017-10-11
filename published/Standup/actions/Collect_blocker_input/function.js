function(yesterday, today, blockers, channel, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;

api.run({
  actionName: 'Answer status questions',
  args: [
    { name: "yesterday", value: yesterday },
    { name: "today", value: today },
    { name: "blockers", value: blockers },
    { name: "channel", value: channel }
  ]
}).then(res => ellipsis.noResponse());
}
