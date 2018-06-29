function(channel, ellipsis) {
  const groupBy = require('group-by');
const moment = require('moment-timezone');
const getActionLogs = require('ellipsis-action-logs').get;

const ActionLogs = require('action-logs')(channel, ellipsis);

const from = moment.tz(new Date(), ellipsis.teamInfo.timeZone).subtract(4, 'day').toDate();

const NO_RESPONSE = "_(no response yet)_";
const todayStart = moment().tz(ellipsis.teamInfo.timeZone).startOf('day');

function whenFor(timestamp) {
  const inZone = moment(timestamp).tz(ellipsis.teamInfo.timeZone);
  if (inZone.isAfter(todayStart)) {
    return inZone.format('h:mma');
  } else {
    return inZone.format('h:mma on MMMM Do');
  }
}
 
ActionLogs.questionLogs().then(askedByUser => {
  ActionLogs.answerLogs().then(answered => {
    const results = answered.filter(ea => {
      const lastAsked = askedByUser.find(eaAsked => eaAsked.user === ea.user);
      const cutoff = lastAsked ? moment.min(moment(lastAsked.timestamp), todayStart) : todayStart;
      return moment(ea.timestamp).isAfter(cutoff);
    });
    const answeredResults = results.map(ea => {
      return {
        user: ea.user,
        yesterday: (ea.yesterday ? ea.yesterday : NO_RESPONSE),
        today: (ea.today ? ea.today : NO_RESPONSE),
        today2: (ea.today2 ? ea.today2 : NO_RESPONSE),
        blockers: (ea.blockers ? ea.blockers : NO_RESPONSE),
        when: whenFor(ea.timestamp)
      };
    });
    const slackers = askedByUser.filter(eaAsked => {
      return results.findIndex(eaAnswered => eaAnswered.user === eaAsked.user) === -1;
    }).map(ea => ea.user);
    ellipsis.success({
      answeredResults: answeredResults,
      slackers: slackers,
      hasSlackers: slackers.length > 0,
      nobodyWasAsked: askedByUser.length === 0,
      timeZone: moment().tz(ellipsis.teamInfo.timeZone).format("z")
    });
  });
})
}
