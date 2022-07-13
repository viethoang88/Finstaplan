import { createSlice } from "@reduxjs/toolkit";
// import { Auth, API } from "aws-amplify";
// import * as mutations from "../src/graphql/mutations";
// import * as queries from "../src/graphql/queries";
// import * as subscriptions from "../src/graphql/subscriptions";

const initialState = {
  showNewClientModal: false,
  showNotesCallout: false,
  fetchingAdvisor: false,
  preassessmentStep: {
    step: undefined,
    message: undefined,
    preassessment: undefined,
  },
  justFetchedAdvisor: false,
  fetchingClient: false,
  justFetchedClient: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAttribute(state, _action) {
      const { attribute, newValue, newVal } = _action.payload;
      console.log("--- in setAttribute with ---");
      console.log(attribute);
      console.log(newVal);
      if (newVal !== undefined) {
        state[attribute] = newVal;
      }
      if (newValue !== undefined) {
        state[attribute] = newValue;
      }
    },
    fetchingAdvisor(state, _action) {
      const { fetchingAdvisor } = _action.payload;
      state.fetchingAdvisor = fetchingAdvisor;
    },
    justFetchedAdvisor(state, _action) {
      const { justFetchedAdvisor } = _action.payload;
      state.justFetchedAdvisor = justFetchedAdvisor;
    },
  },
});

export const uiSliceActions = uiSlice.actions;

export default uiSlice.reducer;
