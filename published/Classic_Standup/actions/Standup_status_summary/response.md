Here's where everyone's at today:

{for userResult in successResult.answeredResults}

**<@{userResult.user}>:** 

**Yesterday:** {userResult.yesterday}  
    **Today:** {userResult.today}  
 **Blockers:** {userResult.blockers}  

{endfor}

The following slackers haven't answered yet:

{for slacker in successResult.slackers}
**<@{slacker}>**
{endfor}