function(yesterday, today, blockers, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);

api.run({
  actionName: 'Answer status questions',
  args: [
    { name: "yesterday", value: yesterday },
    { name: "today", value: today },
    { name: "blockers", value: blockers }
  ]
}).then(res => ellipsis.noResponse());
}
