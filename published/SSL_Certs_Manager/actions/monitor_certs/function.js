function(ellipsis) {
  "use strict";

var moment = require('moment');

function buildMessages(certs) {
  var adesso = moment.utc();
  var messages = {
    total: certs.length,
    total_expired: 0,
    criticals: [],  // this week
    warnings: [],   // this month
    infos:[],       // in 2 months
    // noops
    noops: []
  };
  certs.map((c) => {
      if (c.is_expired) messages.total_expired = messages.total_expired + 1;
      else if (c.valid_to < moment.utc().add(7, 'd')) messages.criticals.push(c);
      else if (c.valid_to < moment.utc().add(1, 'M')) messages.warnings.push(c);
      else if (c.valid_to < moment.utc().add(2, 'M')) messages.infos.push(c);
      else {
        messages.noops.push(c);
      }
    });
    messages.criticals_flag = messages.criticals.length > 0;
    messages.warnings_flag = messages.warnings.length > 0;
    messages.infos_flag = messages.infos.length > 0;
  return messages;
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
    const messages = buildMessages(sortedCerts);
    if (messages.criticals.length > 0 || messages.warnings.length > 0 || messages.infos.length > 0) {
      ellipsis.success(messages);
    } else {
      ellipsis.noResponse ();
    }
  })
  .catch(err => {
    ellipsis.error(err);
  });
}
