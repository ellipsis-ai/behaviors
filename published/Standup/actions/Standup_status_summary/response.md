{if successResult.nobodyWasAsked}
Nobody was asked for that channel. You can set up a new standup using `…setup classic standup`
{else}
Here's where everyone's at today:

{for userResult in successResult.answeredResults}

**<@{userResult.user}>:** 

**Yesterday:** {userResult.yesterday}  
**Today's most important task:** {userResult.today}  
**What else today:** {userResult.today2}  
**Blockers:** {userResult.blockers}  

{endfor}

{if successResult.hasSlackers}
The following slackers haven't answered yet:

{for slacker in successResult.slackers}
**<@{slacker}>**
{endfor}

{else}
Everyone accounted for. Nicely done.
{endif}

{endif}