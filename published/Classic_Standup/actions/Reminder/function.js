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

function remind() {
  return ellipsisApi.promiseToSay({
    message: "Don't forget to answer your standup status questions soon!",
    ellipsis: ellipsis
  });
}

function validResponse(response) {
  if (!response.length) {
    return false;
  }
  var firstResponse = response[0].paramValues;
  return firstResponse.yesterday && firstResponse.today && firstResponse.blockers;
}

statusAnswers().then(response => {
  if (!validResponse(response)) {
    remind().then(r => {
      ellipsis.noResponse();
    });
  } else {
    ellipsis.noResponse();
  }
});
}
