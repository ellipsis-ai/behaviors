S3 Utilization (from latest CloudWatch metrics)

{for ea in successResult}
- **{ea.bucket}:** {ea.count} objects using {ea.storage}
{endfor}