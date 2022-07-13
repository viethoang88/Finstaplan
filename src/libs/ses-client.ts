// import { Config } from "aws-sdk";
// import { SESClient } from "@aws-sdk/client-ses";
// Set the AWS Region.
// const REGION = "us-east-1"; //e.g. "us-east-1"
// Create SES service object.
// const sesClient = new SESClient({ region: REGION });
// export { sesClient };

import AWS from "aws-sdk";
import aws_exports from "../../aws-exports";

// const region = aws_exports.aws_appsync_region;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: aws_exports.aws_appsync_region,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

export default ses;
