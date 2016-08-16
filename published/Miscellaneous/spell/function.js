function(
input,
ellipsis
) {
  var Client = require('node-rest-client').Client;
var client = new Client();
const bingSpellCheckApiKey = ellipsis.env.BING_SPELL_CHECK_API_KEY;

var args = {
    parameters: {
      mode: "proof",
      mkt: "en-us",
      text: input
    },
    headers: {
      "Ocp-Apim-Subscription-Key": bingSpellCheckApiKey 
    }
};

client.post("https://api.cognitive.microsoft.com/bing/v5.0/spellcheck", args, function (data, response) {
  var result = { 
    comment: "",
    flaggedTokens: []
  }
  if (data.flaggedTokens.length === 0) {
    result.comment = "spelling of **" + input + "** is correct";
  } else {
    result.comment = "Suggestions:";
    result.flaggedTokens=data.flaggedTokens
  }
  ellipsis.success(result);
});
}