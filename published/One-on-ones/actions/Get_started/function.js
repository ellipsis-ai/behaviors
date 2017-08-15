function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;

Promise.all([doScheduling(), intro()]).then(res => ellipsis.noResponse());

function intro() {
  return api.say({
    message: "To get started, you need to add your one on one meetings from Google Calendar events.",
  }).then(res => {
    api.run({ actionName: "Add meeting" });
  });
}

function doScheduling() {
  return api.unschedule({
    actionName: "Check meetings",
    userId: ellipsis.userInfo.ellipsisUserId
  }).then(r => api.schedule({
    actionName: "Check meetings",
    recurrence: `every hour at 0 minutes`
  }));
}
}
