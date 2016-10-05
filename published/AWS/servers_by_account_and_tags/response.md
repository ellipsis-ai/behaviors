Account Label: **{account_label}**, Regions: **{successResult.regions}**

Total Instances: **{successResult.count}**

{for instance in successResult.instances}
**{instance.PublicDnsName}**
> Region: {instance.accountRegion}
> Id: {instance.InstanceId}
> Private Ip: {instance.PrivateIpAddress}
> Public Ip: {instance.PublicIpAddress}
> Tags:
> {for tag in instance.Tags}
> --{tag.Key} = {tag.Value}
> {endfor}
{endfor}