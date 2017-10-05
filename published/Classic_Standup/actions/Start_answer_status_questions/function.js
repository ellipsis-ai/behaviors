function(yesterday, today, blockers, channel, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;
const RandomResponse = require('ellipsis-random-response');

if (blockers.id === 'other') {
  api.run({ 
    actionName: "Collect blocker input",
    args: [ 
      { name: "yesterday", value: yesterday },
      { name: "today", value: today },
      { name: "channel", value: channel }
    ]
  }).then(res => ellipsis.noResponse());
} else {
  api.run({
    actionName: "Answer status questions",
    args: [
      { name: "yesterday", value: yesterday },
      { name: "today", value: today },
      { name: "blockers", value: blockers.label },
      { name: "channel", value: channel }
    ]
  }).then(res => ellipsis.noResponse());
}
}
