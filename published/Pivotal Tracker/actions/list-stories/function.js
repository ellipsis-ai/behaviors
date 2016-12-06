function(project, ellipsis) {
  var tracker = require('pivotaltracker');
var client = new tracker.Client(ellipsis.accessTokens.pivotalTracker);
 
client.project(project.id).stories.all(function(error, stories) {
  if (error) {
    ellipsis.error(error);
  } else {
    ellipsis.success(stories);
  }
});
}
