import { configureStore } from "@reduxjs/toolkit";
//import rootReducer from "./reducers/index";
import factFindReducer from "./fact-find";
import authReducer from "./auth";
import uiReducer from "./ui";

const store = configureStore({
  reducer: { factFind: factFindReducer, auth: authReducer, ui: uiReducer },
});

export default store;
