Here’s how the day went for everyone:

{for userResult in successResult}

**<@{userResult.user}>’s goals:**  
{userResult.goals}  
**Successful?** {userResult.wasSuccessful}  
**What helped/hurt?** {userResult.why}

{endfor}