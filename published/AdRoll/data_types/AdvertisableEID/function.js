function(searchQuery, ellipsis) {
  const AdRollHelper = require('./adroll');
const adRoll = new AdRollHelper(ellipsis);

adRoll.validateAPIisReacheable()
  .then(() => adRoll.validateAdvertisableEID(searchQuery.trim()))
  .then(() => ellipsis.success([ { label: searchQuery, id: searchQuery } ]));
}
