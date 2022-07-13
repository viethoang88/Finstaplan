import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../../../src/graphql/mutations";
import * as queries from "../../../src/graphql/queries";
import bcrypt from "bcryptjs";
import DocumentClient from "../../../src/libs/dynamodb-client";
const tableName = "Underwriter-dbyhygtluvg5neowfoyptdthhy-dev";

/*
    BCRYPT_SALT_ROUNDS,
    BCRYPT_PASS,
    
    DATA shape:

    type Underwriter @model {
        id: ID!  
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        employerName: String!
        businessNumber: String!
        mobile: String
        phone: String
        }
*/

async function handler(req, res) {
  if (req.method === "POST") {
    const docClient: AWS.DynamoDB.DocumentClient =
      DocumentClient.getDocumentClient();

    console.log(req.body);
    console.log(typeof req.body);
    const {
      id,
      email,
      password,
      firstName,
      lastName,
      employerName,
      businessNumber,
      phone,
      mobile,
    } = JSON.parse(req.body);

    bcrypt
      .hash(password, process.env.BCRYPT_SALT_ROUNDS)
      .then(function (hash) {
        // Store hash in your password DB.
        const hashedData = {
          id,
          email,
          password: hash,
          firstName,
          lastName,
          employerName,
          businessNumber,
          phone,
          mobile,
        };
        console.log("--- HASHING PASSWORD SUCCESSFULL ---");
        console.log(hashedData);

        return docClient
          .put({
            TableName: tableName,
            Item: hashedData,
          })
          .promise();
      })
      .then((res) => {
        console.log(`--- SUCCESSFULLY INPUT ${firstName} with ${email}`);
        console.log(res);
      })
      .catch((e) => {
        console.log("--- HASHING PASSWORD FAILED or INPUT DATA FAILED ---");
        console.error(e);
        res.status(500);
        res.json({ message: "failed" });
      });
  }
}

export default handler;
