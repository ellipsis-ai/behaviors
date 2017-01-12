{if successResult.isEmpty}
No upcoming events for calendar **{calendar.label}**
{else}
**{successResult.header}**
{endif}
{for event in successResult.items}
- [{event.summary}]({event.htmlLink}), {event.formattedEventTime}
{endfor}