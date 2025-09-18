"use client";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { IEvent } from "../../interfaces";
import { useCalendar } from "../../contexts/calendar-context";
import { DraggableEvent } from "../dnd/draggable-event";
import { EventDetailsDialog } from "../dialogs/event-details-dialog";
import { Eye } from "lucide-react";
import { findPlanNameById } from "@/lib/findPlanNameById";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface IProps {
  event: IEvent;
  cellDate: Date;
  className?: string;
}

export function MonthEventBadge({ event, cellDate, className }: IProps) {
  const plans = useSelector((state: RootState) => state.plans.plans);

  const colorMap: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600",
    green:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600",
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600",
    yellow:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600",
    purple:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600",
    orange:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600",
    gray: "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600",
  };

  const colorClass = colorMap[event.color] ?? colorMap.blue;

  const planName = findPlanNameById(event.planId, plans);

  return (
    <DraggableEvent event={event}>
      <EventDetailsDialog event={event}>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md border px-2 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            colorClass,
            className
          )}
        >
          <div className="flex flex-col flex-1 overflow-hidden">
            <p className="truncate font-bold">{planName}</p>
            <p className="truncate font-medium">{event.title}</p>
          </div>

          <Eye
            size={14}
            className="text-primary cursor-pointer hover:scale-110 transition"
          />
        </div>
      </EventDetailsDialog>
    </DraggableEvent>
  );
}
