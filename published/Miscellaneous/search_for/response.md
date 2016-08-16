Matches: {successResult.hits}
{for item in successResult.value}
[{item.name}]({item.url})
>{item.snippet}
{endfor}