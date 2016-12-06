function(project, name, storyType, description, ellipsis) {
  const tracker = require('pivotaltracker');
const client = new tracker.Client(ellipsis.accessTokens.pivotalTracker);
 
const newStory = {
  name: name,
  project_id: project.id,
  story_type: storyType.id,
  description: description
};
client.project(project.id).stories.create(newStory, function(error, result) {
  if (error) {
    ellipsis.error(error);
  } else {
    ellipsis.success(result);
  }
});
}
