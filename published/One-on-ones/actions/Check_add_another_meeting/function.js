function(shouldAddAnother, ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

if (shouldAddAnother) {
  ellipsisApi.promiseToRunAction({
    actionName: "Add meeting",
    ellipsis: ellipsis
  }).then(res => ellipsis.noResponse());
} else {
  ellipsisApi.promiseToRunAction({
    actionName: "Check add agenda",
    ellipsis: ellipsis
  }).then(res => ellipsis.noResponse());
}
}
