"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCheck, OctagonAlert, OctagonX } from "lucide-react";
import { format, parseISO } from "date-fns";

export interface Attendance {
  attendanceId: string;
  attendanceDate: string;
  planId: string;
  traineeList: Record<string, "present" | "absent" | "leave">;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceTableViewProps {
  attendances: Attendance[];
  totalTrainees: number;
}

const AttendanceTableView: React.FC<AttendanceTableViewProps> = ({
  attendances,
  totalTrainees,
}) => {
  // 🔹 helper for status
  const getStatus = (percentage: number) => {
    if (percentage > 90) return "Excellent";
    if (percentage >= 70) return "Good";
    if (percentage >= 50) return "Avg";
    return "Poor";
  };

  return (
    <div className="overflow-x-auto mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Present</TableHead>
            <TableHead className="text-center">Absent</TableHead>
            <TableHead className="text-center">Leave</TableHead>
            <TableHead className="text-center">% Attendance</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-3 text-gray-500 dark:text-gray-400"
              >
                No attendance records found.
              </TableCell>
            </TableRow>
          )}

          {attendances.map((attendance) => {
            const statuses = Object.values(attendance.traineeList);

            const presentCount = statuses.filter((s) => s === "present").length;
            const absentCount = statuses.filter((s) => s === "absent").length;
            const leaveCount = statuses.filter((s) => s === "leave").length;

            const percentage =
              totalTrainees > 0
                ? Math.round((presentCount / totalTrainees) * 100)
                : 0;
            const status = getStatus(percentage);

            return (
              <TableRow key={attendance.attendanceId} className="text-center">
                <TableCell className="font-medium">
                  {format(parseISO(attendance.attendanceDate), "EEE, MMM d")}
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center gap-1">
                    <CheckCheck className="text-green-600 w-4 h-4" />
                    {presentCount}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center gap-1">
                    <OctagonX className="text-red-600 w-4 h-4" />
                    {absentCount}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center gap-1">
                    <OctagonAlert className="text-yellow-500 w-4 h-4" />
                    {leaveCount}
                  </span>
                </TableCell>
                <TableCell>{percentage}%</TableCell>
                <TableCell className="font-semibold">
                  <Badge>{status}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTableView;
