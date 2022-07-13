import DocumentClient from "../../../src/libs/dynamodb-client";
const tableName = "Underwriter-dbyhygtluvg5neowfoyptdthhy-dev";

async function handler(req, res) {
  if (req.method === "POST") {
    const docClient: AWS.DynamoDB.DocumentClient =
      DocumentClient.getDocumentClient();

    const { id } = JSON.parse(req.body);
    console.log(id);

    try {
      return docClient
        .query({
          ExpressionAttributeNames: {
            "#ID": "id",
          },
          ExpressionAttributeValues: {
            // ":id": { N: id },
            ":id": id,
          },
          KeyConditionExpression: "#ID = :id",
          TableName: tableName,
          ProjectionExpression:
            "email, firstName, lastName, id, employerName, businessNumber",
        })
        .promise()
        .then((resp) => {
          console.log("--- READ WORKED ----");
          console.log(resp);

          return res.json({
            message: "success",
            data: resp.Items,
          });
        })
        .catch((e) => {
          console.log("--- READ FAILED ---");
          console.error(e);
          res.status(500);
          return res.json({ message: "failed" });
        });
    } catch (e) {
      res.status(500);
      return res.json({ message: "failed" });
    }
  }
}

export default handler;
