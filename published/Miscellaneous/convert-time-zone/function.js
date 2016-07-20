function(
time,
onSuccess, onError, ellipsis
) {
  var ASSUMED_TIMEZONE = 'e'; // E is for Eastern
var CONVERT_TO_TIMEZONE = 'p'; // P is for Pacific

var timeZones = {
  p: 0,
  m: 1,
  c: 2,
  e: 3,
  a: 4
};

var timeZoneNames = {
  p: 'Pacific',
  m: 'Mountain',
  c: 'Central',
  e: 'Eastern',
  a: 'Atlantic'
};

var flipAmOrPm = function(originalTime, timeDifference, amOrPm) {
  if (originalTime - timeDifference < 1 ||
      originalTime >= 12 && originalTime - timeDifference < 12 ||
      originalTime < 12 && originalTime - timeDifference >= 12) {
    return amOrPm == 'am' ? 'pm' : 'am';
  } else {
    return amOrPm;
  }
};

var resolveDifference = function(originalHour, timeDifference, isMilitary) {
  var newHour = originalHour - timeDifference;
  if (newHour < 1 && !isMilitary) {
    newHour += 12;
  } else if (newHour < 1 && isMilitary) {
    newHour += 24;
  } else if (newHour > 12 && !isMilitary) {
    newHour -= 12;
  } else if (newHour > 23 && isMilitary) {
    newHour -= 24;
  }
  return newHour;
}

var assembleTimeString = function(hour, minute, suffix, timeZone) {
  return hour + ':' + minute + suffix + ' ' + timeZone;
};

var timeMatch = time.match(/(\d{1,2}):(\d\d)/);
if (!timeMatch || !timeMatch[1] || !timeMatch[2]) {
  return onError('No valid time of day found.');
}

var hour = parseInt(timeMatch[1], 10);
var isMilitary = hour > 12 || hour == 0;
var minute = timeMatch[2];
if (hour > 23) {
  // Assume that anything above 23 isn't a time of day and just end silently
  return;
}

var timeZoneMatch = time.match(/([acemp][sd]?t|atlantic|central|eastern|mountain|pacific)/i);
var timeZone = timeZoneMatch && timeZoneMatch[1] ?
  timeZoneMatch[1].charAt(0).toLowerCase() :
  ASSUMED_TIMEZONE;
var newTimeZone = timeZone == CONVERT_TO_TIMEZONE ?
  ASSUMED_TIMEZONE :
  CONVERT_TO_TIMEZONE;
var difference = timeZones[timeZone] - timeZones[newTimeZone];

var amOrPmMatch = time.match(/[\d\s]([ap])\.?m\.?\b/i);
var amOrPm = '';
var newAmOrPm = '';

if (amOrPmMatch) {
  amOrPm = amOrPmMatch[1].toLowerCase() + 'm';
}
if (amOrPm) {
  newAmOrPm = flipAmOrPm(hour, difference, amOrPm);
}

var newHour = resolveDifference(hour, difference, isMilitary);

onSuccess({
  originalTime: assembleTimeString(hour, minute, amOrPm, timeZoneNames[timeZone]),
  newTime: assembleTimeString(newHour, minute, newAmOrPm, timeZoneNames[newTimeZone])
});

}