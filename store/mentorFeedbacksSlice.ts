import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFeedbackForm as OriginalTFeedbackForm } from "@/schemas/feedbackSchema";

export interface FeedbackDiscussion {
  id: string;
  index: number;
  category: string;
  subCategory: string;
}

// Extend TFeedbackForm to include feedbackDiscussions
export type TFeedbackForm = OriginalTFeedbackForm & {
  feedbackDiscussions?: FeedbackDiscussion[];
};

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
    // ➕ Add new feedback
    addMentorFeedback: (state, action: PayloadAction<TFeedbackForm>) => {
      state.feedbacks.push(action.payload);
    },

    // ✏️ Update existing feedback
    updateMentorFeedback: (
      state,
      action: PayloadAction<{ feedbackId: string; data: Partial<TFeedbackForm> }>
    ) => {
      const { feedbackId, data } = action.payload;
      const index = state.feedbacks.findIndex((f) => f.feedbackId === feedbackId);
      if (index !== -1) {
        state.feedbacks[index] = {
          ...state.feedbacks[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // 🗑️ Delete feedback
    deleteMentorFeedback: (state, action: PayloadAction<string>) => {
      state.feedbacks = state.feedbacks.filter(
        (f) => f.feedbackId !== action.payload
      );
    },

    // ➕ Add discussion to feedback
    addFeedbackDiscussion: (
      state,
      action: PayloadAction<{ feedbackId: string; discussion: FeedbackDiscussion }>
    ) => {
      const { feedbackId, discussion } = action.payload;
      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback) {
        if (!feedback.feedbackDiscussions) {
          (feedback as any).feedbackDiscussions = [];
        }
        (feedback as any).feedbackDiscussions.push(discussion);
        feedback.updatedAt = new Date().toISOString();
      }
    },

    // ✏️ Update discussion
    updateFeedbackDiscussion: (
      state,
      action: PayloadAction<{
        feedbackId: string;
        discussionId: string;
        data: Partial<FeedbackDiscussion>;
      }>
    ) => {
      const { feedbackId, discussionId, data } = action.payload;
      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback && (feedback as any).feedbackDiscussions) {
        const discussions = (feedback as any).feedbackDiscussions as FeedbackDiscussion[];
        const idx = discussions.findIndex((d) => d.id === discussionId);
        if (idx !== -1) {
          discussions[idx] = { ...discussions[idx], ...data };
          feedback.updatedAt = new Date().toISOString();
        }
      }
    },

    // 🗑️ Delete discussion
    deleteFeedbackDiscussion: (
      state,
      action: PayloadAction<{ feedbackId: string; discussionId: string }>
    ) => {
      const { feedbackId, discussionId } = action.payload;
      const feedback = state.feedbacks.find((f) => f.feedbackId === feedbackId);
      if (feedback && (feedback as any).feedbackDiscussions) {
        (feedback as any).feedbackDiscussions =
          (feedback as any).feedbackDiscussions.filter(
            (d: FeedbackDiscussion) => d.id !== discussionId
          );
        feedback.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addMentorFeedback,
  updateMentorFeedback,
  deleteMentorFeedback,
  addFeedbackDiscussion,
  updateFeedbackDiscussion,
  deleteFeedbackDiscussion,
} = mentorFeedbackSlice.actions;

export default mentorFeedbackSlice.reducer;
