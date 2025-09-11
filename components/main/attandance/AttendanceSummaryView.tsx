"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, CheckCheck, Download } from "lucide-react";
import { Attendance, TrainingPlan } from "@/types/type";
import { parseISO, format } from "date-fns";
import * as XLSX from "xlsx";
import { findPlanNameById } from "@/lib/findPlanNameById";
import { findNameById } from "@/lib/employeeUtils";

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

  // 🔹 Excel Export Function
  const handleDownloadExcel = () => {
    if (!attendances || attendances.length === 0) return;

    // Collect all unique trainee IDs
    const allTraineeIds = new Set<string>();
    attendances.forEach((a) =>
      Object.keys(a.traineeList).forEach((id) => allTraineeIds.add(id))
    );

    // Collect all dates in sorted order
    const allDates = attendances
      .map((a) => parseISO(a.attendanceDate))
      .sort((a, b) => a.getTime() - b.getTime());

    const dateHeaders = allDates.map((d) => format(d, "dd-MM-yyyy"));

    // Build sheet data
    const sheetData: any[] = [];

    // Header row: Index | Name | Dates...
    sheetData.push(["Id", "Name", ...dateHeaders]);

    // Each trainee row
    Array.from(allTraineeIds).forEach((traineeId, index) => {
      const row: any[] = [traineeId, findNameById(traineeId)];

      allDates.forEach((dateObj) => {
        const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
        const attendanceForDay = attendances.find(
          (a) => a.attendanceDate.split("T")[0] === dateStr
        );

        let status = "";
        if (attendanceForDay) {
          status = attendanceForDay.traineeList[traineeId] || "";
        }

        row.push(status);
      });

      sheetData.push(row);
    });

    // Create worksheet & workbook
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    // File name: planName-attendance.xlsx
    XLSX.writeFile(
      wb,
      `${findPlanNameById(plan.planId, [plan])}-attendance.xlsx`
    );
  };

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
        <CardContent className="space-y-4">
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

          {/* ✅ Download Button */}
          <Button
            className="w-full mt-2 flex items-center gap-2"
            onClick={handleDownloadExcel}
          >
            <Download className="w-4 h-4" />
            Download as Excel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSummaryView;
