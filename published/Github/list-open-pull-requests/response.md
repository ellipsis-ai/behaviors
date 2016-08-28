{successResult.msg}

{for pr in successResult.prs}
- [{pr.title}]({pr.html_url}) – @{pr.user.login} – last updated {pr.updated_at}
{endfor}