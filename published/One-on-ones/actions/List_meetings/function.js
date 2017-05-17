function(ellipsis) {
  const meetings = require("meetings");

meetings.get(ellipsis).then(meetings => {
  ellipsis.success({
    isEmpty: meetings.length === 0,
    meetings: meetings
  })
});
}
