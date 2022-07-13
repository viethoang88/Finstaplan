import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../../src/graphql/mutations";
import { v4 as uuidv4 } from "uuid";
import { uiSliceActions } from "../ui";
/*
type PreassessmentResponse
  @model
  @key(fields: ["id"])
  #@key(name: "id", fields: ["id"])
  @key(name: "byAdvisor", fields: ["advisorID"])
  @key(name: "byUnderwriter", fields: ["underwriterID"])
  @key(
    name: "byPreassessmentResponse"
    fields: ["preassessmentID", "underwriterID"]
  )
  @key(
    name: "byClientAndAdvisor"
    fields: ["clientID", "preassessmentID", "advisorID"]
  ) {
    id: ID!
    underwriterID: ID!
    clientID: ID!
    clientFullName: String!
    underwriterFullName: String!
    underwriterCompany: String!
    advisorID: ID!
    preassessmentID: ID!
    underwriter: Underwriter! @connection(fields: ["underwriterID"])
    response: AWSJSON
    # This is only for a many-many connection:
    #underwriter: PreassessmentResponseUnderwriterAdvisor!
    #  @connection(keyName: "byUnderwriter", fields: ["id"])
}*/

// const createRequestURI = "/api/underwriter/createrequest";

const attachIdToUnderwriter = (underwriterID, responseId) => {
  const mutation = graphqlOperation(
    `
    mutation UpdateUnderwriter(
      $input: UpdateUnderwriterInput!
      $condition: ModelUnderwriterConditionInput
    ) {
      updateUnderwriter(input: $input, condition: $condition) {
        id
        preassessmentResponses
      }
    }
  `,
    {
      input: {
        filter: { id: underwriterID },
        set: { preassessmentResponses: [responseId] },
      },
    }
  );
  return mutation;
};

/*
        preassessmentObject.response,
        preassessmentObject.underwriterID,
        preassessmentObject.clientID,
        preassessmentObject.clientFullName,
        preassessmentObject.underwriterFullName,
        preassessmentObject.underwriterCompany,
        preassessmentObject.advisorID,
        preassessmentObject.id
*/
const createLinks = (
  response,
  underwriterID,
  clientID,
  clientFullName,
  underwriterFullName,
  underwriterCompany,
  advisorID,
  preassessmentID,
  responseId
) => {
  const mutation = graphqlOperation(
    `mutation CreatePreassessmentResponse(
        $input: CreatePreassessmentResponseInput!
        $condition: ModelPreassessmentResponseConditionInput
      ) {
        createPreassessmentResponse(input: $input, condition: $condition) {
          id
          underwriterID
          clientID
          advisorID
          preassessmentID
          response
          clientFullName
          underwriterFullName
          underwriterCompany
        }
      }
      mutation CreatePreassessmentResponseUnderwriterAdvisor(
        $input: CreatePreassessmentResponseUnderwriterAdvisorInput!
        $condition: ModelPreassessmentResponseUnderwriterAdvisorConditionInput
      ) {
        createPreassessmentResponseUnderwriterAdvisor(
          input: $input
          condition: $condition
        ) {
          advisorID
          clientID
          preassessmentID
          underwriterID
          preassessmentResponseID
        }
      }
  `,
    {
      input: {
        id: responseId,
        responseID: responseId,
        advisorID: advisorID,
        clientID: clientID,
        preassessmentID: preassessmentID,
        underwriterID: underwriterID,
        response: response,
        clientFullName,
        underwriterFullName,
        underwriterCompany,
      },
    }
  );

  return mutation;
};

export const createPreassessmentResponse = (preassessmentObject) => {
  return async (dispatch, getState) => {
    console.log("--- ATTEMPTING TO CREATE A PREASSESSMENT RESPONSE ---");
    const responseId = uuidv4();
    // const advisorId = getState().auth.sub;
    // const clientId = getState().factFind.id;
    // const uidPreassessment = uuidv4();
    try {
      const operation = createLinks(
        preassessmentObject.response,
        preassessmentObject.underwriterID,
        preassessmentObject.clientID,
        preassessmentObject.clientFullName,
        preassessmentObject.underwriterFullName,
        preassessmentObject.underwriterCompany,
        preassessmentObject.advisorID,
        preassessmentObject.id,
        responseId
      );
      const preassessmentResponse = await API.graphql(operation);
      const attachedIdToUw = await attachIdToUnderwriter(
        preassessmentObject.underwriterID,
        responseId
      );
      console.log("--- CREATE PREASSESSMENT RESPONSE SUCCESS ---");
      console.log(preassessmentResponse);
      console.log(attachedIdToUw);
      dispatch(
        uiSliceActions.setAttribute({
          attribute: "preassessmentStep",
          newVal: {
            step: "success",
            message: "Successfully Created Pre-Assessment Response",
            preassessment: preassessmentObject,
          },
        })
      );
      // try {
      //   const preassessment = await API.graphql(
      //     graphqlOperation(mutations.createPreassessmentResponse, {
      //       input: { advisorId, clientId, ...preassessmentObject },
      //     })
      //   );
    } catch (e) {
      console.log("--- LINK MUTATION FAILED ---");
      console.log(e);
      dispatch(
        uiSliceActions.setAttribute({
          attribute: "preassessmentStep",
          newVal: {
            step: "error",
            message: "Failed to Create Pre-Assessment RESPONSE",
            preassessment: preassessmentObject,
          },
        })
      );

      return preassessmentObject;
    }
  };
};

export default createPreassessmentResponse;
