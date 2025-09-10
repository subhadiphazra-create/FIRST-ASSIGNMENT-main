"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Attendance, TrainingPlan } from "@/types/type";
import { differenceInDays, format, parseISO } from "date-fns";

interface IProps {
  plan: TrainingPlan;
  trainees: string[];
  attendances: Attendance[];
  totalTrainees: number;
}

const formatDuration = (start: string, end: string) => {
  const days = differenceInDays(parseISO(end), parseISO(start)) + 1;
  if (days < 7) return `${days} days`;
  if (days < 30)
    return `${Math.floor(days / 7)} week${days / 7 > 1 ? "s" : ""}`;
  return `${Math.floor(days / 30)} month${days / 30 > 1 ? "s" : ""}`;
};

const AttandancePlanCard = ({
  plan,
  trainees,
  attendances,
  totalTrainees,
}: IProps) => {
  const sessionCount = plan.planTopics.length;
  const durationText = formatDuration(plan.planStartDate, plan.planEndDate);

  // 🔹 Compute plan status
  const now = new Date();
  const startDate = parseISO(plan.planStartDate);
  const endDate = parseISO(plan.planEndDate);

  let status: "Completed" | "Ongoing" | "Upcoming";
  if (endDate < now) {
    status = "Completed";
  } else if (startDate <= now && endDate >= now) {
    status = "Ongoing";
  } else {
    status = "Upcoming";
  }

  // 🔹 Attendance calculations
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLeave = 0;

  attendances.forEach((a) => {
    const traineeStatuses = Object.values(a.traineeList);

    totalPresent += traineeStatuses.filter((s) => s === "present").length;
    totalAbsent += traineeStatuses.filter((s) => s === "absent").length;
    totalLeave += traineeStatuses.filter((s) => s === "leave").length;
  });

  const totalSessions = attendances.length;
  const overallPossible = totalTrainees * totalSessions;

  const overallAttendanceRate =
    overallPossible > 0
      ? Math.round((totalPresent / overallPossible) * 100)
      : 0;

  return (
    <Card className="min-w-1/4 min-h-72 rounded-sm shadow-md">
      {/* Top Section */}
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col items-start">
          <h2 className="font-bold text-lg">{plan.planTitle}</h2>
          <p className="text-sm text-gray-500">
            {durationText} • {sessionCount} sessions
          </p>
        </div>
        <Badge
          variant={
            status === "Completed"
              ? "secondary"
              : status === "Ongoing"
              ? "default"
              : "outline"
          }
        >
          {status}
        </Badge>
      </CardHeader>

      {/* Middle Section */}
      <CardContent className="flex flex-col gap-2">
        {/* Trainees */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Enrolled Trainees</p>
          </div>
          <p className="text-sm font-medium">
            {trainees.length} trainee{trainees.length !== 1 && "s"}
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Attendance Rate</p>
          <p className="text-sm font-semibold">{overallAttendanceRate} %</p>
        </div>
      </CardContent>

      {/* Footer */}
      <div className="flex justify-between items-center border-t px-4 py-2 text-xs text-gray-500">
        <span>Period</span>
        <span>
          {format(plan.planStartDate, "d MMM yyyy")} →{" "}
          {format(plan.planEndDate, "d MMM yyyy")}
        </span>
      </div>
    </Card>
  );
};

export default AttandancePlanCard;
