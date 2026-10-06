import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import filterReducer from "./slices/filterSlice";
import bookingReducer from "./slices/bookingSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      filters: filterReducer,
      booking: bookingReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
