function(searchQuery, ellipsis) {
  "use strict";

var moment = require('moment-timezone');
var commonZones = ['Sydney', 'Tokyo', 'Paris', 'London', 'New York', 'Chicago', 'Denver', 'Los Angeles'];
var zones = moment.tz.names().map((tzName) => ({
  label: tzName.replace(/_/g, ' '),
  id: tzName
}));

let results = zones.filter((tz) => {
  return tz.label.toLowerCase().includes(searchQuery.toLowerCase());
});

if (results.length === 0) {
  results = zones.filter((tz) => {
    return commonZones.some((cz) => tz.label.toLowerCase().includes(cz.toLowerCase()));
  });
}

ellipsis.success(results);
}
