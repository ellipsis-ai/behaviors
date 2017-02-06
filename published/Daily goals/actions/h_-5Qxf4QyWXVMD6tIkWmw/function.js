function(ellipsis) {
  "use strict";

const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;
const postMessage = require('ellipsis-post-message').postMessage;

const from = moment.tz(new Date(), ellipsis.teamInfo.timeZone).startOf('day').toDate();

function outcome() {
  return new Promise((resolve, reject) => {
    getActionLogs({
      action: "ask me how my day went",
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
  return new Promise((resolve, reject) => {
    postMessage({
      message: "tell me I have one hour left to answer daily goals", 
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    }); 
  });
}

function check() {
  return new Promise((resolve, reject) => {
    postMessage({
      message: "check on daily goals", 
      ellipsis: ellipsis,
      success: response => {
        ellipsis.noResponse()
      },
      error: reject
    }); 
  });
}

outcome().then(outcomeResponse => {
  if (outcomeResponse.length === 0) {
    explain().then(response => check());
  } else {
    ellipsis.noResponse();
  }
});

}
