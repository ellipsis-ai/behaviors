function(onSuccess, onError, ellipsis, AWS) {
  "use strict"; 

const ec2 = new AWS.EC2();
var params = {};
ec2.describeInstances(params, function(err, data) {
  if (err) {
    onError(err);
  } else {
    const instanceLists = data.Reservations.map((ea) => ea.Instances);
    const flattened = [].concat.apply([], instanceLists);
    var result = {
      instances: flattened, 
      count: flattened.length
    };
    onSuccess(result);
  }
});


}