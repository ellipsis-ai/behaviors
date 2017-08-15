/*
Support code for one-on-ones
@exportId ZqrsZ449SCqIkypf1U7tUQ
*/
module.exports = (function() {
const db = require('ellipsis-default-storage');
const itemType = "one-on-ones";

return {
  get: get,
  add: add,
  remove: remove,
  removeAll: removeAll
};

function get(ellipsis) {
  return new Promise((resolve, reject) => {
    const key = ellipsis.userInfo.ellipsisUserId.trim();
    db.getItem({
      itemId: key,
      itemType: itemType,
      ellipsis: ellipsis,
      onSuccess: function(response, body) {
        resolve(JSON.parse(JSON.parse(body)));
      },
      onError: err => {
        resolve([]);
      }
    });
  });
}

function add(calendarEvent, ellipsis) {
  return get(ellipsis).then(existing => {
    addTo(existing, calendarEvent, ellipsis);
  });
}

function addTo(existing, calendarEvent, ellipsis) {
  const key = ellipsis.userInfo.ellipsisUserId.trim();
  return new Promise((resolve, reject) => {
    db.putItem({
      itemId: key,
      itemType: itemType,
      item: JSON.stringify(existing.concat([calendarEvent])),
      ellipsis: ellipsis,
      onSuccess: resolve,
      onError: reject
    });
  });
}

function remove(meeting, ellipsis) {
  return get(ellipsis).then(existing => {
    const key = ellipsis.userInfo.ellipsisUserId.trim();
    const newMeetings = existing.filter(ea => ea.id !== meeting.id);
    return new Promise((resolve, reject) => {
      db.putItem({
        itemId: key,
        itemType: itemType,
        item: JSON.stringify(newMeetings),
        ellipsis: ellipsis,
        onSuccess: resolve,
        onError: reject
      });
    });
  });
}

function removeAll(ellipsis) {
  const key = ellipsis.userInfo.ellipsisUserId.trim();
  return new Promise((resolve, reject) => {
    db.putItem({
      itemId: key,
      itemType: itemType,
      item: JSON.stringify([]),
      ellipsis: ellipsis,
      onSuccess: () => resolve(),
      onError: reject
    });
  });
}
})()
     