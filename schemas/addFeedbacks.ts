import { z } from "zod";

export const traineeDiscussionSchema = z.object({
  traineeId: z.string(),
  obtainedMarks: z.number().nullable().optional(),
  remarks: z.string().optional(),
});

export const feedbackDiscussionSchema = z.object({
  id: z.string(),
  category: z.string(),
  subCategory: z.string(),
  highestMarks: z
    .number({ invalid_type_error: "Highest marks must be a number" })
    .min(0, "Highest marks required"),
  traineeDiscussions: z.array(traineeDiscussionSchema).optional(),
});

export const feedbackFormSchema = z.object({
  feedbackId: z.string().min(1, "Feedback is required"),
  feedbackName: z.string(),
  trainerId: z.array(z.string()),
  traineeId: z.array(z.string()).optional(),
  planId: z.string().optional(),
  batchId: z.string().optional(),
  feedbackDiscussions: z.array(feedbackDiscussionSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TTraineeDiscussion = z.infer<typeof traineeDiscussionSchema>;
export type TFeedbackDiscussion = z.infer<typeof feedbackDiscussionSchema>;
export type TFeedbackForm = z.infer<typeof feedbackFormSchema>;
export type TFeedbackFormValues = z.infer<typeof feedbackFormSchema>;
