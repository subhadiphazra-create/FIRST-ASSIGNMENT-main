"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { removeAttendance } from "@/store/attendanceSlice";
import { AddAttendanceDialog } from "./AddAttandance";
import { Attendance } from "@/types/type";
import { findNameById } from "@/lib/employeeUtils";
import { findPlanNameById } from "@/lib/findPlanNameById";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewAttendanceDialog = ({ isOpen, onClose }: IProps) => {
  const dispatch = useDispatch();
  const allAttendances = useSelector(
    (state: RootState) => state.attendances.attendances
  );
  const plans = useSelector((state: RootState) => state.plans.plans);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<
    Attendance | undefined
  >(undefined);

  const handleRemove = (id: string) => {
    dispatch(removeAttendance({ id }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <CalendarDays className="mt-1 size-4 shrink-0" />
            Attendance Records
          </DialogTitle>
        </DialogHeader>

        <div className="w-full overflow-x-hidden">
          {allAttendances.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No attendance records yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Index</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAttendances.map((att, index) => (
                  <TableRow key={att.attendanceId}>
                    <TableCell>{index + 1}</TableCell>

                    {/* 🔹 Render trainee names */}
                    <TableCell>
                      {att.traineeList && att.traineeList.length > 0
                        ? att.traineeList.map(findNameById).join(", ")
                        : "No students"}
                    </TableCell>

                    {/* 🔹 Render plan name from planId */}
                    <TableCell>
                      {findPlanNameById(att.planId, plans) ?? "N/A"}
                    </TableCell>

                    <TableCell>
                      {format(new Date(att.attendanceDate), "MMM d, yyyy")}
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingAttendance(att);
                          setIsAddOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(att.attendanceId)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Add button */}
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              setEditingAttendance(undefined);
              setIsAddOpen(true);
            }}
          >
            Add Attendance
          </Button>
        </div>

        {/* Add/Edit Dialog */}
        <AddAttendanceDialog
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          editingAttendance={editingAttendance}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewAttendanceDialog;
