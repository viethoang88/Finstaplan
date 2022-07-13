import DocumentClient from "../../../src/libs/dynamodb-client";
const tableName = "Underwriter-dbyhygtluvg5neowfoyptdthhy-dev";

async function handler(req, res) {
  if (req.method === "GET") {
    const docClient: AWS.DynamoDB.DocumentClient =
      DocumentClient.getDocumentClient();

    try {
      return docClient
        .scan({
          TableName: tableName,
          ProjectionExpression:
            "email, firstName, lastName, id, employerName, businessNumber",
        })
        .promise()
        .then((resp) => {
          console.log("--- READ WORKED ----");
          console.log(resp);

          // const reshapedItems = resp.Items.map((item) => {
          //   delete item.password;
          //   return item;
          // });

          return res.json({
            message: "success",
            data: resp.Items,
            count: resp.Count,
            scannedCount: resp.ScannedCount,
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
