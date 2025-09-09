import { z } from "zod";

export const eventSchema = z.object({
  user: z
    .string({ required_error: "Responsible person is required" })
    .min(1, "Responsible person is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  startTime: z.object(
    {
      hour: z.number(),
      minute: z.number(),
    },
    { required_error: "Start time is required" }
  ),
  endDate: z.date({ required_error: "End date is required" }),
  endTime: z.object(
    {
      hour: z.number(),
      minute: z.number(),
    },
    { required_error: "End time is required" }
  ),
  color: z.enum(
    ["blue", "green", "red", "yellow", "purple", "orange", "gray"],
    { required_error: "Color is required" }
  ),
});

export type TEventFormData = z.infer<typeof eventSchema>;

const isDate = (val: unknown): val is Date => val instanceof Date && !isNaN(val.getTime());

export const assignmentSchema = (topicStart?: Date, topicEnd?: Date) =>
  z
    .object({
      name: z.string().min(1, "Name is required"),
      status: z.enum(["Not Started", "In Progress", "Completed"]),
      trainerId: z.string().min(1, "Trainer is required"),
      planId: z.string().min(1, "Plan is required"),
      topicId: z.string().min(1, "Topic is required"),
      startDate: z.date({ required_error: "Start date is required" }),
      endDate: z.date({ required_error: "End date is required" }),
      resources: z.array(z.any()).optional(),
    })
    .refine(
      (data) => {
        if (!isDate(data.startDate) || !isDate(data.endDate)) return false;
        return data.endDate >= data.startDate;
      },
      { message: "End date must be after start date", path: ["endDate"] }
    )
    .refine(
      (data) => {
        if (!topicStart) return true;
        return isDate(data.startDate) && data.startDate >= topicStart;
      },
      {
        message: "Start date cannot be before the topic's first event date",
        path: ["startDate"],
      }
    )
    .refine(
      (data) => {
        if (!topicEnd) return true;
        return isDate(data.endDate) && data.endDate <= topicEnd;
      },
      {
        message: "End date cannot be after the topic's last event date",
        path: ["endDate"],
      }
    );

export type TAssignmentFormData = z.infer<ReturnType<typeof assignmentSchema>>;

export const attendanceSchema = z
  .object({
    planId: z.string().min(1, "Plan is required"),
    attendanceDate: z.date({ required_error: "Attendance date is required" }),
  })
  .refine(
    (data) => data.attendanceDate <= new Date(),
    {
      message: "Attendance date cannot be in the future",
      path: ["attendanceDate"],
    }
  );

export type TAttendanceFormData = z.infer<typeof attendanceSchema>;
