function(
place,
ellipsis
) {
  "use strict";

const moment = require('moment-timezone')();
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
  tz = 'UTC';
  result = `I only know the time of day for a few places and you said ${place}. ` +
    "Try Los Angeles, New York, or London.\n\n  \n\n";
}

if (!result) {
  result = `It's ${moment.tz(tz).format('LT')} in ${place}`
}
ellipsis.success(result);
}