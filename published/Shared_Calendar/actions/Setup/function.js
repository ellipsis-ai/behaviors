function(calendar, whenToAnnounceVacations, channel, ellipsis) {
  const PM = require('ellipsis-post-message');
const schedule = PM.promiseToSchedule;
const unschedule = PM.promiseToUnschedule;

unschedule({
  message: "who's away today",
  channel: channel,
  ellipsis: ellipsis
}).then(() => schedule({
  message: "who's away today",
  recurrence: `every weekday at ${whenToAnnounceVacations}`,
  channel: channel,
  ellipsis: ellipsis
})).then(() => ellipsis.success("All done!"))
  .catch(ellipsis.error);
}
