function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);

api.run({ 
  actionName: "Check meetings in window",
  args: [ { name: "windowStartsInHours", value: 24 }, { name: "windowLengthInHours", value: 1 } ]
}).then(res => ellipsis.noResponse());
}
