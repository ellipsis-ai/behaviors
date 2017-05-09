function(ellipsis) {
  const db = require("ellipsis-default-storage");
const key = ellipsis.userInfo.ellipsisUserId.trim();
const itemType = "one-on-ones";

db.putItem({
  itemId: key,
  itemType: itemType,
  item: JSON.stringify([]),
  ellipsis: ellipsis,
  onSuccess: () => ellipsis.success("OK, I removed all of your 1:1 meetings"),
  onError: ellipsis.error
});
}
