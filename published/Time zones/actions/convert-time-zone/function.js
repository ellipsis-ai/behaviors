function(time, tzToOutput, ellipsis) {
  "use strict";
const Moment = require('moment-timezone');
const util = require('util');
const formatString = 'h:mm A z';
main();

function main() {
  const parsedTime = parseTime(time);
  const inputTz = parseTz(time) || ellipsis.teamInfo.timeZone;
  const here = Moment().tz(inputTz).set(parsedTime);
  /* If the user included a time zone with their time, and it's the same
     offset as output time zone, flip the conversion: */
  const outputTz = timeUsesTz(here, tzToOutput.id) ? ellipsis.teamInfo.timeZone : tzToOutput.id;
  
  const there = here.clone().tz(outputTz);
  ellipsis.success({
    originalTime: here.format(formatString),
    newTime: there.format(formatString)
  });
}

function parseTime(timeString) {
  var timeMatch = timeString.match(/(\d{1,2})(:(\d\d))?/);
  if (!timeMatch || !timeMatch[1]) {
    ellipsis.noResponse();
  }
  var hour = parseInt(timeMatch[1], 10);
  var minute = parseInt(timeMatch[3], 10) || 0;
  var amOrPmMatch = timeString.match(/[\d\s]([ap])\.?m\.?\b/i);
  var amOrPm = amOrPmMatch && amOrPmMatch[1].toLowerCase();
  if (!amOrPm && !timeMatch[3]) {
    // No AM or PM, and no minutes means probably not a time
    ellipsis.noResponse();
  }
  if (amOrPm && amOrPm === 'p' && hour < 12) {
    hour += 12;
  } else if (amOrPm && amOrPm === 'a' && hour === 12) {
    hour = 0;
  }
  if (hour > 23 || hour < 0 || minute > 59 || minute < 0) {
    // Assume that this is not a valid time of day and end silently
    ellipsis.noResponse();
  }
  return { hour: hour, minute: minute };
}

function parseTz(timeString) {
  var trimmed = timeString.trim();
  var match = trimmed.match(/([acemp][sd]?[t]|atlantic|central|mountain|pacific)$/i);
  var result = match && match[1];
  if (!result) {
    return null;
  }
  result = result.trim();
  if (/^a[sd]?t|atlantic/i.test(result)) {
    return 'America/Halifax';
  } else if (/^c[sd]?t|central/i.test(result)) {
    return 'America/Chicago';
  } else if (/^e[sd]?t|eastern/i.test(result)) {
    return 'America/New_York';
  } else if (/^m[sd]?t|mountain/i.test(result)) {
    return 'America/Denver';
  } else if (/^p[sd]?t|pacific/i.test(result)) {
    return 'America/Los_Angeles';
  } else {
    return null;
  }
}

function timeUsesTz(time, tz) {
  return time.format('Z') === time.clone().tz(tz).format('Z');
}
}
