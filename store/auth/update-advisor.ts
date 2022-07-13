import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../../src/graphql/mutations";

// type Advisor @auth(rules: [{ allow: owner, ownerField: "id" }]) @model {
//     id: ID!
//     clients: [AdvisorClient] @connection(keyName: "byId", fields: ["id"])
//     email: String!
//     logo: String
//     profilePicture: String
//     assumptions: AWSJSON
//     philosophies: AWSJSON
//     portfolios: AWSJSON
//     firstName: String
//     lastName: String
//     underwriters: AWSJSON
//   }
const convertAdvisorDataToDb = (advisorId, advisorData) => {
  const {
    advisorProfile,
    assumptions,
    philosophies,
    portfolios,
    licenseeAllocations,
    fixedBands,
    benchmarkingProfile,
    benchmarkingWeightings,
    underwriters,
    funds,
  } = advisorData;
  return {
    advisorProfile,
    assumptions: JSON.stringify(assumptions),
    portfolios: JSON.stringify(portfolios),
    licenseeAllocations: JSON.stringify(licenseeAllocations),
    fixedBands: JSON.stringify(fixedBands),
    philosophies: JSON.stringify(philosophies),
    benchmarkingProfile: JSON.stringify(benchmarkingProfile),
    benchmarkingWeightings: JSON.stringify(benchmarkingWeightings),
    underwriters: JSON.stringify(underwriters),
    funds: JSON.stringify(funds),
  };
};

export const updateExistingAdvisor = (advisorId, advisorData) => {
  return async (dispatch, getState) => {
    const advisorId = getState().auth.sub;
    const advisorDataForDb = convertAdvisorDataToDb(advisorId, advisorData);
    try {
      const advisor = await API.graphql(
        graphqlOperation(mutations.updateAdvisor, {
          input: { id: advisorId, ...advisorDataForDb },
        })
      );
      // TODO: Convert client from store rep to DB rep:
      console.log(advisor);
      console.log("--- ADVISOR UPDATE SUCCESS ---");
    } catch (e) {
      console.log("--- UPDATE ADVISOR FAILED WITH INPUTS: ---");
      console.log({ id: advisorId, ...advisorDataForDb });
      console.log(e);
    }
  };
};

export const updateExistingAdvisorProperty = (
  advisorId,
  propertyData,
  property
) => {
  return async (dispatch, getState) => {
    if (propertyData === undefined) return;
    if (
      typeof propertyData === "object" &&
      Object.keys(propertyData).length === 0
    )
      return;
    let updateData = propertyData;
    const advisorId = getState().auth.sub;
    const philosophies = getState().auth.philosophies;
    const assumptions = getState().auth.assumptions;
    const justFetchedAdvisor = getState().ui.justFetchedAdvisor;
    if (justFetchedAdvisor) {
      console.log("--- JUST FETCHED ADVISOR SO NOT UPDATING ----");
      console.log(philosophies);
      console.log(assumptions);
      return;
    }
    try {
      if (
        [
          "assumptions",
          "philosophies",
          "portfolios",
          "licenseeAllocations",
          "fixedBands",
          "benchmarkingProfile",
          "benchmarkingWeightings",
          "underwriters",
          "funds",
        ].includes(property)
      ) {
        updateData = JSON.stringify(updateData);
      }
      console.log(`--- UPDATING ADVISOR PROPERTY: ${property} with ---`);
      console.log({ id: advisorId, [property]: updateData });
      const advisor = await API.graphql(
        graphqlOperation(mutations.updateAdvisor, {
          input: { id: advisorId, [property]: updateData },
        })
      );
      // TODO: Convert client from store rep to DB rep:
      console.log(advisor);
      console.log("--- ADVISOR UPDATE SUCCESS ---");
    } catch (e) {
      console.log("--- UPDATE ADVISOR FAILED WITH INPUTS: ---");
      console.log({ id: advisorId, [property]: updateData });
      console.log(e);
    }
  };
};
