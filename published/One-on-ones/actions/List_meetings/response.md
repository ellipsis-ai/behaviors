{if successResult.isEmpty}
I'm not currently managing any meetings for you. Type `…add 1:1` to add some meetings.
{else}
{for meeting in successResult.meetings}
- {meeting.label}
{endfor}
{endif}