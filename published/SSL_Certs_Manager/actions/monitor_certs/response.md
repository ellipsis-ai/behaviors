{ if successResult.criticals_flag  }
Certs expiring in the next 7 days:
{for cert in successResult.criticals} 
* {cert.identifier} expires on *{cert.valid_to_string_local}* (Source: {cert.source})
{endfor}
{endif}
{ if successResult.warnings_flag }
Certs expiring in the next 30 days:
{for cert in successResult.warnings} 
* {cert.identifier}, expires on *{cert.valid_to_string_local}* (Source: {cert.source})
{endfor}
{endif}
{ if successResult.infos_flag }
Certs expiring in the next 60 days:
{for cert in successResult.infos} 
* {cert.identifier} expires on *{cert.valid_to_string_local}* (Source: {cert.source})
{endfor}
{endif}
