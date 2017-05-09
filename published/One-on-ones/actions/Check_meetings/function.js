function(ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

ellipsisApi.promiseToRunAction({
  actionName: "Check meetings in window",
  args: [ { name: "windowStartsInHours", value: 24 }, { name: "windowLengthInHours", value: 1 } ],
  ellipsis: ellipsis
}).then(res => ellipsis.noResponse());
}
