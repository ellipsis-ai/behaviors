function(ellipsis) {
  "use strict"; 

const s3 = new ellipsis.AWS.S3();
s3.listBuckets((response, data) => {                
  ellipsis.success(data);
});

}