function(phrase, searchApiKey, ellipsis) {
  // This Action uses the Bing Web Search API: 
// https://www.microsoft.com/cognitive-services/en-us/bing-web-search-api
// and it is part of Microsoft Cognitive APIs.
// As of December 2016 the Bing Web Search API has the following free tier account:
// "Across all Bing Search APIs (Web, Image, Video, News): 1,000 transactions per
// month, 5 per second. Trial keys expire after a 90 day period, after which a 
// subscription may be purchased on the Azure portal."

'use strict';
const Intl = require('intl');
const bing_search_api_url = "https://api.cognitive.microsoft.com/bing/v5.0/search";
const results_per_query = 3;
const RestClient = require('node-rest-client').Client;
const client = new RestClient();
const args = {
  parameters: { q: phrase, count: results_per_query },
  headers: { "Ocp-Apim-Subscription-Key": searchApiKey }
};
client.get("https://api.cognitive.microsoft.com/bing/v5.0/search", args, (data, response) => {
  var numResultsShown = data.webPages.value.length;
  var numHits = data.webPages.totalEstimatedMatches;
  var title = "";
  if (numResultsShown === 0) {
    title = "No results found";
  } else if (numHits === 1) {
    title = "1 result";
  } else if (numHits <= results_per_query) {
    title = `${numHits} results`;
  } else {
    title = `Showing ${numResultsShown} of ${new Intl.NumberFormat().format(numHits)} results`;
  }
  ellipsis.success({
    results: data.webPages.value,
    title: title
  });
});

}
