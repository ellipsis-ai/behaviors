function(ellipsis) {
  "use strict"; 
const aws = require('aws');
const s3 = aws.getS3(ellipsis);

s3.listBuckets((response, data) => {                
  ellipsis.success(data);
});
}
