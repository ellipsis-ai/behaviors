{if successResult.isEmpty}
There are no vacations in the calendar today.
{else}
**{successResult.header}**
{endif}
{for event in successResult.items}
- {event.summary}, {event.formattedEventTime}, [google.com/calendar/…]({event.htmlLink})
{endfor}