function(ellipsis) {
  const fetch = require('node-fetch');
const url = 'https://www.pivotaltracker.com/services/v5/projects';

fetch(url, {
  method: 'GET',
  headers: {
    'X-TrackerToken': ellipsis.accessTokens.pivotalTracker
  }
}).then((response) => response.json())
  .then((json) => {
    ellipsis.success(json.map (ea => {
      return { id: ea.id.toString(), label: ea.name };
    }));
});
}
