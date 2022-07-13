import { createSlice, createReducer, current } from "@reduxjs/toolkit";

/* Example usage:
 updateClientDataNested({ action: "UPDATE", path: ["insuranceInfo", "estatePlanning"], newValue: {
   primary: { questions },
   partner: { questionsPartner }
 }})
*/

export const LAST_FORM_STEP = 11;

export const emptyPartner = {
  firstName: "",
  lastName: "",
  gender: "",
  healthStatus: "",
  dateOfBirth: null,
  expenses: [],
  liabilities: [],
  assets: [],
  incomes: [],
};
export const emptyDependent = {
  firstName: "",
  lastName: "",
  legacyNominee: false,
  gender: "",
  healthStatus: "",
  dateOfBirth: null,
  relatedTo: null,
  expenses: [],
  liabilities: [],
  assets: [],
  incomes: [],
};

export const emptyAdvisor = {
  name: "",
  role: "",
  happyWith: "",
  canContact: "",
  email: "",
  phone: "",
};

export const initialState = {
  // advisorId:  null,
  formStep: 0,
  formSteps: [
    { id: 1, text: "Family", numSteps: 1, disabled: false, hidden: false },
    { id: 2, text: "Budget", numSteps: 1, disabled: false, hidden: false },
    {
      id: 3,
      text: "Balance Sheet",
      numSteps: 1,
      disabled: false,
      hidden: false,
    },
    {
      id: 4,
      text: "What's Important?",
      numSteps: 3,
      disabled: false,
      hidden: false,
    },
    { id: 5, text: "Goals", numSteps: 2 },
    {
      id: 6,
      text: "Risk Profile",
      numSteps: 1,
      disabled: false,
      hidden: false,
    },
    { id: 7, text: "Contingency", numSteps: 1, disabled: false, hidden: false },
    { id: 8, text: "Authorities", numSteps: 1, disabled: false, hidden: false },
    { id: 9, text: "Checklist", numSteps: 1, disabled: false, hidden: false },
  ],
  formStepMapper: null,
  hasPartner: false,
  hasDependents: false,
  hasChildren: false,
  hasJointDependents: false,
  hasPartnerDependents: false,
  // zipCode: 0,
  insuranceInfo: {
    estatePlanning: {},
    existingCover: [],
  },
  primary: {
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    relationshipStatus: "",
    gender: "",
    expenses: [],
    liabilities: [],
    assets: [],
    incomes: [],
    healthStatus: "",
  },
  joint: {
    expenses: [],
    liabilities: [],
    assets: [],
    incomes: [],
  },
  partner: {},
  advisors: [],
  dependents: [],
  children: [],
  partnerDependents: [],
  jointDependents: [],

  values: {
    selectedVals: [],
    topVals: [],
  },
  goals: [],
  riskProfile: {
    howToComplete: "joint",
  },
  riskProfileScores: undefined,
};

const compareAndMerge = (currentArr = [], newArr = [], matchOn = undefined) => {
  const merged = [...currentArr];
  for (let el of currentArr) {
    if (matchOn === undefined) {
      const idx = newArr.findIndex((next) => el.id === next.id);
      if (idx === -1) merged.push({ ...newArr[idx] });
    } else {
      const idx = newArr.findIndex((next) => el[matchOn] === next[matchOn]);
      if (idx === -1) merged.push({ ...newArr[idx] });
    }
  }
  return merged;
};

// Not deleting deleted items:
const compareAndMergeObjects = (
  currentArr = [],
  newArr = [],
  matchOn = undefined
) => {
  if (newArr === undefined || newArr?.length === 0) return currentArr;

  return [
    ...currentArr.map((next) => {
      if (matchOn === undefined) {
        const idx = newArr.findIndex((newNext) => newNext.id === next.id);
        if (idx === -1) return next;
        // else return { ...next, ...newArr[idx] };
        else return { ...newArr[idx], ...next };
      } else {
        const idx = newArr.findIndex(
          (next) => newArr?.[idx]?.[matchOn] === next[matchOn]
        );
        if (idx === -1) return next;
        // else return { ...next, ...newArr[idx] };
        else return { ...newArr[idx], ...next };
        // else return {...newNext, ...newArr[idx]};
      }
    }),
    ...newArr.filter((newObj) => {
      if (matchOn === undefined) {
        return (
          currentArr.findIndex((currObj) => currObj.id === newObj.id) === -1
        );
      } else {
        return (
          currentArr.findIndex(
            (currObj) => currObj[matchOn] === newObj[matchOn]
          ) === -1
        );
      }
    }),
  ];
};

// firstName: string;
// lastName: string;
// dateOfBirth: Date;
// relationShipStatus: RelationshipStatus;
// contactDetails: ContactDetails;
// dependents: boolean;
// dependentsInfo: Object; // how many, dependent, non-dependent
// otherAdvisers: boolean;
// numOtherAdvisers: number;
// otherAdviserDetails: Object; // { name, role, happy, permission to contact (yes/no), email, telephone }
// existingStructure: [string];

const factFindSlice = createSlice({
  name: "fact-find",
  initialState,
  reducers: {
    updateGoalPrioritiesAndAssignedPortfolio(state, _action) {
      const { assignments, goals } = _action.payload;
      const newGoals = [...goals]; //[...state.factFind?.["goals"]];
      for (let [assignedPortfolio, assignedGoals] of Object.entries(
        assignments
      )) {
        let priority = 1;
        for (let assignedGoal of assignedGoals) {
          const updateIndex = newGoals.findIndex(
            (goal) => goal.goal === assignedGoal.content
          );
          if (updateIndex !== -1) {
            const newGoal = {
              ...newGoals[updateIndex],
              priority,
              assignedPortfolio,
            };
            newGoals[updateIndex] = newGoal;
            priority++;
          }
        }
      }
      console.log("-----NEWLY ASSIGNED GOALS LOL-----");
      console.log(newGoals);
      state["goals"] = newGoals;
    },
    reset(state) {
      console.log("--- RESETTING ---");
      console.log(JSON.parse(JSON.stringify(initialState)));
      state = JSON.parse(JSON.stringify(initialState));
    },

    setState(state, _action) {
      console.log("RECEIVING PAYLOAD");
      console.log(_action);
      console.log(_action.payload);
      return { ...state, ..._action.payload };
    },
    // updateMultipleFields(state, _action) {

    // },
    updateStatePropertyArrayById(state, _action) {
      const { id, property, newValue } = _action.payload;
      //const updatedState = [...state[property]];
      //const updateIndex = updatedState.findIndex((el) => el.id === id);
      //updatedState[updateIndex] = newValue;
      const updatedState = state?.[property]?.map((item) => {
        if (item.id === id) {
          console.log("WE HAVE A MATCH");
          return newValue;
        }
        return item;
      });

      console.log(updatedState);

      state[property] = updatedState;
    },
    compareAndUpdateArray(state, _action) {
      const { newValue, property, matchOn } = _action.payload;
      if (state[property] === undefined) {
        state[property] = [];
      }
      const currentState = [...state[property]];
      if (currentState === undefined || currentState.length === 0) {
        state[property] = newValue;
      } else {
        // const newState = compareAndMerge(currentState, newValue);
        const newState = compareAndMergeObjects(
          currentState,
          newValue,
          matchOn
        );
        state[property] = newState;
      }
    },
    updateNestedClientDataArray(state, _action) {
      // arrayKeyIndex in ["expenses", "assets", "liabilities", "incomes"]
      const { arrayKeyIndex, data, action } = _action.payload;

      if (action === "PUSH_MULTIPLE_BY_INDEX") {
        // belongsTo and idx are used to access key and array index if nested...
        for (let {
          type,
          parentType,
          label,
          value,
          frequency,
          //division,
          //notes,
          icon,
          bucket,
          belongsTo,
          idx,
        } of data) {
          const newItem = {
            type,
            parentType,
            label,
            value,
            frequency,
            //division,
            //notes,
            icon,
            bucket,
            id: `${belongsTo}-${type}-${value}-${frequency}`,
          };
          if (idx !== "null" && idx !== undefined && idx) {
            if (!state[belongsTo][idx][arrayKeyIndex]) {
              state[belongsTo][idx][arrayKeyIndex] = [];
            }
            console.log("--- ABOUT TO PUSH ---");
            state[belongsTo][idx][arrayKeyIndex].push(newItem);
          } else {
            console.log("XXX HERE WE GOOOOO XXX");
            console.log(arrayKeyIndex);
            console.log(current(state[belongsTo]));
            if (!state[belongsTo][arrayKeyIndex]) {
              console.log("------ SHOULD BE IN HERE ----");
              state[belongsTo][arrayKeyIndex] = [];
            }
            console.log("--- ABOUT TO PUSH 2 ---");
            state[belongsTo][arrayKeyIndex].push(newItem);
          }
        }
      }
    },
    updatePerson(state, _action) {
      const { idx, person, action, key } = _action.payload;
      console.log("--- UPDATING PERSON ----");
      console.log(person);

      if (action === "REMOVE_DEPENDENT") {
        state[key] = state[key].filter((person, index) => {
          return idx !== index;
        });
      } else if (action === "ADD_PARTNER") {
        state[key] = person;
      } else if (action === "ADD_ADVISOR") {
        state[key].push({ ...emptyAdvisor });
      } else if (action === "ADD_DEPENDENT") {
        state[key].push(person);
      } else if (action === "UPDATE_DEPENDENT") {
        const newPerson = { ...state[key][idx], ...person };
        state[key][idx] = newPerson;
      } else if (action === "UPDATE_CLIENT" || action === "UPDATE_PARTNER") {
        const newPerson = { ...state[key], ...person };
        state[key] = newPerson;
      }
    },
    addDependents(state, _action) {
      const { action, key, dependents } = _action.payload;
      if (state.dependents.length === 0) {
      }
      state[key] = dependents;
    },
    updateState(state, _action) {
      return { ...state, ..._action.payload };
    },
    updateClientData(state, action) {
      if (action.payload.action === "SET") {
        state[action.payload.key] = action.payload.newVal;
      } else {
        state.primary = { ...state.primary, ...action.payload };
      }
    },
    updateClientDataNestedObject(state, _action) {
      console.log("--- attempting to update authorities ---");
      const { newValue, path } = _action.payload;
      const [key, index, property] = path;

      if (state[key] === undefined) state[key] = {};

      if (path.length === 2) {
        // OLD:
        // if (state[key][index] === undefined) {
        //   state[key][index] = {};
        // }
        // state[key][index] = { ...state[key][index], ...newValue };

        if (state[key][index] === undefined) {
          return {
            ...state,
            [key]: {
              ...state[key],
              [index]: { ...newValue },
            },
          };
        }

        return {
          ...state,
          [key]: {
            ...state[key],
            [index]: { ...state[key][index], ...newValue },
          },
        };
      } else if (path.length === 3) {
        // OLD:
        // if (state[key][index][property] === undefined) {
        //   state[key][index][property] = {};
        // }
        // state[key][index][property] = {
        //   ...state[key][index][property],
        //   ...newValue,
        // };
        if (state[key][index][property] === undefined) {
          return {
            ...state,
            [key]: {
              ...state[key],
              [index]: {
                ...state[key][index],
                [property]: { ...newValue },
              },
            },
          };
        }

        return {
          ...state,
          [key]: {
            ...state[key],
            [index]: {
              ...state[key][index],
              [property]: { ...state[key][property], ...newValue },
            },
          },
        };
      }
    },
    updateClientDataNested(state, _action) {
      const { newValue, action, path } = _action.payload;
      const [key, index, property] = path;

      if (state[key] === undefined) state[key] = {};

      if (path.length === 2) {
        if (action === "UPDATE") {
          state[key][index] = newValue;
        } else if (action === "UPDATE_NESTED_OBJECT") {
          const newData = { ...state[key] };
          newData[index] = newValue;
          state[key] = newData;
        } else if (action === "UPDATE_OBJECT_AT_INDEX") {
          const newObj = { ...state[key][index], ...newValue };
          state[key][index] = newObj;
        }
      }

      if (path.length == 3) {
        if (action === "PUSH") {
          state[key].push(newValue);
        } else if (action === "UPDATE") {
          state[key][index][property] = newValue;
        }
      }
    },
    nextStep(state) {
      if (state.formStep < LAST_FORM_STEP) {
        state.formStep++;
      }
    },
    prevStep(state) {
      if (state.formStep > 0) {
        state.formStep--;
      }
    },
  },
});

export const factFindActions = factFindSlice.actions;

export default factFindSlice.reducer;
