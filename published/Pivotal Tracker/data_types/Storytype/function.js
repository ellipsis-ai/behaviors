function(ellipsis) {
  const capitalize = require('capitalize');

const storyTypes = ['feature', 'bug', 'chore', 'release'];

ellipsis.success(storyTypes.map(ea => {
  return { id: ea, label: capitalize(ea) };
}));
}
