import { addDays, format } from "date-fns";
import { TrainingPlan } from "@/types/type";
import { HOLIDAY_DATES } from "@/constants";
import { findNameById } from "./employeeUtils";
import { IEvent } from "@/components/calendar/interfaces";

function getDayType(date: Date): "holiday" | "sunday" | "saturday" | "working" {
  const day = date.getDay();
  const dateStr = date.toISOString().split("T")[0];

  if (day === 0) return "sunday";
  if (day === 6) return "saturday";
  if (HOLIDAY_DATES.includes(dateStr)) return "holiday";
  return "working";
}

export function expandPlanToEvents(plan: TrainingPlan): IEvent[] {
  let currentDate = new Date(plan.planStartDate);
  const events: IEvent[] = [];

  for (const topic of plan.planTopics) {
    const durationDays =
      topic.topicDuration === "days"
        ? topic.topicDurationValue
        : topic.topicDuration === "weeks"
        ? topic.topicDurationValue * 7
        : topic.topicDurationValue * 30;

    let added = 0;
    while (added < durationDays) {
      if (getDayType(currentDate) === "working") {
        const dayISO = format(currentDate, "yyyy-MM-dd");

        events.push({
          id: `${plan.planId}-${topic.topicId}-${dayISO}`,
          title: topic.topicTitle,
          startDate: `${dayISO}T09:30:00.000Z`,
          endDate: `${dayISO}T18:30:00.000Z`,
          color: plan.color || "blue",
          user: { id: plan.user, name: findNameById(plan.user), picturePath: "" },

          // linking back
          planId: plan.planId,
          topicId: topic.topicId,
          startTime: plan.planStartTime,
          endTime: plan.planEndTime,

          // me
          isHoliday: false,
          dayOfEvent: dayISO,
          position: 0,
          isMultiDay: false,
        });

        added++;
      }
      currentDate = addDays(currentDate, 1);
    }
  }

  return events;
}
