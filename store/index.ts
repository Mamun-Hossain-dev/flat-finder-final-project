import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
// import listingsSlice from './listingsSlice';
// import uiSlice from './uiSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    // listings: listingsSlice,
    // ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
