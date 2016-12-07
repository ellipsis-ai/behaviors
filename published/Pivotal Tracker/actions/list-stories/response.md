{if successResult.isEmpty}
No {storyState.label} stories in {project.label}
{else}
{for story in successResult.stories}
- [{story.name}]({story.url})
{endfor}
{endif}