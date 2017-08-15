function(shouldAddAnother, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;

if (shouldAddAnother) {
  api.run({ actionName: "Add meeting" }).then(res => ellipsis.noResponse());
} else {
  api.run({ actionName: "Check add agenda" }).then(res => ellipsis.noResponse());
}
}
