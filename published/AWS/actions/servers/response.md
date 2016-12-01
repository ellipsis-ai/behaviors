**EC2 Instances**

**Total Instances: {successResult.count}**

{for instance in successResult.instances}

======================================

**{instance.PublicDnsName}**

**Id:** {instance.InstanceId}

**Private Ip**: {instance.PrivateIpAddress}

**Public Ip:** {instance.PublicIpAddress}

**Tags:**
{for tag in instance.Tags}
{tag.Key} => {tag.Value}
{endfor}  
{endfor}
