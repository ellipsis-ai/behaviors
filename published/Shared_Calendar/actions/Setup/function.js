function(calendar, whenToAnnounceVacations, channel, ellipsis) {
  const PM = require('ellipsis-post-message');
const schedule = PM.promiseToSchedule;
const unschedule = PM.promiseToUnschedule;

unschedule({
  actionName: "List absences",
  channel: channel,
  ellipsis: ellipsis
}).then(r => schedule({
  actionName: "List absences",
  recurrence: `every weekday at ${whenToAnnounceVacations}`,
  channel: channel,
  ellipsis: ellipsis
})).then(r => ellipsis.success("All done!"))
  .catch(e => ellipsis.error(e));
}
