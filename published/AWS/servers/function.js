function(onSuccess, onError, ellipsis) {
  "use strict"; 
var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId:  ellipsis.env.AWS_ACCESS_KEY,
  secretAccessKey: ellipsis.env.AWS_SECRET_KEY
 });

const ec2 = new AWS.EC2({region: 'us-east-1'});
var params = {};
ec2.describeInstances(params, function(err, data) {
  if (err) {
    onError(err);
  } else {
    var result = {
      instances: data.Reservations[0].Instances, 
      count: data.Reservations[0].Instances.length
    };
    onSuccess(result);
  }
});

}