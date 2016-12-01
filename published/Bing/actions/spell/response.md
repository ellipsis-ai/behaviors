{successResult.comment}
{for flaggedToken in successResult.flaggedTokens}
**{flaggedToken.token}**
  {for suggestion in flaggedToken.suggestions}
> {suggestion.suggestion}
  {endfor}
{endfor}