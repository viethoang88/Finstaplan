import AWS from "aws-sdk";
import aws_exports from "../../aws-exports";

// const region = aws_exports.aws_appsync_region;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: aws_exports.aws_appsync_region,
});

class DocumentClient {
  private static docClient: AWS.DynamoDB.DocumentClient | undefined;

  constructor(props) {
    DocumentClient.docClient = undefined;
  }

  static getDocumentClient(): AWS.DynamoDB.DocumentClient {
    if (DocumentClient.docClient !== undefined) return DocumentClient.docClient;
    else {
      DocumentClient.docClient = new AWS.DynamoDB.DocumentClient();
      return DocumentClient.docClient;
    }
  }
}

export default DocumentClient;

// const dynamodb = new AWS.DynamoDB({apiVersion: "2012-08-10"});

// ????
// const AUTH_TYPE = require("aws-appsync/lib/link/auth-link").AUTH_TYPE;
// import AWSAppSyncClient from "aws-app sync";

// AWS.config.update({
//   region: aws_exports.REGION,
//   credentials: new AWS.Credentials({
//     accessKeyId: aws_exports.AWS_ACCESS_KEY_ID,
//     secretAccessKey: aws_exports.AWS_SECRET_ACCESS_KEY,
//   }),
// });

// const url = aws_exports.aws_appsync_graphqlEndpoint;
// const type = AUTH_TYPE.AWS_IAM;

// end ???
