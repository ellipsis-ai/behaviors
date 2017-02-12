function(phrase, searchApiKey, ellipsis) {
  // This action uses the Bing Image Search API: 
// https://www.microsoft.com/cognitive-services/en-us/bing-image-search-api
// and it is part of Microsoft Cognitive APIs.
// As of December 2016 the Bing Web Search API has the following free tier account:
// "Across all Bing Search APIs (Web, Image, Video, News): 1,000 transactions per
// month, 5 per second. Trial keys expire after a 90 day period, after which a 
// subscription may be purchased on the Azure portal."


'use strict';
const bing_image_api_url = "https://api.cognitive.microsoft.com/bing/v5.0/images/search";
const results_per_query = 1;
const RestClient = require('node-rest-client').Client;
const client = new RestClient();
const args = {
  parameters: { q: phrase, count: results_per_query },
  headers: { "Ocp-Apim-Subscription-Key": searchApiKey}
};
client.get(bing_image_api_url, args, (data, response) => {
  ellipsis.success(data);
});


}
