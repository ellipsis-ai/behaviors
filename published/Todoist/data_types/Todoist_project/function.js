function(ellipsis) {
  const fetch = require("fetch");
const todoistToken = ellipsis.accessTokens.todoist;
const apiUrl = `https://todoist.com/API/v7/sync?token=${todoistToken}&sync_token=*&resource_types=["projects"]`;

fetch.fetchUrl(apiUrl, {}, (error, meta, body) => {
  if (error) {
    ellipsis.error(error);
  } else if (meta.status == 200) {
    const data = JSON.parse(body.toString());
    const resultData = data.projects.map((ea) => {
      return {
        id: ea.id.toString(),
        label: ea.name
      };
    });
    ellipsis.success(resultData); 
  } else {
    ellipsis.error("Error: " + body.toString()); 
  }
});
}
