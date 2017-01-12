OK. I’ve scheduled an event for you:

> What: **{successResult.summary}**
> When: **{successResult.when}**
{if successResult.hasLocation}> Where: **{successResult.location}**{endif}

[Edit this event]({successResult.link})

I also announced the absence in {for channelName in successResult.channelNames}#{channelName} {endfor}.