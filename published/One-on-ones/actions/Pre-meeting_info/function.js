function(meeting, ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

const preamble = "You have a 1:1 coming up. Here is the agenda so you can prepare:";

ellipsisApi.promiseToSay({ message: preamble, ellipsis: ellipsis }).then(res => {
  const argValue = { id: meeting.id, label: meeting.label };
  ellipsisApi.promiseToRunAction({
    actionName: "Next meeting agenda",
    args: [{ name: "meeting", value: JSON.stringify(argValue) }],
    ellipsis: ellipsis
  }).then(res => ellipsis.noResponse());
});
}
