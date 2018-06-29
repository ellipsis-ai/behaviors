{if successResult.nobodyWasAsked}
Nobody was asked for that channel. You can set up a new standup using `…setup classic standup`
{else}
Here's where everyone's at today (all times {successResult.timeZone}):

{for userResult in successResult.answeredResults}

**<@{userResult.user}> responded at {userResult.when}:** 

**Yesterday:** {userResult.yesterday}  
**Today's most important task:** {userResult.today}  
**What else today:** {userResult.today2}  
**Blockers:** {userResult.blockers}  

{endfor}

{if successResult.hasSlackers}
I'm missing responses from the following people:

{for slacker in successResult.slackers}
**<@{slacker}>**
{endfor}

No big deal! You can still add one now by typing `/dm @ellipsis standup checkin for {channel}`.  
Once you are done you can type `@ellipsis standup status for {channel}` here to have an updated summary posted.
{else}
Everyone accounted for. Nicely done.
{endif}

{endif}