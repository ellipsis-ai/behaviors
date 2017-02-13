function(ellipsis) {
  const capitalize = require('capitalize');

const possibleStates = [
  'accepted',
  'delivered',
  'finished',
  'started',
  'rejected',
  'planned',
  'unstarted',
  'unscheduled'
].map( ea => {
  return { id: ea, label: capitalize(ea) };
});

ellipsis.success(possibleStates);
}
