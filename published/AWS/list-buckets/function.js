function(onSuccess, onError, ellipsis) {
  "use strict"; 

var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId:  ellipsis.env.AWS_ACCESS_KEY,
  secretAccessKey: ellipsis.env.AWS_SECRET_KEY
 });

const s3 = new AWS.S3();
s3.listBuckets((response, data) => {                
  onSuccess(data);
});

}