function(
input,
onSuccess, onError, ellipsis
) {

var Client = require('node-rest-client').Client;
var client = new Client();
const bingSearchApiKey = ellipsis.env.BING_SEARCH_API_KEY;

var args = {
    parameters: {
      q: input,
      count: 1
    },
    headers: {
      "Ocp-Apim-Subscription-Key": bingSearchApiKey
    }
};

client.get("https://api.cognitive.microsoft.com/bing/v5.0/images/search", args, function (data, response) {
  ellipsis.success(data);
});
}
