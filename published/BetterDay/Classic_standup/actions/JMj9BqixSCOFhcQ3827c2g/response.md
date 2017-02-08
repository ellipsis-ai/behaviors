{if successResult.hasResults}
Here’s how the day has gone for everyone:  
{for userResult in successResult.results}

**<@{userResult.user}>’s goals:**  
{userResult.goals}  
**Successful?** {userResult.wasSuccessful}  
**What have you learned?** {userResult.why}

{endfor}

{else}

I don’t have any responses yet. Check back later.

{endif}