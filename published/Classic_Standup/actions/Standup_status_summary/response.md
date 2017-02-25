Here's where everyone's at today:

{for userResult in successResult}

**<@{userResult.user}>:** 

**Yesterday:** {userResult.yesterday}  
    **Today:** {userResult.today}  
 **Blockers:** {userResult.blockers}

{endfor}