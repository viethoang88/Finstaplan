import ses from "../../src/libs/ses-client";
const SenderEmailId = "<preassessment@finstaplan.com>";

export const emailUnderwriters = async (
  underwriters,
  advisorName,
  advisorCompany,
  advisorProfile = undefined
) => {
  const emails = [];
  const signupUrls = [];
  const firstNames = [];
  const results = [];
  underwriters.forEach((uw) => {
    emails.push(uw.email);
    const signupUrl = `${process.env.SITE_URL}/underwriter/${uw.id}`;
    const firstName = uw.firstName ? uw.firstName : "Insurance Underwriters";
    signupUrls.push(signupUrl);
    firstNames.push(firstName);
  });
  for (let i = 0; i < emails.length; i++) {
    const success = await emailUnderwriter(
      emails[i],
      firstNames[i],
      signupUrls[i],
      advisorName,
      advisorCompany,
      advisorProfile
    );
    results.push(success);
  }
  return [emails, results];
};

const createSourceStringFromAvailableData = (advisorName, advisorEmployer) => {
  let sourceStr = "";
  if (advisorName !== undefined) {
    sourceStr += advisorName;
    if (advisorEmployer !== undefined) {
      sourceStr += "@" + advisorEmployer;
    }
  } else {
    sourceStr = "PreassessmentRequests@Finstaplan";
  }
};

export const createFromLineFromAvailableData = (
  advisorName,
  advisorSurname,
  advisorCompany,
  advisorDealerGroup
) => {
  let string = "";
  if (advisorName !== undefined) string += advisorName;
  if (advisorSurname !== undefined) string += " " + advisorSurname;
  if (advisorCompany !== undefined) string += " from " + advisorCompany;
  if (advisorDealerGroup !== undefined) string += ` (${advisorDealerGroup})`;
  return string;
};

// CAN use style tags within the embedded html.
// WANT to attach senders footer (logo, details, etc)....
export const emailUnderwriter = async (
  email,
  firstName,
  signupUrl,
  advisorName,
  advisorCompany,
  advisorProfile = undefined
) => {
  const FROM_LINE = createFromLineFromAvailableData(
    advisorProfile?.firstName,
    advisorProfile?.lastName,
    advisorProfile?.employerName,
    advisorProfile?.dealerGroup
  );
  const SOURCE_STRING = createSourceStringFromAvailableData(
    advisorProfile?.firstName,
    advisorProfile?.employerName
  );
  const params = {
    Destination: {
      ToAddresses: [email], // Email address/addresses that you want to send your email
    },
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: `<html>
                    <body>
                        <h1>Dear ${firstName},</h1>
                        <p>${FROM_LINE} has requested an insurance pre-assessment request using your email address.</p>
                        <p>As you have not yet registered for your finstaplan account, this request will be stored for you and ${advisorName} will be notified that you do not have an account.</p>
                        <p>
                            To respond to this request with an insurance quote,
                            please go to <a href="${signupUrl}">${signupUrl}</a> 
                            and create an account to proceed - it will take a couple minutes.
                            The clients health information and details of cover requested will be visible to you in your dashboard interface.
                        </p>
                        <p>Once your account is activated, you will receive many more preassessment requests through the finstaplan system.</p>
                        <p>Warm regards,</p>
                        <p>Finstaplan team
                    </body>
                </html>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `You have received a request for an insurance pre-assessment from ${FROM_LINE}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `You have received a request for an insurance pre-assessment from ${FROM_LINE}`,
      },
    },
    Source: `${SOURCE_STRING} via` + SenderEmailId,
  };

  //For Sender
  const params1 = {
    Destination: {
      ToAddresses: [SenderEmailId], // Email address/addresses that you want to send your email
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
                    <h2>Underwriter Invite Sent to:</h2>
                    <h3>Name: ${firstName}</h3>
                    <h3>Email: ${email}</h3>
                    <h3>From Advisor: ${advisorName} at ${advisorCompany} </h3>
                </html>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `This is the response from underwriter ${firstName} at ${email}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Response from underwriter",
      },
    },
    Source: "Response from underwriter" + SenderEmailId,
  };

  const sendEmailReceiver = ses.sendEmail(params).promise();
  const sendEmailSender = ses.sendEmail(params1).promise();

  return sendEmailReceiver
    .then((data) => {
      console.log("email submitted to SES", data);
      sendEmailSender
        .then((data) => {
          console.log("email successfully submitted to SES", data);
          return true;
        })
        .catch((error) => {
          console.log("--- ERROR SENDING EMAIL ---");
          console.log(error);
          return false;
        });
    })
    .catch((error) => {
      console.log(error);
      console.log("--- ERROR SENDING EMAIL ---");
      console.log(error);
      return false;
    });
};
