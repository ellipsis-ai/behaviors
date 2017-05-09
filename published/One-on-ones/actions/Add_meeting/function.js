function(calendarEvent, ellipsis) {
  const db = require("ellipsis-default-storage");
const ellipsisApi = require('ellipsis-post-message');

const key = ellipsis.userInfo.ellipsisUserId.trim();
const itemType = "one-on-ones";

existingMeetings().then(existing => {
  addMeetingTo(existing).then(res => {
    const message = `👥 OK, I added it ${existingMeetingsTextFor(existing.length)}.`;
    ellipsisApi.promiseToSay({ message: message, ellipsis: ellipsis }).then(res => {
      ellipsisApi.promiseToRunAction({
        actionName: "Check add another meeting",
        ellipsis: ellipsis
      }).then(res => ellipsis.noResponse());
    });
  });                     
});

function existingMeetingsTextFor(existingLength) {
  if (existingLength === 0) {
    return "as the first meeting I'm tracking for you";
  } else if (existingLength === 1) {
    return "as the second meeting I'm tracking for you";
  } else {
    return `to the ${existingLength} meetings I'm already tracking for you`;
  }
}

function addMeetingTo(existing) {
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
