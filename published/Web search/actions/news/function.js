function(topic, searchApiKey, ellipsis) {
  // This action uses the Bing News Search API: 
// https://www.microsoft.com/cognitive-services/en-us/bing-news-search-api
// and it is part of Microsoft Cognitive APIs.
// As of December 2016 the Bing Web Search API has the following free tier account:
// "Across all Bing Search APIs (Web, Image, Video, News): 1,000 transactions per
// month, 5 per second. Trial keys expire after a 90 day period, after which a 
// subscription may be purchased on the Azure portal."

'use strict';
const bing_news_api_url = "https://api.cognitive.microsoft.com/bing/v5.0/news/search";
const results_per_query = 5;
const RestClient = require('node-rest-client').Client;
const client = new RestClient();
const args = {
  parameters: { q: topic, count: results_per_query },
  headers: { "Ocp-Apim-Subscription-Key": searchApiKey }
};
client.get(bing_news_api_url, args, (data, response) => {
  for (let n of data.value) { n.providerName = n.provider[0].name; }
  ellipsis.success(data);
});
}
