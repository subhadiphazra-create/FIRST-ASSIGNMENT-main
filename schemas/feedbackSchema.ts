import { z } from "zod";

// ✅ Feedback discussion schema
export const feedbackDiscussionSchema = z.object({
  id: z.string(),
  index: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  // make planId and batchId optional for now
  planId: z.string().optional(),
  batchId: z.string().optional(),
});

export type TFeedbackDiscussion = z.infer<typeof feedbackDiscussionSchema>;

// ✅ Feedback schema
export const feedbackSchema = z.object({
  feedbackId: z.string().uuid(),
  feedbackName: z.string().min(1, "Feedback name is required"),
  status: z.enum(["Active", "Inactive"]).default("Inactive"),

  // Optional details
  feedbackDetails: z
    .object({
      feedbackCategory: z.string().min(1, "Category is required"),
      feedbackSubCategory: z.string().min(1, "Sub-category is required"),
      highestMarks: z.number().optional(),
    })
    .optional(),

  // Assigned people
  traineeId: z.array(z.string()).default([]),
  trainerId: z.array(z.string()).default([]),

  // Discussions
  feedbackDiscussions: z.array(feedbackDiscussionSchema).optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TFeedbackForm = z.infer<typeof feedbackSchema>;
