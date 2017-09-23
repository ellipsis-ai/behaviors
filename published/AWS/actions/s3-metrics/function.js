function(ellipsis) {
  "use strict"; 

const Q = require('q');
const groupBy = require('group-by');
const pretty = require('prettysize');
const aws = require('aws');
const cloudwatch = aws.getCloudWatch(ellipsis);
const namespace = "AWS/S3";

const getMetrics = () => {
  const params = { Namespace: namespace };
  const deferred = Q.defer();
  
  cloudwatch.listMetrics(params, (err, data) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data.Metrics);
    }
  });

  return deferred.promise;
};

const getStatisticsFor = (metric) => {
  const start = new Date();
  start.setDate(start.getDate() - 2);
  const params = {
    EndTime: new Date(),
    MetricName: metric.MetricName,
    Namespace: namespace,
    Period: 3600,
    StartTime: start,
    Statistics: [ "Maximum" ],
    Dimensions: metric.Dimensions,
  };
  const deferred = Q.defer();
  
  cloudwatch.getMetricStatistics(params, (err, data) => {
    if (err) {
      deferred.reject(err);
    } else {
      const bucketDimension = 
        metric.Dimensions.find((ea) => 
          ea.Name == "BucketName"
        );    
      deferred.resolve({
        bucket: bucketDimension.Value,
        stats: data
      });
    }
  });

  return deferred.promise;
};

getMetrics().
  then((metrics) => {
    return Q.all(metrics.map((metric) => getStatisticsFor(metric)))
  }).
  then((stats) => {
    const processed = stats.
      filter((ea) => ea.stats.Datapoints.length > 1).
      map((ea) => {
        const mostRecentDatapoint = ea.stats.Datapoints.sort((a, b) => b.Timestamp - a.Timestamp)[0];
        return {
          bucket: ea.bucket,
          amount: mostRecentDatapoint.Maximum,
          unit: mostRecentDatapoint.Unit
        };
      });
    const grouped = groupBy(processed, 'bucket');
    const merged = Object.keys(grouped).map((bucket) => {
      const data = grouped[bucket];
      const count = data.find((ea) => ea.unit == "Count").amount;
      const bytes = data.find((ea) => ea.unit == "Bytes").amount;
      return {
        bucket: bucket,
        count: count,
        bytes: bytes,
        storage: pretty(bytes)
      };
    });
    const sorted = merged.sort((a, b) => b.bytes - a.bytes);
    ellipsis.success(sorted);
  }).
  fail((err) => {
    ellipsis.error(err);
  });
}
