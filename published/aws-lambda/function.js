function(onSuccess, onError, ellipsis) {
  var AWS = require('aws-sdk');

var lambda = new AWS.Lambda({ 
  accessKeyId: ellipsis.env.AWS_ACCESS_KEY, 
  secretAccessKey: ellipsis.env.AWS_SECRET_KEY 
});

lambda.listFunctions({}, function(err, data) {
  if (err) {
    onError("That didn't work: " + err);
  } else {
   	onSuccess(data.Functions.length); 
  }
});
}