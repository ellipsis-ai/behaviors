function(calendar, whenToAnnounceVacations, channel, ellipsis) {
  const PM = require('ellipsis-post-message');
const schedule = PM.promiseToSchedule;
const unschedule = PM.promiseToUnschedule;

unschedule({
  action: "who's away today",
  channel: channel,
  ellipsis: ellipsis
}).then(r => schedule({
  action: "who's away today",
  recurrence: `every weekday at ${whenToAnnounceVacations}`,
  channel: channel,
  ellipsis: ellipsis
})).then(r => ellipsis.success("All done!"))
  .catch(e => ellipsis.error(e));
}
