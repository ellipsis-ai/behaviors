function(wasSuccessful, why, ellipsis) {
  var RandomResponse = require('ellipsis-random-response');
ellipsis.success({
  isSuccess: (wasSuccessful),
  successMessage: RandomResponse.responseWithEmoji("congratulatory"),
  failureMessage: RandomResponse.responseWithEmoji("oops")
});
}
