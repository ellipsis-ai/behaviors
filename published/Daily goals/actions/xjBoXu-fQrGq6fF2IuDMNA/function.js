function(channel, whenToAskForDailyGoals, whenToDisplayGoals, whenToAskForOutcome, whenToShowReport, whenToRemind, ellipsis) {
  const postMessage = require('ellipsis-post-message').postMessage;

function unscheduleAction(action) {
  return new Promise((resolve, reject) => {
    postMessage({
      message: `…unschedule "${action}"`,
      channel: channel,
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  });
}

function scheduleAction(action, timeOfDay, useDM) {
  return new Promise((resolve, reject) => {
    const privateText = useDM ? "privately for everyone in this channel" : "";
    postMessage({
      message: `…schedule "${action}" ${privateText} every weekday at ${timeOfDay}`,
      channel: channel.trim(),
      ellipsis: ellipsis,
      success: resolve,
      error: reject
    });
  });
}

function setUpAction(action, newTimeOfDay, useDM) {
  return unscheduleAction(action).then(response => {
    scheduleAction(action, newTimeOfDay, useDM);
  });
}


setUpAction("morning checkin", whenToAskForDailyGoals, true).
  then( r => setUpAction("show everyone's goals for today", whenToDisplayGoals, false) ).
  then( r => setUpAction("check on daily goals", whenToAskForOutcome, true) ).
  then( r => setUpAction("remind me to answer daily goals", whenToRemind, true) ).
  then( r => setUpAction("how did everyone's day go", whenToShowReport, false) ).
  then( r => ellipsis.success("All done!") ).     
  catch( e => ellipsis.error(e) );
       
}
