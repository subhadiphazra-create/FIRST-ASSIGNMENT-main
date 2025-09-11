"use client";

import { Activity } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface ActivityState {
  activities: Activity[];
}

const initialState: ActivityState = {
  activities: [],
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<Activity, "activityId"> & { activityId?: string }>) => {
      const newActivity: Activity = {
        ...action.payload,
        activityId: action.payload.activityId || uuidv4(), // auto-generate ID if not provided
      };
      state.activities.unshift(newActivity); // add to top
    },

    updateActivity: (state, action: PayloadAction<Activity>) => {
      state.activities = state.activities.map((a) =>
        a.activityId === action.payload.activityId ? action.payload : a
      );
    },

    removeActivity: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter(
        (a) => a.activityId !== action.payload
      );
    },

    clearActivities: (state) => {
      state.activities = [];
    },
  },
});

export const { addActivity, updateActivity, removeActivity, clearActivities } =
  activitySlice.actions;
export default activitySlice.reducer;
