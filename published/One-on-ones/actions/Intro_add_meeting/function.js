function(ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

ellipsisApi.promiseToSay({
  message: "To get started, you need to add your one on one meetings from Google Calendar events.",
  ellipsis: ellipsis
}).then(res => {
  ellipsisApi.promiseToRunAction({
    actionName: "Add meeting",
    ellipsis: ellipsis
  }).then(res => ellipsis.noResponse());
});
}
