Here's where everyone's at today:

{for userResult in successResult.answeredResults}

**<@{userResult.user}>:** 

**Yesterday:** {userResult.yesterday}  
    **Today:** {userResult.today}  
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