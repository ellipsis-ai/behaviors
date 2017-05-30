function(meeting, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);

const preamble = "You have a 1:1 coming up. Here is the agenda so you can prepare:";

api.say({ message: preamble }).then(res => {
  const argValue = { id: meeting.id, label: meeting.label };
  api.run({
    actionName: "Next meeting agenda",
    args: [{ name: "meeting", value: JSON.stringify(argValue) }]
  }).then(res => ellipsis.noResponse());
});
}
