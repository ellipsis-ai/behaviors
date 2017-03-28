{for ea in successResult}
# Your open issues for: {ea.repo}
{for issue in ea.issues}
- [{issue.title}]({issue.html_url})
{endfor}
{endfor}