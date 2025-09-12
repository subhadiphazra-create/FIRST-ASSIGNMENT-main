// index.ts
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import trainingReducer from "./trainingSlice";
import themeReducer from "./themeSlice";
import eventsReducer from "./eventsSlice";
import plansReducer from "./plansSlice";
import assignmentsReducer from "./assignmentSlice";
import attendancesReducer from "./attendanceSlice";
import activityReducer from "./activitySlice";
import feedbackReducer from "./feedbackSlice";
import mentorFeedbackReducer from "./mentorFeedbacksSlice"; // ✅ fixed import name
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Root reducer
const rootReducer = combineReducers({
  training: trainingReducer,
  theme: themeReducer,
  events: eventsReducer,
  plans: plansReducer,
  assignments: assignmentsReducer,
  attendances: attendancesReducer,
  activity: activityReducer,
  feedback: feedbackReducer,
  mentorFeedback: mentorFeedbackReducer, // ✅ matches your slice
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "training",
    "theme",
    "events",
    "plans",
    "assignments",
    "attendances",
    "activity",
    "feedback",
    "mentorFeedback",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;