function(ellipsis) {
  "use strict"; 

const Q = require('q');
const dateFormat = require('dateformat');

const certsFromIAM = () => {
  const iam = new ellipsis.AWS.IAM();
  const deferred = Q.defer();
  
  iam.listServerCertificates({}, (err, data) => {
    if (err) {
      deferred.reject(err)
      ellipsis.error(err);
    } else {
      deferred.resolve(
        data.ServerCertificateMetadataList.
          sort((a, b) => {
            return a.Expiration.value - b.Expiration.value;
          }).
          map((ea) => {
            return { identifier: ea.Arn, expiration: ea.Expiration };
          })
        );
    }
  });

  return deferred.promise;
};

const acm = new ellipsis.AWS.ACM();

const certArnsFromACM = () => {
  const deferred = Q.defer();

  acm.listCertificates({}, (err, data) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(
        data.CertificateSummaryList.
          map((ea) => {
            return ea.CertificateArn;
          })
        );
    }
  });
  
  return deferred.promise;
};

const eventualCertFromArn = (arn) => {
  const deferred = Q.defer();
  acm.describeCertificate({ CertificateArn: arn }, (err, data) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve({ 
        identifier: data.Certificate.DomainName, 
        expiration: data.Certificate.NotAfter
      });
    }
  });
  return deferred.promise;
};

const certsFromACM = () => {
  return certArnsFromACM().then((arns) => {
    return Q.all(arns.map(eventualCertFromArn));
  });
};
   
Q.all([
  certsFromIAM(),
  certsFromACM()
]).then((certLists) => {
  const flattened = [].concat.apply([], certLists);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate()+365);
  const expiringSoon = 
    flattened.sort((a, b) => a.expiration - b.expiration).
    filter((ea) => (ea.expiration < cutoffDate) && (ea.expiration > new Date()));
  const result = expiringSoon.map((ea) => {
    const expirationStr = dateFormat(ea.expiration, "dddd, mmmm dS, yyyy");
    return { identifier: ea.identifier, expiration: expirationStr };
  });
  ellipsis.success(result);
}).fail((err) => {
  ellipsis.error(err);
});
}
