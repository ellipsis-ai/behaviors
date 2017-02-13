function(place, ellipsis) {
  "use strict";

const Moment = require('moment-timezone');
const moment = Moment();
let tz;
let result;

if (place.match(/^(san fran|los angeles|vancouver|portland|seattle|palo alto|menlo park|san jose)/i)) {
  tz = 'America/Los_Angeles';
} else if (place.match(/^(boise|calgary|denver|edmonton)/i)) {
  tz = 'America/Denver';
} else if (place.match(/^(phoenix)/i)) {
  tz = 'America/Phoenix';
} else if (place.match(/^(regina|saskatoon|loon lake)/i)) {
  tz = 'America/Regina';
} else if (place.match(/^(chicago|winnipeg|minneapolis|houston|dallas|austin|memphis|new orleans|st\.? louis)/i)) {
  tz = 'America/Chicago';
} else if (place.match(/^(toronto|montreal|ottawa|new york|boston|philadelphia|washington|atlanta|miami)/i)) {
  tz = 'America/New_York';
} else if (place.match(/^(london|cardiff|belfast|dublin|birmingham|lisbon|glasgow|manchester|edinburgh)/i)) {
  tz = 'Europe/London';
} else if (place.match(/^(amsterdam|madrid|paris|berlin|rome|milan|barcelona|stockholm)/i)) {
  tz = 'Europe/Paris';
} else {
  tz = searchForTz(place);
}

if (tz === 'UTC') {
  result = `I only know the time of day for some places and you said ${place}.  
Try Los Angeles, New York, or London.\n\n  \n\n`;
} else {
  result = `It's ${moment.tz(tz).format('LT (z)')} in ${place}`
}
ellipsis.success(result);

function searchForTz(placeString) {
  var tz = Moment.tz.names().find((tzName) => {
    return tzName.toLowerCase().replace('_', ' ').includes(placeString.toLowerCase());
  });
  return tz || 'UTC';
}
}
