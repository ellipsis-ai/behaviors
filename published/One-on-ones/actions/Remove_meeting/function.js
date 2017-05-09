function(meeting, ellipsis) {
  const db = require("ellipsis-default-storage");
const key = ellipsis.userInfo.ellipsisUserId.trim();
const itemType = "one-on-ones";

existingMeetings().then(existing => {
  removeMeetingFrom(existing).then(res => {
    ellipsis.success(`OK, I removed:  \n\`\`\`\n${meeting.label}\n\`\`\``);
  }).catch(ellipsis.error);                     
}).catch(ellipsis.error);

function removeMeetingFrom(existing) {
  return new Promise((resolve, reject) => {
    const newMeetings = existing.filter(ea => ea.id !== meeting.id);
    db.putItem({
      itemId: key,
      itemType: itemType,
      item: JSON.stringify(newMeetings),
      ellipsis: ellipsis,
      onSuccess: resolve,
      onError: reject
    });
  });
}

function existingMeetings() {
  return new Promise((resolve, reject) => {
    db.getItem({
      itemId: key,
      itemType: itemType,
      ellipsis: ellipsis,
      onSuccess: function(response, body) {
        resolve(JSON.parse(JSON.parse(body)));
      },
      onError: function(err) {
        resolve([]);
      }
    }); 
  });
}
}
