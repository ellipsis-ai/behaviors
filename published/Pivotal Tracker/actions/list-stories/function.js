function(project, storyState, ellipsis) {
  const fetch = require('node-fetch');

const baseUrl = 'https://www.pivotaltracker.com/services/v5/';
const url = `${baseUrl}projects/${project.id}/stories?with_state=${storyState.id}`;

fetch(url, {
  method: 'GET',
  headers: {
    'X-TrackerToken': ellipsis.accessTokens.pivotalTracker
  }
}).then((response) => response.json())
  .then((json) => {
    ellipsis.success({
      isEmpty: json.length === 0,
      stories: json
    });
});
}
