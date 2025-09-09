import {z} from "zod";

export const batchSchema = z
  .object({
    batchTitle: z.string().min(1, "Batch title is required"),
    companyId: z.string().min(1, "Company ID is required"),
    batchStatus: z.enum(["planned", "active", "completed"]),
    batchRegion: z.string().min(1, "Region is required"),
    batchStartDate: z.string().min(1, "Start date is required"),
    batchEndDate: z.string().min(1, "End date is required"),
    batchMentor: z.array(z.string()).min(1, "Select at least one mentor"),
    batchReviewer: z.array(z.string()).min(1, "Select at least one reviewer"),
    batchTrainer: z.array(z.string()).min(1, "Select at least one trainer"),
    batchTrainee: z.array(z.string()).min(1, "Select at least one trainee"),
    courseDescription: z.string().min(1, "Course description is required"),
    uploadDate: z.string(),
    batchId: z.string(),
  })
  .refine(
    (data) => new Date(data.batchStartDate) < new Date(data.batchEndDate),
    {
      message: "Start date must be earlier than end date",
      path: ["batchEndDate"], // attach error to `batchEndDate` field
    }
  );
