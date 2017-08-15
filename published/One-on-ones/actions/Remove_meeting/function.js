function(meeting, ellipsis) {
  const meetings = require("meetings");

meetings.remove(meeting, ellipsis).then(res => {
  ellipsis.success(`OK, I removed:  \n\`\`\`\n${meeting.label}\n\`\`\``);
});
}
