"use client";

import { FeedBack } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeedbackState {
  feedbacks: FeedBack[];
}

const initialState: FeedbackState = {
  feedbacks: [],
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    // Add a single feedback
    addFeedback: (state, action: PayloadAction<FeedBack>) => {
      state.feedbacks.push(action.payload);
    },

    // Update a feedback by feedbackId
    updateFeedback: (state, action: PayloadAction<FeedBack>) => {
      state.feedbacks = state.feedbacks.map((f) =>
        f.feedbackId === action.payload.feedbackId ? action.payload : f
      );
    },

    // Remove feedback by feedbackId
    removeFeedback: (state, action: PayloadAction<string>) => {
      state.feedbacks = state.feedbacks.filter(
        (f) => f.feedbackId !== action.payload
      );
    },

    // Replace all feedbacks
    setFeedbacks: (state, action: PayloadAction<FeedBack[]>) => {
      state.feedbacks = action.payload;
    },

    // Add multiple feedbacks at once
    addFeedbacks: (state, action: PayloadAction<FeedBack[]>) => {
      state.feedbacks.push(...action.payload);
    },
  },
});

export const {
  addFeedback,
  updateFeedback,
  removeFeedback,
  setFeedbacks,
  addFeedbacks,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
