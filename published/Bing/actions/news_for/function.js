function(
input,
ellipsis
) {

'use strict'
var Client = require('node-rest-client').Client;
var client = new Client();
const bingSearchApiKey = ellipsis.env.BING_API_KEY;

var args = {
    parameters: {
      q: input,
      count: 5
    },
    headers: {
      "Ocp-Apim-Subscription-Key": bingSearchApiKey
    }
};

client.get("https://api.cognitive.microsoft.com/bing/v5.0/news/search", args, function (data, response) {
  for (let n of data.value) {
    n.providerName=n.provider[0].name;
  }
  ellipsis.success(data);
});

}
