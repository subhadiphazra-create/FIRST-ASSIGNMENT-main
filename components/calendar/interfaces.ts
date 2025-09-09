import { TrainingPlan } from "@/types/type";
import { TEventColor } from "./types";

export interface IAssignment {
  id: string;
  name: string;
  status: "Completed" | "In Progress" | "Not Started";
  startDate: string;
  endDate: string;
  planId: string;
  topicId: string;
  trainerId: string;
  createdAt: string;
  updatedAt: string;
  resources?: IResource[];
}

export interface IResource {
  resorceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: string;
  resourceUrl: string;
}

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}

export interface IEvent {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  user: IUser;
  startTime?: string;
  endTime?: string;
  plan?: TrainingPlan;
  planId: string;
  topicId: string;
  isHoliday?: boolean;
  dayOfEvent?: string;
  position?: number;
  isMultiDay?: boolean;
}