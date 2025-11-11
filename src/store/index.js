import { configureStore } from "@reduxjs/toolkit";
import profilesReducer from "./profilesSlice";
import eventsReducer from "./eventsSlice";

const store = configureStore({
  reducer: {
    profiles: profilesReducer,
    events: eventsReducer,
  },
});

export default store;
