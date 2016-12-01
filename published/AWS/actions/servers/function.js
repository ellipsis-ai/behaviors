function(ellipsis) {
  "use strict"; 

const ec2 = new ellipsis.AWS.EC2();
var params = {};
ec2.describeInstances(params, function(err, data) {
  if (err) {
    ellipsis.error(err);
  } else {
    const instanceLists = data.Reservations.map((ea) => ea.Instances);
    const flattened = [].concat.apply([], instanceLists);
    var result = {
      instances: flattened, 
      count: flattened.length
    };
    ellipsis.success(result);
  }
});


}