import { z } from "zod";

export const planSchema = z.object({
  planTitle: z.string().min(2, "Plan title required"),
  planStartDate: z.string().min(1, "Start date is required"),
  color: z.enum(
    ["blue", "green", "red", "yellow", "purple", "orange", "gray"],
    { error: "Color is required" }
  ),
});

export type TPlanForm = z.infer<typeof planSchema>;
