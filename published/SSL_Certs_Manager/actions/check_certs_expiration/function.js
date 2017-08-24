function(ellipsis) {
  "use strict";

var moment = require('moment');

function buildSummary(certs) {
  var adesso = moment.utc();
  var data = {
    total: certs.length,
    total_expired: 0,
    expiring_next_7_days: [],
    expiring_next_30_days: [],
    expiring_far_way: []
  };
  certs.map((c) => {
      if (c.is_expired) data.total_expired = data.total_expired + 1;
      else if (c.valid_to < moment.utc().add(7, 'd')) data.expiring_next_7_days.push(c);
      else if (c.valid_to < moment.utc().add(1, 'M')) data.expiring_next_30_days.push(c);
      else {
        data.expiring_far_way.push(c);
      }
    });
  data.total_expiring_next_7_days = data.expiring_next_7_days.length;
  data.total_expiring_next_30_days = data.expiring_next_30_days.length;
  data.total_expiring_far_way = data.expiring_far_way.length;
  return data;
}

const CertsFetcher = require('certs_fetcher');
const skill = require('skill_consts');

const certsFetcher = new CertsFetcher({
  userTimeZone: ellipsis.teamInfo.timeZone,
  urls: skill.urls,
  AWS: ellipsis.AWS,
  AwsRegion: ellipsis.AWS_REGION
});

certsFetcher.getAllCerts()
.then(sortedCerts => {
  ellipsis.success(buildSummary(sortedCerts));
})
.catch(err => {
  ellipsis.error(err);
});
}
