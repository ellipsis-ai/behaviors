function(someone, ellipsis) {
  const fetch = require("fetch");
const url = "http://quandyfactory.com/insult/json";

fetch.fetchUrl(url, {}, (error, meta, body) => {
  if (error) {
    ellipsis.error(error);
  } else if (meta.status == 200) {
    ellipsis.success(JSON.parse(body.toString())); 
  } else {
    ellipsis.error("Error: " + body.toString()); 
  }
});
}
