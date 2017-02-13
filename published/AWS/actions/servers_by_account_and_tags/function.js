function(account_label, env_tag_value, ellipsis) {
  "use strict";
const Q = require('q');
var AWS = require('aws-sdk');

// -----------------------------------------------------------------------------------------------
// INPUTS
// -----------------------------------------------------------------------------------------------

// Add the region codes for the regions you want Ellipsis to search for instances
var regions = [
  'us-east-1',
  'us-west-1'
]

// What tags do you want to use to select the instances?
// Add the Tag Key and the Tag Value. Tag Value can be an input param.
const searchedTags = [
  { Key: "Environment", Value: env_tag_value }
];

// What aws accounts do you want to use?
// Add the accounts you want Ellipisis to use. The label is used to
// allow the user to choose what account to use.
var accounts = [
  {
    label: "acc_1",
    key: ellipsis.env.ACC_ONE_AWS_KEY,
    secret: ellipsis.env.ACC_ONE_AWS_SECRET
  },
  {
    label: "acc_2",
    key: ellipsis.env.ACC_TWO_AWS_KEY,
    secret: ellipsis.env.ACC_TWO_AWS_SECRET
  }
];

// -----------------------------------------------------------------------------------------------
// Given an AWS account and a list of regions it finds all the
// instances in the regions that match a given list of tags.
// tags are objects with Key and Value properties. For example:
//  {Key: "Environment", Value: "staging4"}
// -----------------------------------------------------------------------------------------------
const findInstances = (account, regions) => {
  return Q.all(regions.map((r)=>findInstancesInRegion(account, r)));
}

// -----------------------------------------------------------------------------------------------
// Given an AWS account and a region this Promise retrieves
// all the instances that have tags matching the tags in the
// array withTags
// -----------------------------------------------------------------------------------------------
const findInstancesInRegion = (account, region) => {
  const deferred = Q.defer();
  AWS.config.update({
    accessKeyId: account.key,
    secretAccessKey: account.secret,
    region: region
  });
  const ec2 = new AWS.EC2();
  ec2.describeInstances({}, (err, data) => {
    if (err) {
      deferred.reject(err);
    } else {
      const instances = data.Reservations.map((ea) => ea.Instances);
      var flattened = [].concat.apply([], instances);
      flattened.forEach((instance) => {
         instance.accountLabel = account.label;
         instance.accountRegion = region;
      });
      deferred.resolve(flattened);
    }
  });
  return deferred.promise;
}

// -----------------------------------------------------------------------------------------------
// Given an instance it returns true if the instance has all the tags
// specified in searchedTags, both properties Key and Value must match.
// -----------------------------------------------------------------------------------------------
const hasTags = (instance, searchedTags) => {
  for (var i=0; i < searchedTags.length; i++) {
    // if any of the searchedTags not contained in the instance Tags array
    // then return false to indicate that the instance does not have all the
    // searchedTags
    if (!instance.Tags.find((instanceTag) => instanceTag.Key === searchedTags[i].Key && instanceTag.Value === searchedTags[i].Value)){
      return false
    }
  }
  return true;
}



// -----------------------------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------------------------
var account = accounts.find((a) => a.label===account_label);
if (account) {
  findInstances(account, regions)
    .then((instancesPerRegion) => {
      var instances = [].concat.apply([], instancesPerRegion);
      const instancesFiltered = instances.filter((i) => hasTags(i, searchedTags));
      ellipsis.success({
        instances: instancesFiltered,
        count: instancesFiltered.length,
        regions: regions.join(", ")});
    })
    .fail((err) => {
      ellipsis.error(err);
    });
} else {
  ellipsis.error(
    "Cannot find AWS account with label '" + account_label +
    "' - [Possible values are: " + accounts.map((a)=>a.label).join(",") + "]"
  );
}
}
