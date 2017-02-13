function(ellipsis) {
  var lambda = new ellipsis.AWS.Lambda();

lambda.listFunctions({}, function(err, data) {
  if (err) {
    ellipsis.error("That didn't work: " + err);
  } else {
    ellipsis.success(data.Functions.length);
  }
});
}
