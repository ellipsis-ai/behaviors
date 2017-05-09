function(shouldAddAgenda, ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

if (shouldAddAgenda) {
  ellipsisApi.promiseToRunAction({
    actionName: "Start add to next meeting agenda",
    ellipsis: ellipsis
  }).then(res => ellipsis.noResponse());
} else {
  ellipsis.success();
}
}
