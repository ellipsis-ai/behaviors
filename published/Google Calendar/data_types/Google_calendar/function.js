function(ellipsis) {
  const gcal = require('google-calendar');
const cal = new gcal.GoogleCalendar(ellipsis.accessTokens.googleCalendar);

cal.calendarList.list((err, calendarList) => {
  if (err) {
    ellipsis.error(err);
  }  else {
    const calendars = calendarList.items.map(ea => {
      return { label: ea.summary, id: ea.id };
    });
    ellipsis.success(calendars);
  }
}); 

}
