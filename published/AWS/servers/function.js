function(onSuccess, onError, ellipsis, AWS) {
  "use strict"; 

const ec2 = new AWS.EC2();
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