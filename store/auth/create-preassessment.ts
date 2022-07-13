import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../../src/graphql/mutations";
import { v4 as uuidv4 } from "uuid";
import { uiSliceActions } from "../ui";
/*
type Preassessment @model {
    id: ID!
    advisorName: String!
    dealerGroup: String!
    clientName: String!
    dob: String!
    gender: String!
    healthInfo: AWSJSON!                                            -> object, completed health form answers for <HealthForm> component
    attachments: String                                             -> s3 path name to relevant attachments for this preassessment
    underwriters: [Underwriter!] @connection(fields: ["id"])
}*/

// const createRequestURI = "/api/underwriter/createrequest";

// NOTE: need to create the underwriters first because their IDs need to be attached when creating the preassessment...
//"The variables input contains a field name 'underwriters' that is not defined for input object type 'CreatePreassessmentInput' "
const createLinks2 = (
  preassessment,
  underwriter,
  underwriterId,
  preassessmentId,
  advisorId,
  clientId
) => {
  // const mutationString = `mutation CreateLinks {
  //   ${underwriters.map((uw) => {
  //     `createPreassessmentUnderwriter(input: {id: ${preassessmentId}, advisorID: ${advisorId}, clientID: ${clientId}, underwriterID: ${uw.id}}) {
  //       id
  //     }`;
  //   })}
  // `;

  //"Variable 'input' has coerced Null value for NonNull type 'ID!'"
  //"Variable 'input' has coerced Null value for NonNull type 'ID!'"
  //"The variables input contains a field name 'preassessment' that is not defined for input object type 'CreatePreassessmentUnderwriterInput' "
  // "The variables input contains a field name 'preassessment' that is not defined for input object type 'CreatePreassessmentUnderwriterInput' "

  const mutation = graphqlOperation(
    `mutation CreatePreassessmentUnderwriter(
      $input: CreatePreassessmentUnderwriterInput!
      $condition: ModelPreassessmentUnderwriterConditionInput
    ) {
      createPreassessmentUnderwriter(input: $input, condition: $condition) {        
        advisorID
        clientID
        preassessmentID
        underwriterID
        preassessment {
          id
          advisorId
          advisorName
          dealerGroup
          clientName
          dob
          gender
          healthInfo
          preassessmentData
          attachments
        }
        underwriter {
            id
            email
            password
            firstName
            lastName
            employerName
            businessNumber
            mobile
            phone
            status
        }        
      }  
    }
  `,
    {
      input: {
        // id: uuidv4(),
        advisorID: advisorId,
        clientID: clientId,
        preassessmentID: preassessmentId,
        underwriterID: underwriterId,
        preassessment: preassessment,
        underwriter: underwriter,
      },
    }
  );

  return mutation;
};

const createLinkPair = (
  preassessment,
  underwriter,
  underwriterId,
  preassessmentId,
  advisorId,
  clientId
) => {
  return [
    `mutation CreatePreassessmentUnderwriter(
      $input: CreatePreassessmentUnderwriterInput!
      $condition: ModelPreassessmentUnderwriterConditionInput
    ) {
      createPreassessmentUnderwriter(input: $input, condition: $condition) {        
        advisorID
        clientID
        preassessmentID
        underwriterID       
      }  
    }
  `,
    {
      input: {
        advisorID: advisorId,
        clientID: clientId,
        preassessmentID: preassessmentId,
        underwriterID: underwriterId,
      },
    },
  ];
};

const generateBulkMutationLinks = (
  underwriters,
  preassessmentObject,
  advisorId,
  clientId
) => {
  const underwriterIds = underwriters.map((uw) => uw.id);
  let query = `
    mutation CreatePreassessment(
        $input: CreatePreassessmentInput!
        $condition: ModelPreassessmentConditionInput
      ) {
        createPreassessment(input: $input, condition: $condition) {
          id
          advisorId
          clientId
          advisorName
          dealerGroup
          clientName
          dob
          gender
          healthInfo
          preassessmentData
          attachments
        }
      }
    `;
  const input = {
    id: preassessmentObject.id,
    advisorId: advisorId,
    advisorID: advisorId,
    clientId: clientId,
    clientID: clientId,
    preassessmentID: preassessmentObject.id,
    underwriters: underwriters,
    underwriterIDs: underwriterIds,
    attachments: preassessmentObject.attachments,
    preassessmentData: preassessmentObject.preassessmentData,
    healthInfo: preassessmentObject.healthInfo,
    gender: preassessmentObject.gender,
    dob: preassessmentObject.dob,
    clientName: preassessmentObject.clientName,
    dealerGroup: preassessmentObject.dealerGroup,
    advisorName: preassessmentObject.advisorName,
  };

  query += `
    mutation CreatePreassessmentUnderwriter(
      $input: CreatePreassessmentUnderwriterInput!
      $condition: ModelPreassessmentUnderwriterConditionInput
    ) {
  `;

  underwriters.forEach((uw, idx) => {
    query += `
        create${idx}: createPreassessmentUnderwriter(input: $input, condition: $condition) {        
          advisorID
          clientID
          preassessmentID
          underwriterID${idx}       
        }        
    `;
    input[`underwriterID${idx}`] = uw.id;
  });

  query += `
    }
  `;

  return [query, input];

  // underwriters.forEach((uw, idx) => {
  //   query += `
  //     mutation CreatePreassessmentUnderwriter(
  //       $input: CreatePreassessmentUnderwriterInput!
  //       $condition: ModelPreassessmentUnderwriterConditionInput
  //     ) {
  //       create${idx}: createPreassessmentUnderwriter(input: $input, condition: $condition) {
  //         advisorID
  //         clientID
  //         preassessmentID
  //         underwriterID${idx}
  //       }
  //     }
  //   `;
  //   input[`underwriterID${idx}`] = uw.id;
  // });
  // return [query, input];
};

const createLinks = (
  preassessment,
  underwriter,
  underwriterId,
  preassessmentId,
  advisorId,
  clientId
) => {
  const mutation = graphqlOperation(
    `
    mutation CreatePreassessmentUnderwriter(
      $input: CreatePreassessmentUnderwriterInput!
      $condition: ModelPreassessmentUnderwriterConditionInput
    ) {
      createPreassessmentUnderwriter(input: $input, condition: $condition) {        
        advisorID
        clientID
        preassessmentID
        underwriterID       
      }  
    }
  `,
    {
      input: {
        advisorID: advisorId,
        clientID: clientId,
        preassessmentID: preassessmentId,
        underwriterID: underwriterId,
      },
    }
  );

  return mutation;
};

const createPreassessment = (preassessmentObject, underwriters) => {
  return async (dispatch, getState) => {
    console.log("--- ATTEMPTING TO CREATE A PREASSESSMENT ---");
    const advisorId = getState().auth.sub;
    const clientId = getState().factFind.id;
    // const uidPreassessment = uuidv4();
    // const bulkMutation = generateBulkMutationLinks(
    //   underwriters,
    //   preassessmentObject,
    //   advisorId,
    //   clientId
    // );
    // console.log(bulkMutation);

    try {
      // TESTING CODE FOR LOADING THING:
      // const preassessmentWithLinks = await new Promise((res, rej) => {
      //   setTimeout(() => {
      //     return res(true);
      //   }, 2000);
      // });

      // TRYING: DOESNT WORK
      // const preassessmentWithLinks = await API.graphql(
      //   graphqlOperation(bulkMutation[0], { input: bulkMutation[1] })
      // );
      // console.log(
      //   "--- BULK MUTATION SUCCESSFUL WHEN CREATING PRE-ASSESSMENT ---"
      // );
      // console.log(preassessmentWithLinks);

      // WORKS:
      const preassessment = await API.graphql(
        graphqlOperation(mutations.createPreassessment, {
          input: { advisorId, clientId, ...preassessmentObject },
        })
      );

      // NOTE: the preassessment is created successfully here...
      // - NOTE: any one of these mutations can fail: BUT does it throw an error if one does?
      const linkMutation = await Promise.all(
        underwriters.map((uw) =>
          API.graphql(
            createLinks(
              preassessmentObject,
              uw,
              uw.id,
              preassessmentObject.id,
              advisorId,
              clientId
            )
          )
        )
      );
      console.log(linkMutation);
      console.log("--- LINK MUTATION SUCCESS ---");
      // try {
      // TODO: try figure out how to batch these operations:
      // - NOTE: idea: concatenate onto mutation string, build input object with advisorId1, clientId1,... to advisorIdN, clientIdN etc.
      // - would be an array of arrays [mutationString, inputObject]

      // const linksMutation = underwriters.map((uw) =>
      //   createLinkPair(
      //     preassessmentObject,
      //     uw,
      //     uw.id,
      //     preassessmentObject.id,
      //     advisorId,
      //     clientId
      //   )
      // );

      // console.log(linksMutation);

      // const lMutation = API.graphql(graphqlOperation(
      //   linksMutation
      // ))
    } catch (e) {
      console.log("--- LINK MUTATION FAILED ---");
      console.log(e);
      dispatch(
        uiSliceActions.setAttribute({
          attribute: "preassessmentStep",
          newVal: {
            step: "error",
            message: "Failed to Create Pre-Assessment",
            preassessment: preassessmentObject,
          },
        })
      );
    }

    // console.log(preassessment);
    console.log("--- CREATE PREASSESSMENT SUCCESS ---");
    dispatch(
      uiSliceActions.setAttribute({
        attribute: "preassessmentStep",
        newVal: {
          step: "success",
          message: "Successfully Created Pre-Assessment",
          preassessment: preassessmentObject,
        },
      })
    );
    // return preassessment;

    // } catch (e) {
    //   console.log("--- CREATE PREASSESSMENT FAILED WITH INPUTS: ---");
    //   console.log(preassessmentObject);
    //   console.log(e);
    //   dispatch(
    //     uiSliceActions.setAttribute({
    //       attribute: "preassessmentStep",
    //       newVal: {
    //         step: "error",
    //         message: "Failed to Create Pre-Assessment",
    //         preassessment: preassessmentObject,
    //       },
    //     })
    //   );
    //   return { error: e };
    // }
  };
};

export default createPreassessment;
