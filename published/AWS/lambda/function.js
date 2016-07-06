function(onSuccess, onError, ellipsis, AWS) {

var lambda = new AWS.Lambda();

lambda.listFunctions({}, function(err, data) {
  if (err) {
    onError("That didn't work: " + err);
  } else {
   	onSuccess(data.Functions.length); 
  }
});
}