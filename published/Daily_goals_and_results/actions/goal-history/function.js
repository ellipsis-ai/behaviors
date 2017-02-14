function(whoseGoals, ellipsis) {
  "use strict";

const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;
const util = require('util');
const today = moment.tz(new Date(), ellipsis.teamInfo.timeZone);
const inspector = {};
const dateFormat = 'Y-MM-DD';
const dayFormat = 'dd';

function probablyOwnGoals() {
  const probablyMe = /\b(me|my|mine|you|your|yours)\b/i.test(whoseGoals);
  if (probablyMe && !ellipsisUserId()) {
    ellipsis.error("You asked for personal results, but I don’t know who asked. Try doing this from chat.");
  }
  return probablyMe;
}

function ellipsisUserId() {
  return ellipsis.userInfo.ellipsisUserId || "";
}

function countDaysToLastMonday() {
  // How many days away was last Monday, from 7–13
  // Note weekday numbering: Sunday = 0...Saturday = 6
  const todayNum = today.day();
  const diffFromMonday = todayNum === 0 ? 6 : todayNum - 1;
  return 7 + diffFromMonday;
}

function momentWithOffset(offset) {
  return today.clone().startOf('day').add(offset, 'days');
}

function momentFromTimestamp(timestamp) {
  return moment.tz(timestamp, ellipsis.teamInfo.timeZone);
}

const from = momentWithOffset(-countDaysToLastMonday()).toDate();
const to = momentWithOffset(0).toDate();

function daysForPeriod(format) {
  const period = [];
  const limit = countDaysToLastMonday();
  for (let i = -limit; i < 0; i++) {
    period.push(momentWithOffset(i).format(format));
  }
  return period;
}

function groupByUserArrangeByDay(arr) {
  const byUser = groupBy(arr, "userIdForContext");
  const byUserByDate = {};
  Object.keys(byUser).forEach(userId => {
    const sorted = byUser[userId].slice().sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);
    byUserByDate[userId] = {};
    sorted.forEach((ea) => {
      const dateKey = momentFromTimestamp(ea.timestamp).format(dateFormat);
      if (!byUserByDate[userId][dateKey]) {
        byUserByDate[userId][dateKey] = [];
      }
      byUserByDate[userId][dateKey].push(ea);
    });
  });
  return byUserByDate;
}

function userResultsIn(dailyGoalsByUser, resultsByUser) {
  const userResults = {};
  Object.keys(dailyGoalsByUser).forEach(user => {
    if (!userResults[user]) {
      userResults[user] = {
      };
    }
    userResults[user].goals = dailyGoalsByUser[user];
  });
  Object.keys(resultsByUser).forEach(user => {
    if (!userResults[user]) {
      userResults[user] = {};
    }
    userResults[user].results = resultsByUser[user];
  });
  return userResults;
}

function dailyGoals() {
  return new Promise((resolve, reject) => {
    const params = { 
      action: "ask me about my goals for today",
      from: from,
      to: to,
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    };
    if (probablyOwnGoals()) {
      params.userId = ellipsisUserId();
    }
    getActionLogs(params);
  })
}

function outcome(dailyGoals) {
  return new Promise((resolve, reject) => {
    const params = {
      action: "ask me how my day went",
      from: from,
      to: new Date(),
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    };
    if (probablyOwnGoals()) {
      params.userId = ellipsisUserId();
    }
    getActionLogs(params);
  });
}

function legend() {
  return `
${textForResult(true, true)} - Accomplished goal  
${textForResult(true, false)} - Didn’t accomplish goal  
${textForResult()} - Unknown result`;
}

function textForResult(hadGoal, success) {
  if (hadGoal && success === true) {
    return "♥︎";
  } else if (hadGoal && success === false) {
    return "×";
  } else {
    return "?";
  }
}

function columnPrefixFor(index) {
  return index > 0 && index % 7 === 0 ? " │  " : "";
}

function analyzeDayForUser(day, userResults, index) {
  let hadGoal = false;
  let success = null;
  if (userResults.goals && userResults.goals[day]) {
    hadGoal = true;
    if (userResults.results && userResults.results[day]) {
      const successValue = userResults.results[day][0].paramValues.wasSuccessful;
      const successLabel = successValue ? successValue.label : "";
      if (/yes/i.test(successLabel)) {
        success = true;
      } else if (/no/i.test(successLabel)) {
        success = false;
      }
    }
  }
  return {
    day: day,
    hadGoal: hadGoal,
    success: success,
    text: columnPrefixFor(index) + textForResult(hadGoal, success)
  };
}

function periodLabels() {
  return daysForPeriod('dd').map((ea, index) => {
    return columnPrefixFor(index) + ea.charAt(0);
  });
}

function heading(output) {
  if (!output.length) {
    if (probablyOwnGoals()) {
      return "You haven’t set any goals recently.";
    } else {
      return "Nobody has set any goals recently.";
    }
  } else {
    if (probablyOwnGoals()) {
      return "Here’s how your goals have gone recently:";
    } else {
      return "Here’s how the team’s goals have gone recently:";
    }
  }
}

function output(results) {
  const period = daysForPeriod(dateFormat);
  const perUserOutput = [];
  const labels = periodLabels();
  const userNames = Object.keys(results);
  userNames.forEach((userId, userIndex) => {
    const userResults = results[userId];
    const userOutput = {};
    userOutput.user = userId;
    userOutput.days = period.map((day, index) => analyzeDayForUser(day, userResults, index));
    userOutput.goalDays = userOutput.days.filter((day) => day.hadGoal).length;
    userOutput.successfulDays = userOutput.days.filter((day) => day.wasSuccessful).length;
    perUserOutput.push(userOutput);
  });
  ellipsis.success({
    periodLabels: periodLabels(),
    users: perUserOutput,
    legend: legend(),
    heading: heading(perUserOutput),
    includeEveryone: !probablyOwnGoals(),
    noResultsFound: !perUserOutput.length,
    includeThisWeek: period.length > 7
  });
}

dailyGoals().then(dailyGoalsResponse => {
  outcome(dailyGoalsResponse).then(outcomeResponse => {
    const results = userResultsIn(groupByUserArrangeByDay(dailyGoalsResponse), groupByUserArrangeByDay(outcomeResponse));
    output(results);
  });
});
}
