function(shouldAddAgenda, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);

if (shouldAddAgenda) {
  api.run({ actionName: "Start add to next meeting agenda" }).then(res => ellipsis.noResponse());
} else {
  ellipsis.success();
}
}
