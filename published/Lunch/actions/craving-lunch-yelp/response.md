Here are the top {successResult.topCount} results of {successResult.overallCount} from Yelp for `{keyword}` in `{location}`:

{for business in successResult.businesses}
---
**[{business.name}]({business.url})** {business.stars}  
{business.location.address1} {business.location.address2} {business.location.address3}  
{business.location.city}, {business.location.state} {business.location.zip_code}  
{endfor}
