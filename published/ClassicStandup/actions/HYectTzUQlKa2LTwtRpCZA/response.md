{if successResult.noResultsFound}
{successResult.heading}
{else}
{successResult.heading}

```
Last week:     {if successResult.includeThisWeek}│  This week:{endif}
{for day in periodLabels}{day} {endfor}
{for userResult in successResult.users}{for dayResult in userResult.days}{dayResult.text} {endfor} {if successResult.includeEveryone}<@{userResult.user}>{endif}
{endfor}```
{endif}