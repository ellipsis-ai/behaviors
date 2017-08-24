Looked at {successResult.total} certs  

Expired: {successResult.total_expired}  

Expiring in a week: {successResult.total_expiring_next_7_days}
{for item in successResult.expiring_next_7_days} 
* {item.identifier}, {item.valid_to_string_local} (Source: {item.source})
{endfor}

Expiring in a month: {successResult.total_expiring_next_30_days}
{for item in successResult.expiring_next_30_days}
* {item.identifier}, {item.valid_to_string_local} (Source: {item.source})
{endfor}

Expiring in the far away future: {successResult.total_expiring_far_way}
{for item in successResult.expiring_far_way}
* {item.identifier}, {item.valid_to_string_local} (Source: {item.source})
{endfor}

