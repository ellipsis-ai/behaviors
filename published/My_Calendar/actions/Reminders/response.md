{if successResult.hasItems}
⏰ {successResult.heading}

{for event in successResult.items}
{event.formattedEvent}

{endfor}
{else}
There’s nothing on your calendar in the next few minutes.
{endif}
