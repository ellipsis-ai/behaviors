function(keyword, searchApiKey, ellipsis) {
  // This Action uses the Bing Web Search API: 
// https://www.microsoft.com/cognitive-services/en-us/bing-web-search-api
// and it is part of Microsoft Cognitive APIs.
// As of December 2016 the Bing Web Search API has the following free tier account:
// "Across all Bing Search APIs (Web, Image, Video, News): 1,000 transactions per
// month, 5 per second. Trial keys expire after a 90 day period, after which a 
// subscription may be purchased on the Azure portal."

'use strict';
const bing_search_api_url = "https://api.cognitive.microsoft.com/bing/v5.0/search";
const results_per_query = 3;
const RestClient = require('node-rest-client').Client;
const client = new RestClient();
var args = {
    parameters: { q: keyword, count: results_per_query },
    headers: { "Ocp-Apim-Subscription-Key": searchApiKey }
};
client.get("https://api.cognitive.microsoft.com/bing/v5.0/search", args, function (data, response) {
  data.webPages.hits = data.webPages.totalEstimatedMatches.toLocaleString();
  ellipsis.success(data.webPages);
});


}
