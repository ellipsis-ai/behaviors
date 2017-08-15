function(ellipsis) {
  const meetings = require("meetings");

meetings.removeAll(ellipsis).then(res => ellipsis.success());
}
