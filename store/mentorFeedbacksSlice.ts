import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFeedbackForm, TFeedbackDiscussion } from "@/schemas/feedbackSchema";

interface FeedbackState {
  feedbacks: TFeedbackForm[];
}

const initialState: FeedbackState = {
  feedbacks: [],
};

const mentorFeedbackSlice = createSlice({
  name: "mentorFeedback",
  initialState,
  reducers: {
    addMentorFeedback: (state, action: PayloadAction<TFeedbackForm>) => {
      state.feedbacks.push({
        ...action.payload,
        traineeId: action.payload.traineeId ?? [],
        trainerId: action.payload.trainerId ?? [],
        feedbackDiscussions: action.payload.feedbackDiscussions ?? [],
        createdAt: action.payload.createdAt ?? new Date().toISOString(),
        updatedAt: action.payload.updatedAt ?? new Date().toISOString(),
      });
    },

    updateMentorFeedback: (
      state,
      action: PayloadAction<{
        feedbackId: string;
        data: Partial<TFeedbackForm>;
      }>
    ) => {
      const { feedbackId, data } = action.payload;
      const index = state.feedbacks.findIndex(
        (f) => f.feedbackId === feedbackId
      );
      if (index !== -1) {
        state.feedbacks[index] = {
          ...state.feedbacks[index],
          ...data,
          traineeId: data.traineeId ?? state.feedbacks[index].traineeId,
          trainerId: data.trainerId ?? state.feedbacks[index].trainerId,
          feedbackDiscussions:
            data.feedbackDiscussions ??
            state.feedbacks[index].feedbackDiscussions,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteMentorFeedback: (state, action: PayloadAction<string>) => {
      state.feedbacks = state.feedbacks.filter(
        (f) => f.feedbackId !== action.payload
      );
    },

    assignMentorsToFeedback: (
      state,
      action: PayloadAction<{
        feedbackId: string;
        traineeId: string[];
        trainerId: string[];
        planId: string;
        batchId: string;
      }>
    ) => {
      const { feedbackId, traineeId, trainerId, planId, batchId } =
        action.payload;
      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback) {
        feedback.planId = planId;
        feedback.batchId = batchId;
        feedback.traineeId = traineeId;
        feedback.trainerId = trainerId;
        feedback.updatedAt = new Date().toISOString();
      }
    },

    addFeedbackDiscussion: (
      state,
      action: PayloadAction<{
        feedbackId: string;
        discussion: TFeedbackDiscussion;
      }>
    ) => {
      const { feedbackId, discussion } = action.payload;
      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback) {
        feedback.feedbackDiscussions = feedback.feedbackDiscussions || [];
        feedback.feedbackDiscussions.push(discussion);
        feedback.updatedAt = new Date().toISOString();
      }
    },

    updateFeedbackDiscussion: (
      state,
      action: PayloadAction<{
        feedbackId: string;
        discussionId: string;
        data: Partial<TFeedbackDiscussion>;
      }>
    ) => {
      const { feedbackId, discussionId, data } = action.payload;
      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback && feedback.feedbackDiscussions) {
        const idx = feedback.feedbackDiscussions.findIndex(
          (d) => d.id === discussionId
        );
        if (idx !== -1) {
          feedback.feedbackDiscussions[idx] = {
            ...feedback.feedbackDiscussions[idx],
            ...data,
          };
          feedback.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteFeedbackDiscussion: (
      state,
      action: PayloadAction<{ feedbackId: string; discussionId: string }>
    ) => {
      const { feedbackId, discussionId } = action.payload;
      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback && feedback.feedbackDiscussions) {
        feedback.feedbackDiscussions = feedback.feedbackDiscussions.filter(
          (d) => d.id !== discussionId
        );
        feedback.updatedAt = new Date().toISOString();
      }
    },

    // ✅ Update trainee marks + remarks + highestMarks
    updateTraineeDiscussionScore: (
      state,
      action: PayloadAction<{
        feedbackId: string;
        discussionId: string;
        traineeId: string;
        obtainedMarks?: number | null;
        remarks?: string;
        highestMarks?: number | null;
      }>
    ) => {
      const {
        feedbackId,
        discussionId,
        traineeId,
        obtainedMarks,
        remarks,
        highestMarks,
      } = action.payload;

      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback && feedback.feedbackDiscussions) {
        const discussion = feedback.feedbackDiscussions.find(
          (d) => d.id === discussionId
        );
        if (discussion) {
          // ✅ Update highest marks if provided
          if (highestMarks !== undefined) {
            discussion.highestMarks = highestMarks;
          }

          discussion.traineeDiscussions = discussion.traineeDiscussions || [];
          const idx = discussion.traineeDiscussions.findIndex(
            (t) => t.traineeId === traineeId
          );

          if (idx !== -1) {
            discussion.traineeDiscussions[idx] = {
              ...discussion.traineeDiscussions[idx],
              obtainedMarks,
              remarks,
            };
          } else {
            discussion.traineeDiscussions.push({
              traineeId,
              obtainedMarks,
              remarks,
            });
          }

          feedback.updatedAt = new Date().toISOString();
        }
      }
    },
  },
});

export const {
  updateTraineeDiscussionScore,
  addMentorFeedback,
  updateMentorFeedback,
  deleteMentorFeedback,
  assignMentorsToFeedback,
  addFeedbackDiscussion,
  updateFeedbackDiscussion,
  deleteFeedbackDiscussion,
} = mentorFeedbackSlice.actions;

export default mentorFeedbackSlice.reducer;
