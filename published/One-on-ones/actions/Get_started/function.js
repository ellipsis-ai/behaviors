function(ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

Promise.all([doScheduling(), intro()]).then(res => ellipsis.noResponse());

function intro() {
  return ellipsisApi.promiseToRunAction({
    actionName: "Intro add meeting",
    ellipsis: ellipsis
  });
}

function doScheduling() {
  return ellipsisApi.promiseToUnschedule({
    actionName: "Check meetings",
    userId: ellipsis.userInfo.ellipsisUserId,
    ellipsis: ellipsis
  }).then(r => ellipsisApi.promiseToSchedule({
    actionName: "Check meetings",
    recurrence: `every hour at 0 minutes`,
    ellipsis: ellipsis
  }));
}
}
