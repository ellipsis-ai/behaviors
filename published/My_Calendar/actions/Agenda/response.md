**{successResult.heading}**
{for event in successResult.items}
- {event.formattedEventTime}: **[{event.summary}]({event.htmlLink})** {event.optionalHangoutLink}
{endfor}