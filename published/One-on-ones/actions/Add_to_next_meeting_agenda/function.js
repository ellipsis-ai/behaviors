function(addition, existingAgenda, meeting, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi.ActionsApi(ellipsis);

const newAgenda = `${existingAgenda}  \n${addition}`;

api.run({
  actionName: "Set next meeting agenda",
  args: [ { name: "meeting", value: meeting.id }, { name: "agenda", value: newAgenda }]
}).then(res => {
  api.run({ actionName: "Check add agenda" }).then(res => ellipsis.noResponse()); 
});
}
