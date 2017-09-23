function(ellipsis) {
  const lambda = require('aws').getLambda(ellipsis);

lambda.listFunctions({}, function(err, data) {
  if (err) {
    ellipsis.error("That didn't work: " + err);
  } else {
    ellipsis.success(data.Functions.length);
  }
});
}
