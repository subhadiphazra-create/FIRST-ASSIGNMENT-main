import { z } from "zod";

export const topicSchema = z.object({
  topicTitle: z.string().min(2, "Title is required"),
  topicDescription: z.string().min(5, "Description too short"),
  topicDurationValue: z.coerce
    .number({ invalid_type_error: "Duration value required" })
    .min(1, "Minimum 1")
    .max(365, "Too large"),
  topicDuration: z.enum(["days", "weeks", "months"]),
  topicResources: z.any().optional(),
});

export type TTopicForm = z.infer<typeof topicSchema>;
