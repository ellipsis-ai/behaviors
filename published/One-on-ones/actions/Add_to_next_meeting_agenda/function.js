function(addition, existingAgenda, meeting, ellipsis) {
  const ellipsisApi = require('ellipsis-post-message');

const newAgenda = `${existingAgenda}  \n${addition}`;

ellipsisApi.promiseToRunAction({
  actionName: "Set next meeting agenda",
  args: [ { name: "meeting", value: meeting.id }, { name: "agenda", value: newAgenda }],
  ellipsis: ellipsis
}).then(res => {
  ellipsisApi.promiseToRunAction({
    actionName: "Check add agenda",
    ellipsis: ellipsis
  }).then(res => ellipsis.noResponse()); 
});
}
