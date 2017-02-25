function(ellipsis) {
  "use strict";

const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;
const ellipsisApi = require('ellipsis-post-message');

const from = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();

function statusAnswers() {
  return new Promise((resolve, reject) => {
    getActionLogs({
      action: "Answer status questions",
      from: from,
      to: new Date(),
      userId: ellipsis.userInfo.ellipsisUserId,
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  });
}

function explain() {
  return ellipsisApi.promiseToSay({
    message: "You should answer your standup status questions soon!",
    ellipsis: ellipsis
  });
}

function check() {
  return ellipsisApi.promiseToRunAction({
    actionName: "Answer status questions",
    ellipsis: ellipsis
  });
}

statusAnswers().then(response => {
  if (response.length === 0) {
    explain().then(r => {
      return check();
    }).then(r => {
      ellipsis.noResponse();
    });
  } else {
    ellipsis.noResponse();
  }
});
}
