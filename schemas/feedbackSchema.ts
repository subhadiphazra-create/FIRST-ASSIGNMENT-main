import { z } from "zod";

// ✅ Discussion schema
export const feedbackDiscussionSchema = z.object({
  id: z.string(),
  index: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  planId: z.string().optional(),
  batchId: z.string().optional(),
});

// ✅ Details schema
export const feedbackDetailsSchema = z.object({
  feedbackCategory: z.string().min(1, "Category is required"),
  feedbackSubCategory: z.string().min(1, "Sub-category is required"),
  highestMarks: z.number().optional(),
  obtainedMarks: z.number().optional(),
  remarks: z.string().optional(),
});

// ✅ Feedback form schema
export const feedbackSchema = z.object({
  feedbackId: z.string().uuid(),
  feedbackName: z.string().min(1, "Feedback name is required"),
  status: z.enum(["Active", "Inactive"]).default("Inactive"),

  traineeId: z.array(z.string()).default([]),
  trainerId: z.array(z.string()).default([]),

  planId: z.string().optional(),
  batchId: z.string().optional(),
  topicId: z.string().optional(),

  feedbackDetails: feedbackDetailsSchema.optional(),
  feedbackDiscussions: z.array(feedbackDiscussionSchema).optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

// ✅ Types
export type TFeedbackDiscussion = z.infer<typeof feedbackDiscussionSchema>;
export type TFeedbackDetails = z.infer<typeof feedbackDetailsSchema>;
export type TFeedbackForm = z.infer<typeof feedbackSchema>;
