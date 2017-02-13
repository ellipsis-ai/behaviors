function(tagKey, tagValue, ellipsis) {
  "use strict"; 

const ec2 = new ellipsis.AWS.EC2();
var params = {};
ec2.describeInstances(params, function(err, data) {
  if (err) {
    ellipsis.error(err);
  } else {
    const instanceLists = data.Reservations.map((ea) => ea.Instances);
    const flattened = [].concat.apply([], instanceLists);
    const filtered = flattened.filter((instance) =>
      instance.Tags.filter((tag)=>(tag.Key == tagKey && tag.Value == tagValue)).length > 0
    );
    var result = {
      instances: filtered, 
      count: filtered.length
    };
    ellipsis.success(result);
  }
});
}
