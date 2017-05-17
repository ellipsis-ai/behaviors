function(ellipsis) {
  const db = require("ellipsis-default-storage");
const meetings = require("meetings");

meetings.get(ellipsis).then(res => ellipsis.success(res));
}
