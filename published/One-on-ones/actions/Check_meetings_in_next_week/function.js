function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi.ActionsApi(ellipsis);

api.run({
  actionName: "Check meetings in window",
  args: [ { name: "windowStartsInHours", value: 0 }, { name: "windowLengthInHours", value: 168 } ]
}).then(res => ellipsis.noResponse());
}
