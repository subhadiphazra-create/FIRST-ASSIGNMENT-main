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
import { findNameById } from "@/lib/employeeUtils";
import { RootState } from "@/store";
import { format } from "date-fns";
import { NotebookTabs } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAssignment } from "@/components/calendar/interfaces";
import { removeAssignment } from "@/store/assignmentSlice";
import { AddAssignmentDialog } from "./add-assignment-dialog";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewAssignmentDialog = ({ isOpen, onClose }: IProps) => {
  const dispatch = useDispatch();
  const allAssignments = useSelector(
    (state: RootState) => state.assignments.assignments
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<
    IAssignment | undefined
  >(undefined);

  const handleRemove = (id: string) => {
    dispatch(removeAssignment({ id }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <NotebookTabs className="mt-1 size-4 shrink-0" />
            All Assignments
          </DialogTitle>
        </DialogHeader>

        <div className="w-full overflow-x-hidden">
          {allAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No assignment added yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Trainer Name</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAssignments.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {t.name.length >= 20
                        ? t.name.substring(0, 20) + "..."
                        : t.name}
                    </TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>{format(new Date(t.startDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(t.endDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{findNameById(t.trainerId)}</TableCell>
                    <TableCell>
                      {t.resources && t.resources.length > 0 ? (
                        <ul className="list-decimal pl-4 space-y-1">
                          {t.resources.map((res) => (
                            <li key={res.resorceId}>
                              <a
                                href={res.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {res.resourceName} ({res.resourceSize})
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No resources
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingAssignment(t);
                          setIsAddOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(t.id)}
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
              setEditingAssignment(undefined);
              setIsAddOpen(true);
            }}
          >
            Add Assignment
          </Button>
        </div>

        {/* Add/Edit Dialog */}
        <AddAssignmentDialog
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          editingAssignment={editingAssignment}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewAssignmentDialog;
