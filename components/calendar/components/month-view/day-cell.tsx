import { useMemo } from "react";
import { isToday } from "date-fns";

import { cn } from "@/lib/utils";
import { ICalendarCell, IEvent } from "../../interfaces";
import { getMonthCellEvents } from "../../helpers";
import { DroppableDayCell } from "../dnd/droppable-day-cell";
import { MonthEventBadge } from "./month-event-badge";

interface IProps {
  cell: ICalendarCell;
  events: IEvent[];
  eventPositions: Record<string, number>;
}

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({ cell, events, eventPositions }: IProps) {
  const { day, currentMonth, date } = cell;

  const cellEvents = useMemo(
    () => getMonthCellEvents(date, events, eventPositions),
    [date, events, eventPositions]
  );

  const isSunday = date.getDay() === 0;

  return (
    <DroppableDayCell cell={cell}>
      <div
        className={cn(
          "flex h-[140px] flex-col gap-1 border-l border-t py-1.5 lg:py-2",
          isSunday && "border-l-0"
        )}
      >
        {/* Day number */}
        <span
          className={cn(
            "h-6 px-1 text-xs font-semibold lg:px-2",
            !currentMonth && "opacity-20",
            isToday(date) &&
              "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground"
          )}
        >
          {day}
        </span>

        {/* Holiday badge */}
        {cellEvents.length > 0 && cellEvents[0].isHoliday ? (
          <div className="px-2 py-1 m-auto text-xs font-semibold border w-fit rounded-sm text-red-400">
            {cellEvents[0].title}
          </div>
        ) : (
          /* Normal events */
          <div
            className={cn(
              "flex flex-col gap-1 px-1 lg:px-2",
              !currentMonth && "opacity-50"
            )}
          >
            {cellEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) => {
              if (!event || event.isHoliday) return null;
              return (
                <MonthEventBadge
                  key={event.id + event.dayOfEvent}
                  event={event}
                  cellDate={date}
                  className="w-full"
                />
              );
            })}
          </div>
        )}

        {/* More events indicator */}
        {cellEvents.length > MAX_VISIBLE_EVENTS &&
          !cellEvents[0]?.isHoliday && (
            <p
              className={cn(
                "px-1.5 text-xs font-semibold text-muted-foreground",
                !currentMonth && "opacity-50"
              )}
            >
              +{cellEvents.length - MAX_VISIBLE_EVENTS} more...
            </p>
          )}
      </div>
    </DroppableDayCell>
  );
}
