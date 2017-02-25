function(ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

ellipsisApi.promiseToSay({ message: "Good morning!", ellipsis: ellipsis }).then(response => {
  ellipsisApi.promiseToRunAction({
    actionName: "Answer status questions",
    ellipsis: ellipsis
  }).then(response => ellipsis.noResponse());
});
}
