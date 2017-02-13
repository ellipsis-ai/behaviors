function(project, name, storyType, description, ellipsis) {
  const fetch = require('node-fetch');
const FormData = require('form-data');

const baseUrl = 'https://www.pivotaltracker.com/services/v5/';
const url = `${baseUrl}projects/${project.id}/stories`;

var form = new FormData();
form.append('name', name);
form.append('project_id', project.id);
form.append('story_type', storyType.id);
form.append('description', description);

fetch(url, {
  method: 'POST',
  headers: {
    'X-TrackerToken': ellipsis.accessTokens.pivotalTracker
  },
  body: form
}).then((response) => response.json())
  .then((json) => ellipsis.success(json));
}
