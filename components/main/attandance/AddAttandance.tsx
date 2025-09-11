"use client";

import { useEffect, useMemo, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Check,
  X,
  AlertCircle,
  Users,
  CheckCheck,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RootState } from "@/store";
import { addAttendance, updateAttendance } from "@/store/attendanceSlice";
import { Attendance } from "@/types/type";
import {
  attendanceSchema,
  TAttendanceFormData,
} from "@/components/calendar/schemas";
import { findEmailById, findNameById } from "@/lib/employeeUtils";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addActivity } from "@/store/activitySlice";
import { findPlanNameById } from "@/lib/findPlanNameById";

interface IProps {
  planId: string;
}

export function AddAttendance({ planId }: IProps) {
  const dispatch = useDispatch();
  const { batchId } = useParams();

  const plans = useSelector((state: RootState) => state.plans.plans);
  const batches = useSelector((state: RootState) => state.training.batches);
  const attendances = useSelector(
    (state: RootState) => state.attendances.attendances
  );

  const plan = plans.find((p) => p.planId === planId);
  const batch = batches.find((b) => b.batchId === batchId);

  const trainees = useMemo(() => batch?.batchTrainee || [], [batch]);

  const form = useForm<TAttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      planId: planId,
      attendanceDate: new Date(),
    },
  });

  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, "present" | "leave" | "absent">
  >({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Watch date selection
  const selectedDate = form.watch("attendanceDate");

  // Find existing attendance for this date & plan
  const existingAttendance = attendances.find(
    (a) =>
      a.planId === planId &&
      new Date(a.attendanceDate).toDateString() === selectedDate?.toDateString()
  );

  useEffect(() => {
    const map: Record<string, "present" | "leave" | "absent"> = {};
    trainees.forEach((tId) => {
      if (existingAttendance) {
        map[tId] = existingAttendance.traineeList[tId] || "absent";
      } else {
        map[tId] = "absent"; // default absent
      }
    });
    setAttendanceMap(map);
  }, [existingAttendance, trainees]);

  const updateStatus = (id: string, status: "present" | "leave" | "absent") => {
    setAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleConfirm = (values: TAttendanceFormData) => {
    const attendance: Attendance = {
      attendanceId: existingAttendance
        ? existingAttendance.attendanceId
        : nanoid(),
      planId: values.planId,
      attendanceDate: values.attendanceDate.toISOString(),
      traineeList: attendanceMap, // ✅ full status map
      createdAt: existingAttendance
        ? existingAttendance.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingAttendance) {
      dispatch(updateAttendance(attendance));
      dispatch(
        addActivity({
          batchId: (batchId as string) || "",
          userId: "U101",
          action: "updated",
          activityText: `Attandance was updated for plan ${findPlanNameById(
            planId,
            plans
          )}.`,
          actionDate: new Date().toISOString(),
        })
      );
    } else {
      dispatch(addAttendance(attendance));
      dispatch(
        addActivity({
          batchId: (batchId as string) || "",
          userId: "U101",
          action: "created",
          activityText: `Attandance was added for plan ${findPlanNameById(
            planId,
            plans
          )}.`,
          actionDate: new Date().toISOString(),
        })
      );
    }

    setConfirmOpen(false);
  };

  // Stats
  const presentCount = Object.values(attendanceMap).filter(
    (v) => v === "present"
  ).length;
  const leaveCount = Object.values(attendanceMap).filter(
    (v) => v === "leave"
  ).length;
  const absentCount = Object.values(attendanceMap).filter(
    (v) => v === "absent"
  ).length;
  const totalCount = trainees.length;

  return (
    <div className="space-y-6">
      {/* Top Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="font-bold">Select Date</CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) =>
                    form.setValue("attendanceDate", d ?? new Date(), {
                      shouldValidate: true, // ✅ validate instantly
                      shouldTouch: true,
                    })
                  }
                />
              </PopoverContent>
            </Popover>

            {/* ✅ Show validation error */}
            {form.formState.errors.attendanceDate && (
              <p className="text-sm text-red-500 mt-2">
                {form.formState.errors.attendanceDate.message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="font-bold">Select Training Plan</CardHeader>
          <CardContent>
            <Badge>
              <p className="text-sm font-medium">{plan?.planTitle}</p>
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="shadow-sm">
        <CardHeader className="font-medium flex justify-between">
          <span>
            Mark Attendance - {selectedDate?.toDateString()} - {plan?.planTitle}
          </span>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => form.trigger()}>
                {existingAttendance ? "Update Attendance" : "Add Attendance"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {existingAttendance ? "Update Attendance" : "Add Attendance"}
                </DialogTitle>
                <DialogDescription>
                  {existingAttendance
                    ? "Do you really want to update this attendance record?"
                    : "Do you really want to add this attendance record?"}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="default"
                  onClick={form.handleSubmit(handleConfirm)}
                >
                  Yes, Do it
                </Button>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Attendance Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainees.map((tId) => {
                return (
                  <TableRow key={tId}>
                    <TableCell>{findNameById(tId) || "Unknown"}</TableCell>
                    <TableCell>{findEmailById(tId) || "N/A"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant={
                          attendanceMap[tId] === "present"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => updateStatus(tId, "present")}
                      >
                        <Check className="mr-1 h-4 w-4" /> Present
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          attendanceMap[tId] === "leave" ? "default" : "outline"
                        }
                        onClick={() => updateStatus(tId, "leave")}
                      >
                        <AlertCircle className="mr-1 h-4 w-4" /> Leave
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          attendanceMap[tId] === "absent"
                            ? "destructive"
                            : "outline"
                        }
                        onClick={() => updateStatus(tId, "absent")}
                      >
                        <X className="mr-1 h-4 w-4" /> Absent
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center justify-center py-4 shadow-sm">
          <div className="flex gap-3">
            <CheckCheck className="text-green-500 mb-1" /> <span>Present</span>
          </div>
          <p className="text-lg font-bold">{presentCount}</p>
        </Card>
        <Card className="flex flex-col items-center justify-center py-4 shadow-sm">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-500 mb-1" /> <span>Leave</span>
          </div>
          <p className="text-lg font-bold">{leaveCount}</p>
        </Card>
        <Card className="flex flex-col items-center justify-center py-4 shadow-sm">
          <div className="flex gap-3">
            <X className="text-red-500 mb-1" /> <span>Absent</span>
          </div>
          <p className="text-lg font-bold">{absentCount}</p>
        </Card>
        <Card className="flex flex-col items-center justify-center py-4 shadow-sm">
          <div className="flex gap-3">
            <Users className="text-gray-500 mb-1" /> <span>Total</span>
          </div>
          <p className="text-lg font-bold">{totalCount}</p>
        </Card>
      </div>
    </div>
  );
}
