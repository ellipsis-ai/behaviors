function(ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

ellipsisApi.promiseToRunAction({
  actionName: "Check meetings in window",
  args: [ { name: "windowStartsInHours", value: 0 }, { name: "windowLengthInHours", value: 168 } ],
  ellipsis: ellipsis
}).then(res => ellipsis.noResponse());
}
