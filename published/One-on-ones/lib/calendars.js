/*
@exportId UTYmlvAVQYykVwESopFqZA
*/
module.exports = (function() {
return {
  fetchNextInstanceToUseFor: fetchNextInstanceToUseFor,
  shouldNotify: shouldNotify
};
  
function shouldNotify(instance, notifyWindowStart, notifyWindowEnd) {
  const start = ensureDateForStartOf(instance);
  return start >= notifyWindowStart && start < notifyWindowEnd;
}

function ensureDateFor(dateTimeString) {
  const timestamp = Date.parse(dateTimeString)
  if (isNaN(timestamp)) {
    return new Date();
  } else {
    return new Date(timestamp);
  }
}

function ensureDateForStartOf(instance) {
  const dateTimeString = (instance && instance.start) ? instance.start.dateTime : null;
  return ensureDateFor(dateTimeString);
}

function fetchNextInstanceToUseFor(calendarId, eventId, cal) {
  return fetchNextInstance(calendarId, eventId, cal).then(instance => {
    const start = ensureDateForStartOf(instance);
    return fetchNextExceptionBefore(calendarId, eventId, start, cal).then( exception => {
      return exception || instance;
    });
  });
}

function fetchNextExceptionBefore(calendarId, eventId, beforeTime, cal) {
  return new Promise((resolve, reject) => {
    const start = (new Date()).toISOString();
    const options = {
      timeMin: start,
      timeMax: beforeTime.toISOString(),
      orderBy: 'startTime',
      singleEvents: true
    };
    cal.events.list(calendarId, options, (err, instances) => {
      if (err) {
        reject(err);
      }  else {
        resolve(instances.items.filter(ea => ea.recurringEventId === eventId)[0]);
      }
    })
  });
}

function fetchNextInstance(calendarId, eventId, cal) {
  return new Promise((resolve, reject) => {
    const start = (new Date()).toISOString();
    const options = {
      timeMin: start,
      maxResults: 1
    };
    cal.events.instances(calendarId, eventId, options, (err, instances) => {
      if (err) {
        reject(err);
      }  else {
        resolve(instances.items[0]);
      }
    })
  });
}
})()
     