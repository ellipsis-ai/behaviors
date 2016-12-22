function(word_or_sentence, spellcheckApiKey, ellipsis) {
  // This Actios uses the Bing Spell Check API (https://www.microsoft.com/cognitive-services/en-us/bing-spell-check-api)
// The API is part of Microsoft Cognitive Services (https://www.microsoft.com/cognitive-services/en-us/apis)
// As of December 2016 the Bing Spell Check API has a free tier with the following limitations: 
// "5,000 transactions per month, 7 per minute".

'use strict'
const RestClient = require('node-rest-client').Client;
const client = new RestClient();
const args = {
    parameters: { mode: "proof", mkt: "en-us", text: word_or_sentence },
    headers: { "Ocp-Apim-Subscription-Key": spellcheckApiKey }
};
client.post("https://api.cognitive.microsoft.com/bing/v5.0/spellcheck", args, (data, response) => {
  const result = { comment: "", flaggedTokens: [] }
  if (data.flaggedTokens.length === 0) {
    result.comment = `**${word_or_sentence}** is a correct spelling.`;
  } else {
    result.comment = "Suggestions:";
    result.flaggedTokens=data.flaggedTokens
  }
  ellipsis.success(result);
});

}
