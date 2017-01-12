{if successResult.isEmpty}
No upcoming events on your calendar.
{else}
**{successResult.header}**
{endif}
{for event in successResult.items}
- [{event.summary}]({event.htmlLink}), {event.formattedEventTime}
{endfor}