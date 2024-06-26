resource "aws_iam_policy" "allow_publish_to_manager_instruction_sns_topic" {
  name        = "${local.title_PascalCase}-AllowPublishToManagerInstructionSNSTopic"
  description = "Allows publishing messages to the Manager Instruction SNS Topic"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sns:Publish"
        ],
        Resource = module.manager_instruction_sns_topic.topic_arn
      }
    ]
  })
}

resource "aws_iam_policy" "allow_manage_and_describe_instance" {
  name        = "${local.title_PascalCase}-AllowManageInstance"
  description = "Allow starting, stopping and rebooting the Minecraft server instance"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:RebootInstances",
          "ec2:StartInstances",
          "ec2:StopInstances"
        ],
        "Resource" : "arn:aws:ec2:${var.aws_region}:*:instance/*",
        "Condition" : {
          "StringEquals" : { "aws:ResourceTag/minecraft-spot-discord:related" : "true" }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : "ec2:DescribeInstances",
        "Resource" : "*" // https://stackoverflow.com/a/36768898/11138267
      }
    ]
  })
}
