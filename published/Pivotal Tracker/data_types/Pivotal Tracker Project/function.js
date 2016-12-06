function(ellipsis) {
  var tracker = require('pivotaltracker');
var client = new tracker.Client(ellipsis.accessTokens.pivotalTracker);
 
client.projects.all(function(error, projects) {
  if (error) {
    ellipsis.error(error);
  } else {
    ellipsis.success(projects.map (ea => {
      return { id: ea.id.toString(), label: ea.name }; 
    }));
  }
});
}
