{if successResult.isEmpty}
Nothing in the calendar tomorrow for **{calendar.label}**
{else}
**{successResult.header}**
{endif}
{for event in successResult.items}
- [{event.summary}]({event.htmlLink}), {event.formattedEventTime}
{endfor}