function(ellipsis) {
  const fetch = require("fetch");
const todoistToken = ellipsis.accessTokens.todoist;
const apiUrl = `https://todoist.com/API/v7/sync?token=${todoistToken}&sync_token=*&resource_types=["items"]`;

fetch.fetchUrl(apiUrl, {}, (error, meta, body) => {
  if (error) {
    ellipsis.error(error);
  } else if (meta.status == 200) {
    ellipsis.success(JSON.parse(body.toString())); 
  } else {
    ellipsis.error("Error: " + body.toString()); 
  }
});
}
