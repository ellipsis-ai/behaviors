function(keyword, location, ellipsis) {
  "use strict";

const fetch = require('node-fetch');

doSearchWithToken(ellipsis.accessTokens.yelp);

function doSearchWithToken(token) {
  var encodedLocation = encodeURIComponent(location);
  var encodedKeyword = encodeURIComponent(keyword);
  var searchUrl = `https://api.yelp.com/v3/businesses/search?location=${encodedLocation}&term=${encodedKeyword}`;

  fetch(searchUrl, {
    method: 'GET',
    headers: {
      'Authorization': "Bearer " + token
    }
  })
  .then((response) => response.json())
  .then((json) => {
    if (json.businesses) {
      processResults(json);
    } else if (json.error && json.error.code === 'TOKEN_MISSING') {
      errorHandler({
        message: "The access token for Yelp is missing. Double-check your Yelp API configuration."
      });
    } else if (json.error && json.error.code === 'UNAUTHORIZED_ACCESS_TOKEN') {
      errorHandler({
        message: "Yelp rejected the access token. Double-check your Yelp API configuration."
      });
    } else if (json.error) {
      errorHandler({
        message: json.error.code + ': ' + json.error.description,
        type: `Yelp error`
      });
    } else {
      errorHandler({
        message: "No results were found in Yelp’s response."
      });
    }
  }).catch((error) => {
    if (error.name === 'SyntaxError') {
      errorHandler({
        message: "Yelp returned an invalid response."
      });
    } else {
      errorHandler(error);
    }
  });
}

function errorHandler(error) {
  let errorMessage = `
I tried to search Yelp for \`${keyword}\` in \`${location}\`, but it didn’t work. Try using a more specific location.`;
  if (error && error.message) {
    let errorType = error.type || error.code || error.name || "Error";
    errorMessage += `\n\n\`\`\`${errorType}: ${error.message}\`\`\``;
  }
  ellipsis.error(errorMessage);
}

function processResults(results) {
  var top5 = results.businesses.slice(0, 5).map((ea) => {
    ea.stars = getStarsForRating(ea.rating);
    ea.location.address1 = ea.location.address1 || '';
    ea.location.address2 = ea.location.address2 || '';
    ea.location.address3 = ea.location.address3 || '';
    return ea;
  });
  ellipsis.success({
    businesses: top5,
    topCount: top5.length,
    overallCount: results.total
  });
}

function getStarsForRating(rating) {
  var fullStars = '★★★★★';
  var emptyStars = '✩✩✩✩✩';
  var halfStar = '✯';
  var numFullStars = Math.floor(rating);
  var result = fullStars.substr(0, numFullStars);
  if (rating - numFullStars > 0) {
    result += halfStar;
  }
  return result + emptyStars.substr(result.length);
}
}
