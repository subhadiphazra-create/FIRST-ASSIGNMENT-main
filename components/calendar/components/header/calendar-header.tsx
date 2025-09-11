"use client";

import {
  Columns,
  Grid3x3,
  List,
  Grid2x2,
  CalendarRange,
  SendHorizonal,
  SquareMenu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TCalendarView } from "../../types";
import { IEvent } from "../../interfaces";
import { TodayButton } from "./today-button";
import { DateNavigator } from "./date-navigator";
import { UserSelect } from "./user-select";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Batch } from "@/types/type";
import { PlanSelect } from "./plan-select";
import { useState } from "react";
import { DiscussionForum } from "@/components/main/discussion/DiscussionForum";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
  onChangeView: (view: TCalendarView) => void;
}

export function CalendarHeader({ view, events, onChangeView }: IProps) {
  const { batchId } = useParams();
  const batches = useSelector((state: RootState) => state.training.batches);

  const batch: Batch | undefined = batches.find((b) => b.batchId === batchId);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mt-3 w-full">
        <h2 className="text-md font-semibold flex items-center gap-3 ml-4">
          <SendHorizonal width={16} height={16} /> IKON Training -{" "}
          {batch?.batchTitle ?? "Unknown Batch"}
        </h2>
        <Button
          className="bg-transparent border mr-3 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-black"
          onClick={() => setIsSidebarOpen(true)}
        >
          <SquareMenu />
        </Button>
      </div>
      <hr className="h-2 w-full mt-4" />

      <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <TodayButton />
          <DateNavigator view={view} events={events} />
        </div>

        <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
          <div className="flex w-full items-center gap-1.5">
            {/* View switcher */}
            <div className="inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none">
              <Button
                aria-label="View by day"
                size="icon"
                variant={view === "day" ? "default" : "outline"}
                className="rounded-r-none [&_svg]:size-5"
                onClick={() => onChangeView("day")}
              >
                <List strokeWidth={1.8} />
              </Button>

              <Button
                aria-label="View by week"
                size="icon"
                variant={view === "week" ? "default" : "outline"}
                className="-ml-px rounded-none [&_svg]:size-5"
                onClick={() => onChangeView("week")}
              >
                <Columns strokeWidth={1.8} />
              </Button>

              <Button
                aria-label="View by month"
                size="icon"
                variant={view === "month" ? "default" : "outline"}
                className="-ml-px rounded-none [&_svg]:size-5"
                onClick={() => onChangeView("month")}
              >
                <Grid2x2 strokeWidth={1.8} />
              </Button>

              <Button
                aria-label="View by year"
                size="icon"
                variant={view === "year" ? "default" : "outline"}
                className="-ml-px rounded-none [&_svg]:size-5"
                onClick={() => onChangeView("year")}
              >
                <Grid3x3 strokeWidth={1.8} />
              </Button>

              <Button
                aria-label="View by agenda"
                size="icon"
                variant={view === "agenda" ? "default" : "outline"}
                className="-ml-px rounded-l-none [&_svg]:size-5"
                onClick={() => onChangeView("agenda")}
              >
                <CalendarRange strokeWidth={1.8} />
              </Button>
            </div>

            <UserSelect />
            <PlanSelect />
          </div>
        </div>
      </div>

      {/* ✅ Sidebar off-canvas */}
      <DiscussionForum open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
    </>
  );
}
