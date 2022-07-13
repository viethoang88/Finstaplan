import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../../src/graphql/mutations";

/*
type Primary implements Person {
  firstName: String
  lastName: String
  dateOfBirth: String
  gender: String
  expenses: [Expense]
  liabilities: [Liability]
  assets: [Asset]
  incomes: [Income]
  healthStatus: String
  relationshipStatus: String
  uiData: AWSJSON
  employmentDetails: AWSJSON
  contactDetails: AWSJSON
  existingStructuresAndAdvisors: AWSJSON
  employed: Boolean
  jobTitle: String
  jobIndustry: String
  employmentStatus: String
  employerName: String
  employmentStartDate: String
  desiredRetirementAge: Int
  email: String
  mobile: String
  streetAddress: String
  streetAddress2: String
  city: String
  state: String
  zipCode: String
  existingStructures: [String]
  wants: [String]
  whyMoney: AWSJSON
  healthInfo: AWSJSON
  authorities: AWSJSON
}
*/
const JSON_ITEMS = [
  "uiData",
  // "employmentDetails",
  "contactDetails",
  "existingStructuresAndAdvisors",
  "whyMoney",
  "healthInfo",
  "authorities",
];

const convertPersonForDb = (personData) => {
  if (personData === undefined) return;
  const convertedPerson = { ...personData };
  convertedPerson["whyMoney"] = JSON.stringify(personData.whyMoney || {});
  convertedPerson["authorities"] = JSON.stringify(personData.authorities || {});
  convertedPerson["uiData"] = JSON.stringify(personData.uiData || {});
  convertedPerson["healthInfo"] = JSON.stringify(personData.healthInfo || {});
  convertedPerson["existingStructuresAndAdvisors"] = JSON.stringify(
    personData.existingStructuresAndAdvisors || {}
  );
  convertedPerson["contactDetails"] = JSON.stringify(
    personData.contactDetails || {}
  );
  // convertedPerson["employmentDetails"] = JSON.stringify(
  //   personData.employmentDetails || {}
  // );
  return convertedPerson;
};

const convertDependentsForDb = (dependentsArray) => {
  const dependents = [...dependentsArray].map((dep) => {
    return { ...dep, uiData: JSON.stringify(dep["uiData"] || {}) };
  });
  return dependents;
};

/*
type Client @auth(rules: [{ allow: owner, ownerField: "advisorID" }]) @model {
  id: ID!
  advisorID: ID!
  advisor: Advisor @connection(fields: ["advisorID"])
  hasPartner: Boolean
  hasDependents: Boolean
  hasChildren: Boolean
  hasJointDependents: Boolean
  hasPartnerDependents: Boolean
  goals: AWSJSON
  values: AWSJSON
  insuranceInfo: AWSJSON
  riskProfile: AWSJSON
  riskProfileScores: AWSJSON
  primary: Primary
  partner: Primary
  joint: Joint
  advisors: AWSJSON
  children: [Dependent]
  dependents: [Dependent]
  partnerDependents: [Dependent]
  jointDependents: [Dependent]
  authoritiesData: AWSJSON
  healthInfo: AWSJSON
  existingStructureDetails: AWSJSON
}*/
export const updateExistingClientProperty = (
  clientId,
  propertyData,
  property
) => {
  return async (dispatch, getState) => {
    if (propertyData === undefined) return;
    if (clientId === undefined) return;
    let updateData = propertyData;
    //   const advisorId = getState().auth.sub;
    const justFetchedClient = getState().ui.justFetchedClient;
    const fetchingClient = getState().ui.fetchingClient;
    if (justFetchedClient) {
      console.log("--- JUST FETCHED SO NOT UPDATING ----");
      return;
    }
    if (fetchingClient) {
      console.log("--- FETCHING CLIENT SO NOT UPDATING ---");
      return;
    }
    try {
      if (
        [
          "values",
          "goals",
          "insuranceInfo",
          "riskProfile",
          "riskProfileScores",
          "otherAdvisors", //"advisors",
          "authoritiesData",
          "healthInfo",
          "existingStructureDetails",
        ].includes(property)
      ) {
        updateData = JSON.stringify(updateData);
      }
      console.log(`--- UPDATING CLIENT PROPERTY: ${property} with ---`);

      if (property === "primary" || property === "partner") {
        updateData = convertPersonForDb(propertyData);
      }
      if (
        property === "children" ||
        property === "dependents" ||
        property === "jointDependents" ||
        property === "partnerDependents"
      ) {
        updateData = convertDependentsForDb(propertyData);
      }

      console.log({ id: clientId, [property]: updateData });
      const client = await API.graphql(
        graphqlOperation(mutations.updateClient, {
          input: { id: clientId, [property]: updateData },
        })
      );
      // TODO: Convert client from store rep to DB rep:
      console.log(client);
      console.log("--- CLIENT UPDATE SUCCESS ---");
    } catch (e) {
      console.log("--- UPDATE CLIENTR FAILED WITH INPUTS: ---");
      console.log({ id: clientId, [property]: updateData });
      console.log(e);
    }
  };
};

export const updateExistingClientProperties = (clientId, propertiesData) => {
  return async (dispatch, getState) => {
    if (clientId === undefined) return;
    if (propertiesData === undefined) return;
    const justFetchedClient = getState().ui.justFetchedClient;
    const fetchingClient = getState().ui.fetchingClient;
    if (justFetchedClient) {
      console.log("--- JUST FETCHED SO NOT UPDATING ----");
      return;
    }
    if (fetchingClient) {
      console.log("--- FETCHING CLIENT SO NOT UPDATING ---");
      return;
    }
    try {
      console.log(`--- UPDATING CLIENT PROPERTIES with ---`);
      console.log({ id: clientId, ...propertiesData });
      const client = await API.graphql(
        graphqlOperation(mutations.updateClient, {
          input: { id: clientId, ...propertiesData },
        })
      );
      console.log(client);
      console.log("--- UPDATE CLIENT PROPERTIES FAILED WITH INPUTS: ---");
      // TODO: Convert client from store rep to DB rep:
    } catch (e) {
      console.log("--- UPDATE CLIENT FAILED WITH INPUTS: ---");
      console.log({ id: clientId, ...propertiesData });
      console.log(e);
    }
  };
};
