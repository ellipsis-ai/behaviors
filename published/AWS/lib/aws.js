/*
@exportId r6cRuXJSRKCQ41jEYhNKhQ
*/
module.exports = (function() {
const AWS = require('aws-sdk');

function getConfig(ellipsis) {
  return new AWS.Config(ellipsis.aws.default);
}

return {
  getACM: ellipsis => new AWS.ACM(getConfig(ellipsis)),
  getCloudWatch: ellipsis => new AWS.CloudWatch(getConfig(ellipsis)),
  getEC2: ellipsis => new AWS.EC2(getConfig(ellipsis)),
  getIAM: ellipsis => new AWS.IAM(getConfig(ellipsis)),
  getLambda: ellipsis => new AWS.Lambda(getConfig(ellipsis)),
  getS3: ellipsis => new AWS.S3(getConfig(ellipsis))
};
})()
     