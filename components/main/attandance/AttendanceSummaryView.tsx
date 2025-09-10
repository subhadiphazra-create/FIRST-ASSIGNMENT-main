"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle, CheckCheck } from "lucide-react";
import { Attendance, TrainingPlan } from "@/types/type";
import { parseISO } from "date-fns";

interface AttendanceSummaryViewProps {
  attendances: Attendance[];
  totalTrainees: number;
  plan: TrainingPlan;
}

const AttendanceSummaryView: React.FC<AttendanceSummaryViewProps> = ({
  attendances,
  totalTrainees,
  plan,
}) => {
  // 🔹 Calculate stats
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

  const averageDailyAttendance =
    totalSessions > 0 ? Math.round(totalPresent / totalSessions) : 0;

  // 🔹 Expected vs collected days
  const expectedDays = plan.totalDurationInDays;
  const collectedDays = new Set(
    attendances.map((a) => parseISO(a.attendanceDate).toDateString())
  ).size;

  return (
    <div className="mt-4 space-y-4">
      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm rounded-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <CheckCheck className="text-green-600 w-5 h-5" />
            <CardTitle>Total Present</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{totalPresent}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <X className="text-red-600 w-5 h-5" />
            <CardTitle>Total Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{totalAbsent}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="text-yellow-500 w-5 h-5" />
            <CardTitle>Total Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{totalLeave}</p>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Summary Card */}
      <Card className="shadow-sm rounded-sm">
        <CardHeader>
          <CardTitle className="text-lg">Overall Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Overall Attendance Rate</p>
            <p
              className={`text-lg font-semibold ${
                overallAttendanceRate > 50 ? "text-green-500" : "text-red-500"
              }`}
            >
              {overallAttendanceRate}%
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Sessions Completed</p>
            <p className="text-lg font-semibold">
              {collectedDays} / {expectedDays}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Average Daily Attendance</p>
            <p className="text-lg font-semibold">{averageDailyAttendance}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSummaryView;
