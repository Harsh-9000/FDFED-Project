import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { proprietorReducer } from "./reducers/proprietor";

const Store = configureStore({
  reducer: {
    user: userReducer,
    proprietor: proprietorReducer,
  },
});

export default Store;