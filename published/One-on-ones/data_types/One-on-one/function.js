function(ellipsis) {
  const db = require('ellipsis-default-storage');
const key = ellipsis.userInfo.ellipsisUserId.trim();

db.getItem({
  itemId: key,
  itemType: "one-on-ones",
  ellipsis: ellipsis,
  onSuccess: function(response, body) {
    ellipsis.success(JSON.parse(JSON.parse(body)));
  },
  onError: err => {
    ellipsis.success([]);
  }
});
}
