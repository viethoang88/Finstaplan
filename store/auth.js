import { v4 as uuidv4 } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { setAssumptions } from "./auth/portfolios";
import * as mutations from "../src/graphql/mutations";
import * as queries from "../src/graphql/queries";
import * as subscriptions from "../src/graphql/subscriptions";
import {
  portfolios,
  defaultBands,
  returnPercents,
} from "./defaults/default-assumptions";
import {
  cashFlow,
  contingency,
  investment,
  defaultStatusAllocs,
} from "../dummy_data/benchmarking_profile";
import { factFindActions } from "./fact-find";
import { uiSliceActions } from "./ui";
import { testData } from "../components/advisor/dummy_variables";
const { assumptions, philosophies, benchmarking } = testData;
import { extractAllocationsByType } from "../components/advisor/licensee-allocation";
import { cssColor } from "@fluentui/react";
import { calculateInvestmentDelta } from "../pages/api/calculations/benchmarking";
// export const getlicenseeAllocations = () => {
//   return (dispatch) => {

//   }
// }

// export const create = (id) => {
//   return async (dispatch, getState) => {
//     const currentState = getState().example;
//     console.log(currentState);
//   };
// };
const convertAllDependents = (converterFn, clientData) => {
  const _clientData = { ...clientData };
  const children = clientData?.children && [...clientData.children];
  const dependents = clientData?.dependents && [...clientData.dependents];
  const jointDependents = clientData?.jointDependents && [
    ...clientData.jointDependents,
  ];
  const partnerDependents = clientData?.partnerDependents && [
    ...clientData.partnerDependents,
  ];
  const newChildren =
    children?.map((person) => ({
      ...person,
      uiData: converterFn(person?.uiData || {}),
    })) || [];
  const newDependents =
    dependents?.map((person) => ({
      ...person,
      uiData: converterFn(person?.uiData || {}),
    })) || [];
  const newJointDependents =
    jointDependents?.map((person) => ({
      ...person,
      uiData: converterFn(person?.uiData || {}),
    })) || [];
  const newPartnerDependents =
    partnerDependents?.map((person) => ({
      ...person,
      uiData: converterFn(person?.uiData || {}),
    })) || [];
  _clientData["children"] = newChildren;
  _clientData["dependents"] = newDependents;
  _clientData["jointDependents"] = newJointDependents;
  _clientData["partnerDependents"] = newPartnerDependents;
  return _clientData;
};

export const convertClientDataFromDb = (clientData) => {
  const _clientData = convertAllDependents(JSON.parse, clientData);
  console.log("---- FINE 1 ----");
  _clientData["primary"]["uiData"] = JSON.parse(
    clientData.primary?.uiData || "{}"
  );
  console.log("---- FINE 2 ----");

  _clientData["partner"]["uiData"] = JSON.parse(
    clientData.partner?.uiData || "{}"
  );
  console.log("---- FINE 3 ----");

  _clientData["primary"]["authorities"] = JSON.parse(
    clientData.primary?.authorities || "[]"
  );
  console.log("---- FINE 4 ----");

  _clientData["partner"]["authorities"] = JSON.parse(
    clientData.partner?.authorities || "[]"
  );
  console.log("---- FINE 5 ----");

  _clientData["primary"]["whyMoney"] = JSON.parse(
    clientData.primary?.whyMoney || "{}"
  );
  console.log("---- FINE 6 ----");

  _clientData["partner"]["whyMoney"] = JSON.parse(
    clientData.partner?.whyMoney || "{}"
  );
  console.log("---- FINE 7 ----");

  _clientData["authoritiesData"] = JSON.parse(
    clientData?.authoritiesData || "{}"
  );
  console.log("---- FINE 8 ----");

  _clientData["goals"] = JSON.parse(_clientData?.goals || []);
  console.log("---- FINE 9 ----");

  _clientData["values"] = JSON.parse(
    _clientData?.values || `{"selectedVals":[],"topVals":[]}`
  );
  console.log("---- FINE 10 ----");

  _clientData["insuranceInfo"] = JSON.parse(
    _clientData?.insuranceInfo || `{"existingCover":[],"estatePlanning":{}}`
  );
  console.log("---- FINE 11 ----");

  _clientData["riskProfile"] = JSON.parse(
    _clientData?.riskProfile || `{"howToComplete":"joint"}`
  );
  console.log("---- FINE 12 ----");

  _clientData["riskProfileScores"] = JSON.parse(
    _clientData?.riskProfileScores || "{}"
  );
  console.log("---- FINE 13 ----");

  if (_clientData?.healthInfo !== undefined) {
    _clientData["healthInfo"] = JSON.parse(
      _clientData?.healthInfo || `{"primary":{}}`
    );
  }
  console.log("---- FINE 14 ----");

  if (_clientData?.advisors !== undefined) {
    _clientData["advisors"] = JSON.parse(_clientData?.advisors || "[]");
  }
  console.log("---- FINE 15 ----");

  if (_clientData?.existingStructures !== undefined) {
    _clientData["existingStructures"] = JSON.parse(
      _clientData?.existingStructures || "[]"
    );
  }

  // TODO: is attached to primary and partner now
  //_clientData["whyMoney"] = JSON.parse(_clientData?.whyMoney);
  //_clientData["formSteps"] = JSON.parse(_clientData?.formSteps);

  return _clientData;
};

export const convertClientDataToDb = (advisorId, clientData) => {
  const uuid = clientData.id === undefined ? uuidv4() : clientData.id;

  // TODO: Convert date to moment ?
  const newClientData = convertAllDependents(JSON.stringify, clientData);
  const _clientData = { id: uuid, advisorID: advisorId, ...newClientData };

  // TODO: this is a problem:
  const primaryUiData = { ...clientData.primary.uiData };
  const partnerUiData = { ...clientData.partner.uiData };
  const primaryUiDataString = JSON.stringify(primaryUiData);
  const partnerUiDataString = JSON.stringify(partnerUiData);

  _clientData["primary"] = {
    ..._clientData["primary"],
    whyMoney: JSON.stringify(_clientData["primary"]?.["whyMoney"] || {}),
    authorities: JSON.stringify(_clientData["primary"]?.["authorities"] || {}),
    uiData: primaryUiDataString,
  };
  _clientData["partner"] = {
    ..._clientData["partner"],
    whyMoney: JSON.stringify(_clientData["partner"]?.["whyMoney"] || {}),
    authorities: JSON.stringify(_clientData["partner"]?.["authorities"] || {}),
    uiData: partnerUiDataString,
  };
  _clientData["goals"] = JSON.stringify(_clientData?.goals || []);
  _clientData["values"] = JSON.stringify(_clientData?.values || {});
  _clientData["insuranceInfo"] = JSON.stringify(
    _clientData?.insuranceInfo || {}
  );
  _clientData["riskProfile"] = JSON.stringify(_clientData?.riskProfile || {});
  _clientData["riskProfileScores"] = JSON.stringify(
    _clientData?.riskProfileScores || {}
  );
  _clientData["advisors"] = JSON.stringify(_clientData?.advisors || []);
  _clientData["authoritiesData"] = JSON.stringify(
    _clientData?.authoritiesData || []
  );
  _clientData["healthInfo"] = JSON.stringify(_clientData?.healthInfo || {});

  _clientData["existingStructures"] = JSON.stringify(
    _clientData?.existingStructures || []
  );

  // TODO: DECIDE WHICH PARTS OF THESE I NEED TO STORE: definitely one of them...
  delete _clientData["formStep"];
  delete _clientData["formSteps"];
  delete _clientData["formStepMapper"];

  delete _clientData["uiData"];
  delete _clientData["advisor"];
  delete _clientData["createdAt"];
  delete _clientData["updatedAt"];

  return _clientData;
};

export const updateLaAndPortfolioGrowth = (newPortfolios) => {
  return async (dispatch, getState) => {
    const currentState = getState().auth;
    const returnPercents = currentState.returnPercents;
    const portfolios = currentState.portfolios;
    const pf = calculateExpectedGrowths(portfolios, returnPercents);
    const la = extractAllocationsByType(portfolios, returnPercents);
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "portfolios",
        newVal: pf,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "licenseeAllocations",
        newVal: la,
      })
    );
  };
};

export const updatePortfolioGrowth = (_class, newValue) => {
  return async (dispatch, getState) => {
    const currentState = getState().auth;
    const retPercent = { ...currentState.returnPercents };
    retPercent[_class] = newValue;
    const pf = calculateExpectedGrowths(currentState.portfolios, retPercent);
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "portfolios",
        newVal: pf,
      })
    );
  };
};

const calculateExpectedGrowths = (portfolios, returnPercents) => {
  const _portfolios = [];
  for (let i = 0; i < portfolios.length; i++) {
    const portfolio = { ...portfolios[i] };
    portfolio.expectedGrowth =
      (portfolio.allocations["Cash"] * returnPercents["Cash"] +
        portfolio.allocations["Domestic Fixed Interest"] *
          returnPercents["Domestic Fixed Interest"] +
        portfolio.allocations["International Fixed Interest"] *
          returnPercents["International Fixed Interest"] +
        portfolio.allocations["Domestic Property"] *
          returnPercents["Domestic Property"] +
        portfolio.allocations["International Property"] *
          returnPercents["International Property"] +
        portfolio.allocations["Alternative"] *
          returnPercents["International Property"] +
        portfolio.allocations["Domestic Equity"] *
          returnPercents["Domestic Equity"] +
        portfolio.allocations["International Equity"] *
          returnPercents["International Equity"]) /
      100;
    _portfolios.push(portfolio);
  }
  return _portfolios;
};

const buildAllocationsObject = (allocations, pfName) => {
  return allocations.reduce((acc, next) => {
    return { ...acc, [next.assetClass]: next[pfName] };
  }, {});
};

export const setLaAndUpdatePortfolios =
  (newAllocations) => (dispatch, getState) => {
    const { portfolios, fixedBands } = getState().auth;
    const newReturnPercents = newAllocations.reduce((acc, next) => {
      return { ...acc, [next.assetClass]: next.returnPercent };
    }, {});

    const _portfolios = [...portfolios];
    for (let i = 0; i < _portfolios.length; i++) {
      _portfolios[i] = { ...portfolios[i] };
      _portfolios[i].allocations = buildAllocationsObject(
        newAllocations,
        _portfolios[i].portfolioName
      );
    }

    const pf = calculateExpectedGrowths(_portfolios, newReturnPercents);
    const gvd = recomputeGrowthVsD(newAllocations, _portfolios);
    const newFb = recomputeFixedBands(_portfolios, fixedBands, newAllocations);
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "licenseeAllocations",
        newVal: newAllocations,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "portfolios",
        newVal: pf,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "fixedBands",
        newVal: newFb,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "growthVsDefensive",
        newVal: gvd,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "returnPercents",
        newVal: newReturnPercents,
      })
    );
  };

export const updateAllPortfolioReliantData = (_portfolios) => {
  return (dispatch, getState) => {
    const { returnPercents, fixedBands } = getState().auth;
    const allocations = extractAllocationsByType(_portfolios, returnPercents);
    const gvd = recomputeGrowthVsD(allocations, _portfolios);
    const newFb = recomputeFixedBands(_portfolios, fixedBands, allocations);

    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "licenseeAllocations",
        newVal: allocations,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "fixedBands",
        newVal: newFb,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "growthVsDefensive",
        newVal: gvd,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "returnPercents",
        newVal: returnPercents,
      })
    );
  };
};

const initialSetter = () => {};

export const fetchData = (toFetch = undefined) => {
  return async (dispatch, getState) => {
    /*
    email: String!
    assumptions: AWSJSON
    philosophies: AWSJSON
    firstName: String
    lastName: String
    */
    // const advisorId = getState().auth.sub;
    // const advisor = await API.graphql(
    //   graphqlOperation(queries.getAdvisor, {
    //     input: {
    //       id: advisorId,
    //     },
    //   })
    // );

    // console.log("---- advisor IN FETCH DATA ----");
    // console.log(advisor);
    const { fetchingAdvisor } = getState().ui;
    if (fetchingAdvisor) return;

    // Benchmarking related stuff:
    const benchmarkingProfile = { cashFlow, contingency, investment };
    console.log(benchmarkingProfile);
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "benchmarkingProfile",
        newVal: benchmarkingProfile,
      })
    );
    defaultStatusAllocs;
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "benchmarkingWeightings",
        newVal: defaultStatusAllocs,
      })
    );

    // Assumptions, Philosophies
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "assumptions",
        newVal: assumptions,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "philosophies",
        newVal: philosophies,
      })
    );

    // Portfolios, allocations, growth vs defensive, return percents:
    const allocations = extractAllocationsByType(portfolios, returnPercents);
    const gvd = recomputeGrowthVsD(allocations, portfolios);
    const pf = calculateExpectedGrowths(portfolios, returnPercents);

    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "portfolios",
        newVal: pf,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "licenseeAllocations",
        newVal: allocations,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "fixedBands",
        newVal: defaultBands,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "growthVsDefensive",
        newVal: gvd,
      })
    );
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "returnPercents",
        newVal: returnPercents,
      })
    );
  };
};

export const updateLaChanged = () => {
  return (dispatch, getState) => {
    const {
      portfolios,
      licenseeAllocations,
      growthVsDefensive,
      lastChangedLa,
    } = getState().auth;

    console.log(portfolios);
    console.log(licenseeAllocations);
    console.log(lastChangedLa);
    console.log(growthVsDefensive);

    const newGvd = recomputeGrowthVsD(
      licenseeAllocations,
      portfolios,
      lastChangedLa,
      "update"
    );

    const newLa = recomputeLicenseeAllocations(
      portfolios,
      licenseeAllocations,
      lastChangedLa
    );

    // // Update growthVsDefensive
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        key: "growthVsDefensive",
        newVal: newGvd,
      })
    );
    // // Update licenseeAllocations
    // dispatch(
    //   authSliceActions.updateClientData({
    //     key: "licenseeAllocations",
    //     newVal: newLa,
    //   })
    // );
  };
};

export const updatePfChanged = () => {
  return (dispatch, getState) => {
    const {
      portfolios,
      fixedBands,
      licenseeAllocations,
      growthVsDefensive,
      lastChangedPf,
    } = getState().auth;

    const action = lastChangedPf.update_action;
    console.log(lastChangedPf);
    console.log(portfolios);
    console.log(fixedBands);
    console.log(licenseeAllocations);
    console.log(growthVsDefensive);

    const newGvd = recomputeGrowthVsD(
      licenseeAllocations,
      portfolios,
      lastChangedLa,
      "delete"
    );

    const newLa = recomputeLicenseeAllocations(
      portfolios,
      allocations,
      lastChangedPf
    );

    // // Update growthVsDefensive
    // dispatch(
    //   authSliceActions.updateClientData({
    //  action: "UPDATE",
    //     key: "growthVsDefensive",
    //     newVal: newGvd,
    //   })
    // );
    // // Update fixedBands
    // dispatch(
    //   authSliceActions.updateClientData({
    //  action: "UPDATE",
    //     key: "fixedBands",
    //     newVal: newFb,
    //   })
    // );
    // // Update licenseeAllocations
    // dispatch(
    //   authSliceActions.updateClientData({
    //  action: "UPDATE",
    //     key: "licenseeAllocations",
    //     newVal: newLa,
    //   })
    // );
  };
};

const recomputePortfolios = (allocations = []) => {
  console.log("IN RCPF");
  console.log(portfolios);
  console.log(allocations);
};

const recomputeLicenseeAllocations = (
  portfolios = [],
  allocations = [],
  lastChangedLa = undefined
) => {
  if (portfolios === undefined || allocations === undefined) return undefined;
  console.log(portfolios);
  console.log(allocations);
  console.log(lastChangedLa);
  const updateAction = lastChangedLa.updateAction;
  console.log(updateAction);
  if (updateAction === "delete_one") {
  } else if (updateAction === "delete_multiple") {
  }
};

const recomputeFixedBands = (
  portfolios = [],
  fixedBands = [],
  allocations = []
) => {
  // if (portfolios === undefined || allocations === undefined) return undefined;
  let low = 0;
  let high = 25;
  const max = 100;

  console.log("IN RCFB");
  console.log(portfolios, fixedBands, allocations);

  return portfolios.map((pf, idx) => {
    const newFb = {
      id: String(idx),
      portfolio: pf.portfolioName,
      low: low,
      high: high,
    };
    low = high;
    high += 20;
    if (high >= max) high = max;
    return newFb;
  });
};

const defensiveClasses = [
  "Cash",
  "Domestic Fixed Interest",
  "International Fixed Interest",
];
const growthClasses = [
  "Domestic Property",
  "International Property",
  "Alternative",
  "Domestic Equity",
  "International Equity",
];
const recomputeGrowthVsD = (
  allocations = [],
  portfolios = [],
  action,
  updateAction
) => {
  if (portfolios === undefined || allocations === undefined) return undefined;
  const defensive = { id: "1", assetClass: "Defensive" };
  const growth = { id: "2", assetClass: "Growth" };
  const pfNames = portfolios.map((pf) => pf.portfolioName);
  pfNames.forEach((key) => {
    defensive[key] = 0;
    growth[key] = 0;
  });
  allocations.forEach((allocation) => {
    if (defensiveClasses.includes(allocation.assetClass)) {
      for (let pfName of pfNames) {
        defensive[pfName] += allocation[pfName];
      }
    } else if (growthClasses.includes(allocation.assetClass)) {
      for (let pfName of pfNames) {
        growth[pfName] += allocation[pfName];
      }
    }
  });
  console.log(defensive);
  console.log(growth);
  return [defensive, growth];
};

const defensiveVsGrowth = [
  {
    id: "1",
    assetClass: "Defensive",
    highGrowth: 10,
    growth: 16.5,
    modGrowth: 31.6,
    modConservative: 41.5,
    conservative: 59.2,
    cash: 100,
  },
  {
    id: "2",
    assetClass: "Growth",
    highGrowth: 90,
    growth: 83.5,
    modGrowth: 68.4,
    modConservative: 58.5,
    conservative: 40.8,
    cash: 0.0,
  },
];

export const initialState = {
  cognitoUser: null,
  activeClient: undefined,
  sub: null,
  dealerGroupId: null,
  enterpriseId: null,
  assumptions: [],
  philosophies: {},
  licenseeAllocations: undefined,
  portfolios: undefined,
  fixedBands: undefined,
  benchmarkingProfile: undefined,
  clients: undefined,
  underwriters: undefined,
  funds: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetMultipleProps(state, action) {
      return { ...state, ...action.payload };
    },
    login(state, _action) {
      state.user = _action.payload.user;
      return state;
    },
    loginCognito(state, _action) {
      state.cognitoUser = _action.payload.cognitoUser;
      return state;
    },
    logout(state, _action) {
      state = initialState;
      return state;
    },
    setAttribute(state, _action) {
      state[_action.payload.attribute] = _action.payload.value;
    },
    setAttributes(state, _action) {
      const attributes = _action.payload;
      console.log(attributes);
      for (let [k, v] of Object.entries(attributes)) {
        state[k] = v;
      }
      return state;
    },
    log(state, _action) {
      console.log(_action.payload);
      return state;
    },
    updateClientData(state, action) {
      if (action.payload.key === "licenseeAllocations") {
        state.lastChangedLa = action.payload;
      }
      if (action.payload.key === "portfolios") {
        state.lastChangedPf = action.payload;
      }
      if (action.payload.action === "SET") {
        state[action.payload.key] = action.payload.newVal;
      } else {
        state.primary = { ...state.primary, ...action.payload };
      }
      return state;
    },
    updateClientDataNested(state, _action) {
      const { newValue, action, path } = _action.payload;
      const [key, index, property, propertyTwo] = path;

      if (path.length === 2) {
        if (state[key] === undefined) state[key] = {};

        if (action === "UPDATE") {
          state[key][index] = newValue;
        } else if (action === "UPDATE_NESTED_OBJECT") {
          const newData = { ...state[key] };
          newData[index] = newValue;
          state[key] = newData;
        }
      }

      if (path.length === 3) {
        if (action === "PUSH") {
          state[key].push(newValue);
        } else if (action === "UPDATE") {
          state[key][index][property] = newValue;
        }
      }

      if (path.length === 4) {
        if (action === "PUSH") {
        } else if (action === "UPDATE") {
          state[key][index][property][propertyTwo] = newValue;
        }
      }

      return state;
    },
  },
});

export const asyncLogout = () => {
  return async (dispatch) => {
    await Auth.signOut();
    dispatch(authSliceActions.logout());
  };
};

export const asyncLogin =
  ({ email, password }) =>
  async (dispatch) => {
    console.log("---- FROM asyncLogin ----");
    console.log(email, password);
    try {
      const cognitoUser = await Auth.signIn(email, password);
      console.log(cognitoUser);

      dispatch(
        authSliceActions.setAttributes({
          sub: cognitoUser.attributes.sub,
          // email: cognitoUser.attributes.email,
          // cognitoUser: cognitoUser,
        })
      );
      dispatch(
        authSliceActions.updateClientDataNested({
          newValue: cognitoUser.attributes.email,
          path: ["advisorProfile", "email"],
          action: "UPDATE_NESTED_OBJECT",
        })
      );

      dispatch(
        getAdvisor({
          sub: cognitoUser.attributes.sub,
          email: cognitoUser.attributes.email,
        })
      );
    } catch (e) {
      console.log("error logging in");
      console.log(e);
    }
  };

export const createAdvisor = async (email, sub) => {
  try {
    console.log("ADVISOR DOESN'T EXIST, creating advisor...", email, sub);
    const advisorDetails = {
      email,
      id: sub,
    };

    const advisor = await API.graphql(
      graphqlOperation(mutations.createAdvisor, { input: advisorDetails })
    );

    // const advisor = await API.graphql({
    //   query: mutations.createAdvisor,
    //   variables: { input: advisorDetails },
    // });

    // data.createAdvisor.clients.items
    // data.createAdvisor.email, .id, .createdAt, .updatedAt, etc..
    console.log("----ADVISOR CREATED-----");
    console.log(advisor);

    // dispatch(authSliceActions.log({ newAdvisor }));
    dispatch(
      authSliceActions.setAttributes({
        clients: advisor.createAdvisor.clients.items,
      })
    );
    return advisor;
  } catch (e) {
    console.log("FAILED TO CREATE ADVISOR");
    console.log(e);
    return undefined;
  }
};

export const getAdvisor = ({ email, sub }) => {
  return async (dispatch) => {
    console.log("---- FROM getAdvisor ---");
    console.log(email);
    console.log(sub);
    dispatch(uiSliceActions.fetchingAdvisor({ fetchingAdvisor: true }));
    let advisor;

    try {
      advisor = await API.graphql({
        query: queries.getAdvisor,
        variables: { id: sub },
      }); //as Promise<ListAdvisorResult>);
      // => {"data": { "getAdvisor": "items": [...]}}
      console.log("ADVISOR EXISTS");
      console.log(advisor);

      const advisorData = {};
      advisorData["advisorProfile"] =
        advisor.data?.getAdvisor?.["advisorProfile"];
      for (let key of [
        "assumptions",
        "philosophies",
        "portfolios",
        "licenseeAllocations",
        "fixedBands",
        "benchmarkingProfile",
        "benchmarkingWeightings",
        "underwriters",
        "funds",
      ]) {
        const data = advisor.data.getAdvisor?.[key];
        if (data) {
          if (
            key === "assumptions" &&
            (data === undefined || data?.length === 0)
          ) {
            // console.log("--- NOT OVERWRITING ASSUMPTIONS ---");
            continue;
          } else if (
            key === "philosophies" &&
            (data === undefined || Object.keys(data).length === 0)
          ) {
            // console.log("--- NOT OVERWRITING PHILOSOPHIES ---");
            continue;
          } else {
            // console.log(`--- IN HERE WITH ${key} ----`);
            // console.log(data);
            advisorData[key] = JSON.parse(data || {});
          }
        }
      }
      console.log("--- SETTING ADVISOR DATA ---");
      console.log(advisorData);
      dispatch(authSliceActions.resetMultipleProps(advisorData));
      dispatch(uiSliceActions.fetchingAdvisor({ fetchingAdvisor: false }));

      dispatch(uiSliceActions.justFetchedAdvisor({ justFetchedAdvisor: true }));
      setTimeout(() => {
        dispatch(
          uiSliceActions.justFetchedAdvisor({ justFetchedAdvisor: false })
        );
      }, 5000);

      // const assumptions = advisor.data.getAdvisor?.assumptions;
      // const philosophies = advisor.data.getAdvisor?.philosophies;
      // const underwriters = advisor.data.getAdvisor?.underwriters;

      // assumptions &&
      //   dispatch(
      //     authSliceActions.setAttribute({
      //       attribute: "assumptions",
      //       value: assumptions,
      //     })
      //   );

      // philosophies &&
      //   dispatch(
      //     authSliceActions.setAttribute({
      //       attribute: "philosophies",
      //       value: philosophies,
      //     })
      //   );

      // underwriters &&
      //   dispatch(
      //     authSliceActions.setAttribute({
      //       attribute: "philosophies",
      //       value: philosophies,
      //     })
      //   );
    } catch (e) {
      dispatch(uiSliceActions.fetchingAdvisor({ fetchingAdvisor: false }));
      console.log("FAILED", e);
      advisor = createAdvisor(email, sub);
      console.log(advisor);
    }

    // try {
    //   if (!advisor.data.getAdvisor) {
    //     const newAdvisor = createAdvisor(email, sub);
    //     console.log("second attempt");
    //     console.log(newAdvisor);
    //   } else {
    //     // dispatch...
    //   }
    // } catch (e) {
    //   console.log("FAILED");
    // }
  };
};

export const getClientsSummary = () => {
  return async (dispatch, getState) => {
    const authState = getState().auth;
    const sub = authState.sub;
    if (sub === null) return;
    const clients = await API.graphql(
      graphqlOperation(
        `query ListClients(
          $filter: ModelClientFilterInput
          $limit: Int
          $nextToken: String
        ) {
          listClients(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
              id
              primary {
                firstName
                lastName
                dateOfBirth
              }
              partner {
                firstName
                dateOfBirth
              }
              updatedAt
            }
         }
      }`,
        { advisorID: sub }
      )
    );
    console.log(clients);
    dispatch(
      authSliceActions.setAttribute({
        attribute: "clients",
        value: clients.data.listClients.items,
      })
    );
  };
};

export const getClientSetActive = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      uiSliceActions.setAttribute({
        attribute: "fetchingClient",
        newVal: true,
      })
    );
    try {
      const client = await API.graphql(
        graphqlOperation(queries.getClient, { id: id })
      );
      console.log(client);
      console.log(client.data.getClient);
      try {
        const clientData = convertClientDataFromDb(client.data.getClient);
        console.log(clientData);
        dispatch(factFindActions.setState(clientData));
        dispatch(
          uiSliceActions.setAttribute({
            attribute: "fetchingClient",
            newVal: false,
          })
        );
        dispatch(
          uiSliceActions.setAttribute({
            attribute: "justFetchedClient",
            newVal: true,
          })
        );
        setTimeout(() => {
          dispatch(
            uiSliceActions.setAttribute({
              attribute: "justFetchedClient",
              newVal: false,
            })
          );
        }, 5000);
      } catch (e) {
        console.log("--- ERROR CONVERTING CLIENT FROM JSON ---");
        console.log(e);
        dispatch(
          uiSliceActions.setAttribute({
            attribute: "fetchingClient",
            newVal: false,
          })
        );
      }
    } catch (e) {
      console.log("ERROR FETCHING CLIENT");
      console.log(e);
      dispatch(
        uiSliceActions.setAttribute({
          attribute: "fetchingClient",
          newVal: false,
        })
      );
    }
  };
};

export const getClients = () => {
  return async (dispatch, getState) => {
    const authState = getState().auth;
    const sub = authState.sub;
    if (sub === null) return;
    const clients = await API.graphql(
      graphqlOperation(queries.listClients, { advisorID: sub })
      // graphqlOperation(queries.listClients)
    );
    console.log(clients);
    dispatch(
      authSliceActions.setAttribute({
        attribute: "clients",
        value: clients.data.listClients.items,
      })
    );
  };
};
//"Variable 'goals' has an invalid value. Unable to parse [] as valid JSON.";
// goals: AWSJSON;
// values: AWSJSON;
// insuranceInfo: AWSJSON;
// riskProfile: AWSJSON;
// advisors: AWSJSON;
//"Variable 'uiData' has an invalid value. Unable to parse {gender=male, height=68, name=man, src=/assets/images/6-man.svg, type=adult, role=parent, width=62} as valid JSON."
export const createNewClientAsyncPromise = (
  advisorId,
  clientData,
  id = undefined
) => {
  return new Promise((res, rej) => {
    const _clientData = convertClientDataToDb(advisorId, {
      id: id,
      ...clientData,
    });

    API.graphql(
      graphqlOperation(mutations.createClient, {
        input: _clientData,
      })
    )
      .then((client) => {
        console.log("client created success");
        console.log(client);
        res(true);
      })
      .catch((e) => {
        console.log("CREATE CLIENT FAILED");
        console.log(e);
        res(false);
      });
  });
};

export const createNewClientAsync = async (
  advisorId,
  clientData,
  id = undefined
) => {
  try {
    const _clientData = convertClientDataToDb(advisorId, {
      id: id,
      ...clientData,
    });

    const client = await API.graphql(
      graphqlOperation(mutations.createClient, {
        input: _clientData,
      })
    );
    console.log("client created success");
    console.log(client);
    return true;
  } catch (e) {
    console.log("CREATE CLIENT FAILED");
    console.log(e);
    // updateExistingClient(_clientData);
    return false;
  }
};

export const createNewClient = (advisorId, clientData, id = undefined) => {
  return async (dispatch, getState) => {
    console.log("----- HELLO FROM CREATE NEW CLIENT -----");
    try {
      const _clientData = convertClientDataToDb(advisorId, {
        id: id,
        ...clientData,
      });

      console.log("---- CREATING NEW CLIENT USING THIS DATA ----");
      console.log(_clientData);

      const client = await API.graphql(
        graphqlOperation(mutations.createClient, {
          input: _clientData,
        })
      );
      console.log("client created success");
      console.log(client);
    } catch (e) {
      console.log("CREATE CLIENT FAILED");
      console.log(e);
      // updateExistingClient(_clientData);
    }
  };
};

export const updateExistingClient = (clientId, clientData) => {
  return async (dispatch, getState) => {
    const advisorId = getState().auth.sub;
    const clientDataForDb = convertClientDataToDb(advisorId, clientData);
    try {
      const client = await API.graphql(
        graphqlOperation(mutations.updateClient, {
          input: { id: clientId, advisorID: advisorId, ...clientDataForDb },
        })
      );
      console.log(client);
      console.log("--- CLIENT UPDATE SUCCESS ---");
    } catch (e) {
      console.log("--- UPDATE CLIENT FAILED WITH INPUTS: ---");
      console.log({ id: clientId, advisorID: advisorId, ...clientDataForDb });
      console.log(e);
    }
  };
};

const _updateSectionHelper = async (
  clientId,
  advisorId,
  clientDataForDb,
  firstKey,
  secondKey
) => {
  try {
    const escapedClientData = clientDataForDb.replaceAll('"', '\\"');
    const query = `
      mutation updateClient(
        $input: UpdateClientInput!
        $condition: ModelClientConditionInput
      ) {
        updateClient(
          $input: UpdateClientInput!
          $condition: $condition
        ){
            id
            ${firstKey} {
              firstName
              lastName
              ${secondKey}
            }
        }
      }
    `;

    // const client = await API.graphql(
    //   graphqlOperation(mutations.updateClient, {
    //     input: { id: clientId, advisorID: advisorId, ...clientDataForDb },
    //   })
    // );

    const client = await API.graphql(
      graphqlOperation(query, {
        input: {
          id: clientId,
          advisorID: advisorId,
          [firstKey]: {
            [secondKey]: clientDataForDb,
          },
        },
      })
    );

    // TODO: Convert client from store rep to DB rep:
    console.log(client);
    console.log("--- CLIENT UPDATE SUCCESS ---");
    return client;
  } catch (e) {
    console.log("--- UPDATE CLIENT FAILED WITH INPUTS: ---");
    console.log(e);
    return e;
  }
};

export const updateExistingClientSection = (
  clientId,
  clientData,
  path,
  alternate = "{}"
) => {
  return async (dispatch, getState) => {
    const advisorId = getState().auth.sub;
    console.log(clientId, advisorId, path);
    console.log(typeof path === "array");
    console.log(path.length === 2);

    if (typeof path === "object") {
      if (path.length === 1) {
        console.log("---- LOOOOOOK -------");
        console.log(clientData);
        console.log(clientData[path[0]]);
        console.log(JSON.stringify(clientData?.[path[0]] || "[]"));

        const _clientData = { ...clientData };
        _clientData[path[0]] = JSON.stringify(
          _clientData?.[path[0]] || alternate
        );

        try {
          const client = await API.graphql(
            graphqlOperation(mutations.updateClient, {
              input: {
                id: clientId,
                advisorID: advisorId,
                [path[0]]: _clientData[path[0]],
              },
            })
          );

          // TODO: Convert client from store rep to DB rep:
          console.log(client);
          console.log("--- CLIENT UPDATE SUCCESS ---");
          return client;
        } catch (e) {
          console.log("--- UPDATE CLIENT FAILED WITH INPUTS: ---");
          console.log(e);
          return e;
        }
      }
    }
    if (path.length === 2) {
      const [firstKey, secondKey] = path;

      const _clientData = { ...clientData };
      _clientData[firstKey][secondKey] = JSON.stringify(
        _clientData?.[firstKey]?.[secondKey] || alternate
      );

      //   _updateSectionHelper(
      //     clientId,
      //     advisorId,
      //     JSON.stringify(clientData[firstKey][secondKey] || alternate),
      //     firstKey,
      //     secondKey
      //   );

      // "The variables input contains a field name 'primary' that is not defined for input object type 'PrimaryInput' "
      try {
        const client = await API.graphql(
          graphqlOperation(mutations.updateClient, {
            input: {
              id: clientId,
              advisorID: advisorId,
              [firstKey]: {
                ..._clientData[firstKey],
              },
            },
          })
        );

        // TODO: Convert client from store rep to DB rep:
        console.log(client);
        console.log("--- CLIENT UPDATE SUCCESS ---");
        return client;
      } catch (e) {
        console.log("--- UPDATE CLIENT FAILED WITH INPUTS: ---");
        console.log(e);
        return e;
      }
    }
  };
};

export const deleteExistingClient = (clientId) => {
  return async (dispatch, getState) => {
    try {
      const res = await API.graphql(
        graphqlOperation(mutations.deleteClient, {
          input: { id: clientId },
        })
      );
      console.log(res);
      const clients = getState().auth.clients;
      const newClients = clients.filter((client) => client.id !== clientId);
      dispatch(
        authSliceActions.setAttribute({
          attribute: "clients",
          value: newClients,
        })
      );
      console.log("DELETE CLIENT SUCCEEDED");
    } catch (e) {
      console.log("DELETE CLIENT FAILED");
    }
  };
};

export const authSliceActions = authSlice.actions;

export default authSlice.reducer;

// uiData: AWSJSON
// employmentDetails: AWSJSON
// contactDetails: AWSJSON
// existingStructuresAndAdvisors: AWSJSON
// whyMoney: AWSJSON
// healthInfo: AWSJSON
// primary {
//   uiData: AWSJSON
// }
// partner {
//   uiData: AWSJSON
// }
