function(onSuccess, onError, ellipsis, AWS) {
  "use strict"; 

const s3 = new AWS.S3();
s3.listBuckets((response, data) => {                
  onSuccess(data);
});

}