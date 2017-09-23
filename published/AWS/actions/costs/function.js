function(ellipsis) {
  "use strict"; 

const cleanUpValue = (v) => {
  return v.replace(/^\"|\"$/g, "");
};

const aws = require('aws');
const s3 = aws.getS3(ellipsis);

const bucket = "ellipsis-aws-billing";

const getTotalFor = (csvKey, cb) => {
  const getObjectParams = {
    "Bucket": bucket,
    "Key": csvKey
  };
  s3.getObject(getObjectParams, (err, data) => {
    if (err) {
      cb({
        currency: "",
        amount: "N/A"
      });
    } else {
      const lines = data.Body.toString("utf8").split("\n");
      const totalValues = lines[lines.length-3].split(",");
      const currency = cleanUpValue(totalValues[totalValues.length-6]);
      const amount = cleanUpValue(totalValues[totalValues.length-1]);
      cb({ 
        currency: currency,
        amount: amount
      });
    }
  });
};

const listObjectsParams = {
  "Bucket": bucket
};

s3.listObjectsV2(listObjectsParams, (err, data) => {
  const csvRegex = /\d+-aws-billing-csv-\d\d\d\d-\d\d/;
  if (data) {
    const csvKeys = data.Contents.map((ea) => ea.Key).filter((ea) => {
      return csvRegex.test(ea);
    });
    const reverseChrono = csvKeys.sort().reverse();

    getTotalFor(reverseChrono[0], (latest) => {
      getTotalFor(reverseChrono[1], (secondLatest) => {
          ellipsis.success({
            latest: latest,
            secondLatest: secondLatest
          });
      });
    });
  } else {
    ellipsis.error("You need to set up billing reports for you AWS account first!\n\nSee http://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/detailed-billing-reports.html for more details.");
  }
})
}
