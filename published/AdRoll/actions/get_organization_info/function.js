function(organizationEID, ellipsis) {
  const prettyjson = require('prettyjson');
const AdRollHelper = require('./adroll');
const adRoll = new AdRollHelper(ellipsis);


adRoll.validateAPIisReacheable()
.then(() => {
  return adRoll.getOrgInfo({organizationEID: organizationEID});
})
.then((orgInfo) => {
  ellipsis.success(prettyjson.render(orgInfo, {}));
});
}
