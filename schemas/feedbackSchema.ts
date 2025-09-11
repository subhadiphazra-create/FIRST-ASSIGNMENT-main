import { z } from "zod";

export const feedbackSchema = z.object({
  feedbackId: z.string().uuid(),
  feedbackName: z.string().min(1, "Feedback name is required"),
  planId: z.string().min(1, "Plan is required"),
  batchId: z.string().min(1, "Batch is required"),
  topicId: z.string().min(1, "Topic is required"),
  traineeId: z.array(z.string()).min(1, "At least one trainee is required"),
  trainerId: z.array(z.string()).min(1, "At least one trainer is required"),
  highestMarks: z.number().min(1, "Marks must be greater than 0"), // moved outside feedbackDetails
  feedbackDetails: z
    .object({
      feedbackCategory: z.string().min(1, "Category is required"),
      feedbackSubCategory: z.string().min(1, "Sub-category is required"),
    })
    .optional(), // now optional
  updatedAt: z.string(),
  createdAt: z.string(),
});

export type TFeedbackForm = z.infer<typeof feedbackSchema>;