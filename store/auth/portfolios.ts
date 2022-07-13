import * as mutations from "../../src/graphql/mutations";
import * as queries from "../../src/graphql/queries";
import * as subscriptions from "../../src/graphql/subscriptions";
import { API, graphqlOperation } from "aws-amplify";

export const updateAssumptions = (key, value) => {
  return async (dispatch, getState) => {
    try {
      const advisorId = getState().auth.sub;

      const advisor = await API.graphql(
        graphqlOperation(mutations.updateClient, {
          input: {
            id: advisorId,
            key: value,
          },
        })
      );

      console.log("--- UPDATED ASSUMPTIONS SUCCESS ----");
      console.log(advisor);
    } catch (e) {
      console.log("--- ERROR UPDATING ASSUMPTIONS ---");
      console.log(e);
    }
  };
};

export const setAssumptions = (assumptions) => {
  return async (dispatch, getState) => {
    try {
      const advisorId = getState().auth.sub;

      const advisor = await API.graphql(
        graphqlOperation(mutations.updateClient, {
          input: {
            id: advisorId,
            ...assumptions,
          },
        })
      );

      console.log("--- UPDATED ASSUMPTIONS SUCCESS ----");
      console.log(advisor);
    } catch (e) {
      console.log("--- ERROR UPDATING ASSUMPTIONS ---");
      console.log(e);
    }
  };
};
