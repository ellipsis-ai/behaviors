function(ellipsis) {
  "use strict"; 

const aws = require('aws');
const ec2 = aws.getEC2(ellipsis);

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
