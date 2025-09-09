"use client";

import { useEffect, useMemo, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
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
import { findNameById } from "@/lib/employeeUtils";
import { Attendance } from "@/types/type";
import { attendanceSchema, TAttendanceFormData } from "@/components/calendar/schemas";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  editingAttendance?: Attendance;
}

export function AddAttendanceDialog({
  isOpen,
  onClose,
  editingAttendance,
}: IProps) {
  const dispatch = useDispatch();
  const batches = useSelector((state: RootState) => state.training.batches);
  const plans = useSelector((state: RootState) => state.plans.plans);

  const { batchId } = useParams();

  const batch = useMemo(
    () => batches.find((b) => b.batchId === batchId),
    [batches, batchId]
  );

  // 🔹 Trainee List from batch
  const trainees = useMemo(() => batch?.batchTrainee || [], [batch]);

  // 🔹 Local state for attendance (present/absent)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>(
    {}
  );

  const form = useForm<TAttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      planId: editingAttendance ? editingAttendance.planId : "",
      attendanceDate: editingAttendance
        ? new Date(editingAttendance.attendanceDate)
        : new Date(),
    },
  });

  useEffect(() => {
    const map: Record<string, boolean> = {};
    trainees.forEach((t) => {
      map[t] = editingAttendance
        ? editingAttendance.traineeList.includes(t)
        : false;
    });
    setAttendanceMap(map);
  }, [editingAttendance, trainees]);

  const toggleAttendance = (id: string) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onSubmit = (values: TAttendanceFormData) => {
    const presentStudents = Object.keys(attendanceMap).filter(
      (id) => attendanceMap[id]
    );

    const attendance: Attendance = {
      attendanceId: editingAttendance
        ? editingAttendance.attendanceId
        : nanoid(),
      planId: values.planId,
      attendanceDate: values.attendanceDate.toISOString(),
      isPresent: true, // keep for compatibility
      traineeList: presentStudents,
      createdAt: editingAttendance
        ? editingAttendance.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingAttendance) {
      dispatch(updateAttendance(attendance));
    } else {
      dispatch(addAttendance(attendance));
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingAttendance ? "Edit Attendance" : "Add Attendance"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Plan Dropdown */}
            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <FormControl>
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="">Select a plan</option>
                      {plans.map((p) => (
                        <option key={p.planId} value={p.planId}>
                          {p.planTitle}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attendance Table */}
            <div>
              <FormLabel>Mark Attendance</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Present</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainees.map((tId) => (
                    <TableRow key={tId}>
                      <TableCell>{findNameById(tId)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={attendanceMap[tId] || false}
                          onCheckedChange={() => toggleAttendance(tId)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Attendance Date */}
            <FormField
              control={form.control}
              name="attendanceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          {field.value
                            ? field.value.toDateString()
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(d) => field.onChange(d ?? field.value)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {editingAttendance ? "Update Attendance" : "Save Attendance"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
