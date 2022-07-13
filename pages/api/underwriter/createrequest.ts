// var titleValues = ["The Big New Movie 2012", "The Big New Movie"];
// var titleObject = {};
// var index = 0;
// titleValues.forEach(function(value) {
//     index++;
//     var titleKey = ":titlevalue"+index;
//     titleObject[titleKey.toString()] = value;
// });

// var params = {
//     TableName : "Movies",
//     FilterExpression : "title IN ("+Object.keys(titleObject).toString()+ ")",
//     ExpressionAttributeValues : titleObject
// };

// import { createPreassessment } from "../../../src/graphql/mutations";
import { CollectionsOutlined } from "@mui/icons-material";
import { ConsoleLogger } from "aws-amplify/node_modules/@aws-amplify/core";
import { constant } from "lodash";
import DocumentClient from "../../../src/libs/dynamodb-client";
import { emailUnderwriters } from "../../../src/libs/email-underwriters";
const tableName = "Underwriter-dbyhygtluvg5neowfoyptdthhy-dev";
const url = `${process.env.SITE_URL}/underwriter/`;
// STEP LAST: Create Preassessment: REQUIRES DOING
// -- MAYBE DO THIS ON THE FRONTEND ??
/*type Preassessment @model {
  id: ID!
  advisorName: String!
  dealerGroup: String!
  clientName: String!
  dob: String!
  gender: String!
  healthInfo: AWSJSON!
  attachments: AWSJSON
}*/
const _createPreassessment = (preassessment) => {};

// STEP 2: Check underwriters exist:
// ValidationException: Invalid KeyConditionExpression: Syntax error; token: "[", near: "[object"
const checkUnderwritersExist = async (underwriters, docClient) => {
  const emails = underwriters.map((uw) => uw.email);
  const emailObject = {};
  const keyConditionsObject = {};
  let index = 0;
  emails.forEach(function (value) {
    index++;
    const emailKey = ":emailvalue" + index;
    emailObject[emailKey.toString()] = value;
    //keyConditionsObject[emailKey.toString()] = { S: value };
  });

  const params = {
    TableName: tableName,
    // REQUIRED FOR .query BUT NOT for .scan:
    //KeyConditionExpression: keyConditionsObject,
    FilterExpression: "email IN (" + Object.keys(emailObject).toString() + ")",
    ExpressionAttributeValues: emailObject,
    ProjectionExpression:
      "email, firstName, lastName, id, employerName, businessNumber",
  };

  try {
    return (
      docClient
        .scan(params)
        // .query(params)
        .promise()
        .then((resp) => {
          console.log("--- READ WORKED ----");
          console.log(resp);
          return resp;
        })
        .catch((e) => {
          console.log("--- READ FAILED ---");
          console.error(e);
        })
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// STEP 3: if not, create them and store their IDs.
const createNewUnderwriters = async (newUnderwriters, docClient) => {
  if (newUnderwriters?.length === 0) return [true, "No new underwriters"];
  const successArray = [];

  if (newUnderwriters.length <= 25) {
    try {
      const success = await batchWrite(newUnderwriters, docClient);
      successArray.push(success);
    } catch (e) {
      console.log(e);
      throw e;
    }
  } else {
    let numNewUnderwriters = newUnderwriters.length;
    let windowStart = 0;
    let windowEnd = 24;
    while (numNewUnderwriters > 0) {
      const batch = newUnderwriters.slice(windowStart, windowEnd);
      windowStart += 25;
      windowEnd += 25;
      numNewUnderwriters -= 25;
      try {
        const success = await batchWrite(batch, docClient);
        successArray.push(success);
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
  return successArray;
};

const batchWrite = async (arrayOf25, docClient) => {
  console.log("--- PERFORMING A BATCH WRITE WITH ---");
  console.log(arrayOf25);

  // 25 is as many as you can write in one time
  const itemsArray = [];

  for (let i = 0; i < arrayOf25.length; i++) {
    const someItem = arrayOf25[i];
    const item = {
      PutRequest: {
        Item: someItem,
      },
    };

    if (item) {
      itemsArray.push(item);
    }
  }

  const params = {
    RequestItems: {
      [tableName]: itemsArray,
    },
  };

  return docClient.batchWrite(params, function (err, data) {
    if (err) {
      console.log("--- batchWrite FAILED ---");
      console.log(err);
      // throw(err);
      return [false, err];
    } else {
      console.log("--- batchWrite SUCCESS ---");
      console.log("Added " + itemsArray.length + " items to DynamoDB");
      console.log(data);
      return [true, data];
    }
  });
};

// STEP 4: Email an invite to underwriters that don't exist with URL that includes their ID:
// - `process.env.SITE_URL/underwriter/${id}`
// - USAGE: emailUnderwriters(underwriters, advisorName, advisorCompany, advisorProfile = undefined)

// STEP 5: Attach this Preassessment ID to PreassessmentUnderwriter (OR to Underwriter directly in an array of preassessment ids?)
// - queries: null ??? - maybe you can't create this directly.
/*type PreassessmentUnderwriter
  @key(
    name: "byId"
    fields: ["clientID", "advisorID", "underwriterID", "preassessmentID"]
  )
  @auth(rules: [{ allow: owner, ownerField: "advisorID" }])
  @model(queries: null) {
  clientID: ID!
  client: Client! @connection(fields: ["clientID"])
  advisorID: ID!
  advisor: Advisor! @connection(fields: ["advisorID"])
  underwriterID: ID!
  underwriter: Underwriter! @connection(fields: ["underwriterID"])
  preassessmentID: ID!
  preassessment: Preassessment! @connection(fields: ["preassessmentID"])
}*/

async function handler(req, res) {
  if (req.method === "POST") {
    const docClient: AWS.DynamoDB.DocumentClient =
      DocumentClient.getDocumentClient();

    const { underwriters, advisorProfile } = JSON.parse(req.body);
    if (underwriters === undefined || advisorProfile === undefined)
      return res.json({ error: "data missing from request" });

    const advisorName = advisorProfile.firstName;
    const advisorCompany = advisorProfile.employerNme;

    // STEP 1: Create Preassessment (MOVE TO FRONTEND AND CALL THIS WITH THE ID???):
    // createPreassessment(preassessment);

    // STEP 2: Check underwriters exist:
    const result = await checkUnderwritersExist(underwriters, docClient);
    const existingUnderwriters = result.Items;
    console.log("--- existing underwriters ---");
    console.log(existingUnderwriters);

    // STEP 3: for those that don't exist, create them and store their IDs for step 4.
    const reshapedUnderwriters = existingUnderwriters.reduce((acc, next) => {
      acc[next?.email] = next;
      return acc;
    }, {});
    const newUnderwriters = underwriters.filter(
      (uw) => reshapedUnderwriters[uw?.email] === undefined
    );
    // console.log("--- newUnderwriters ---");
    // console.log(newUnderwriters);

    if (newUnderwriters.length === 0) {
      return res.json({
        message: "Underwriters already exist, proceeding to next step.",
        _underwriters: existingUnderwriters,
      });
    }

    const successArray = await createNewUnderwriters(
      newUnderwriters,
      docClient
    );
    console.log("--- createUnderwriters success array ---");
    console.log(successArray);

    // STEP 4: Email an invite to underwriters that don't exist with URL that includes their ID:
    const emailSuccessArray = await emailUnderwriters(
      newUnderwriters,
      advisorName,
      advisorCompany,
      advisorProfile
    );

    console.log("--- emailUnderwriters success array ---");
    console.log(emailSuccessArray);
    // const successObject = generateSuccessObject(emailSuccessArray, successArray);

    return res.json({
      message: "Successfully created new Uuderwriters, proceeding to next step",
      _underwriters: [...existingUnderwriters, ...newUnderwriters],
    });

    // STEP 5: Attach this Preassessment ID to PreassessmentUnderwriter (OR to Underwriter directly in an array of preassessment ids?)
  }
}

export default handler;
