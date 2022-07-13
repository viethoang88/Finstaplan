// import { SendEmailCommand } from "@aws-sdk/client-ses";
// // import { sesClient } from "../../../src/libs/ses-client";

// // Set the parameters
// const params = {
//   Destination: {
//     /* required */
//     CcAddresses: [
//       /* more items */
//     ],
//     ToAddresses: [
//       "RECEIVER_ADDRESS", //RECEIVER_ADDRESS
//       /* more To-email addresses */
//     ],
//   },
//   Message: {
//     /* required */
//     Body: {
//       /* required */
//       Html: {
//         Charset: "UTF-8",
//         Data: "HTML_FORMAT_BODY",
//       },
//       Text: {
//         Charset: "UTF-8",
//         Data: "TEXT_FORMAT_BODY",
//       },
//     },
//     Subject: {
//       Charset: "UTF-8",
//       Data: "EMAIL_SUBJECT",
//     },
//   },
//   Source: "SENDER_ADDRESS", // SENDER_ADDRESS
//   ReplyToAddresses: [
//     /* more items */
//   ],
// };

// const run = async () => {
//   try {
//     const data = await sesClient.send(new SendEmailCommand(params));
//     console.log("Success", data);
//     return data; // For unit tests.
//   } catch (err) {
//     console.log("Error", err);
//   }
// };
// run();
