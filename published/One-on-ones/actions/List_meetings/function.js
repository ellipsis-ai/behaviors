function(ellipsis) {
  const db = require('ellipsis-default-storage');
const key = ellipsis.userInfo.ellipsisUserId;

db.getItem({
  itemId: key,
  itemType: "one-on-ones",
  ellipsis: ellipsis,
  onSuccess: function(response, body) {
    const meetings = JSON.parse(JSON.parse(body));
    ellipsis.success({
      isEmpty: meetings.length === 0,
      meetings: meetings
    });
  },
  onError: ellipsis.error
});
}
