"use client";

import { useState, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { FileUpload } from "@/components/ui/handle-file";
import { SmartSelect } from "@/components/ui/multi-select";

import { addAssignment, updateAssignment } from "@/store/assignmentSlice";
import { RootState } from "@/store";
import { assignmentSchema, TAssignmentFormData } from "../../schemas";
import { mockEmployees } from "@/constants";
import { IResource, IAssignment } from "../../interfaces";
import { addActivity } from "@/store/activitySlice";
import { useParams } from "next/navigation";
import { findPlanNameById } from "@/lib/findPlanNameById";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  editingAssignment?: IAssignment;
}

export function AddAssignmentDialog({
  isOpen,
  onClose,
  editingAssignment,
}: IProps) {
  const dispatch = useDispatch();
  const plans = useSelector((state: RootState) => state.plans.plans);
  const events = useSelector((state: RootState) => state.events.events);
  const params = useParams();
  const batchId = params?.batchId;

  const [resources, setResources] = useState<File[]>([]);
  const [topicRange, setTopicRange] = useState<{ start?: Date; end?: Date }>(
    {}
  );

  const form = useForm<TAssignmentFormData>({
    resolver: zodResolver(assignmentSchema()),
    defaultValues: editingAssignment
      ? {
          ...editingAssignment,
          startDate: new Date(editingAssignment.startDate),
          endDate: new Date(editingAssignment.endDate),
        }
      : {
          name: "",
          status: "Not Started",
          trainerId: "",
          planId: "",
          topicId: "",
          startDate: new Date(),
          endDate: new Date(),
          resources: [],
        },
  });

  useEffect(() => {
    if (editingAssignment) {
      form.reset({
        ...editingAssignment,
        startDate: new Date(editingAssignment.startDate),
        endDate: new Date(editingAssignment.endDate),
      });
    }
  }, [editingAssignment]);

  const selectedPlanId = form.watch("planId");
  const selectedTopicId = form.watch("topicId");

  const filteredTopics = useMemo(() => {
    const selectedPlan = plans.find((p) => p.planId === selectedPlanId);
    return selectedPlan?.planTopics ?? [];
  }, [plans, selectedPlanId]);

  useEffect(() => {
    form.setValue("topicId", "");
  }, [selectedPlanId]);

  useEffect(() => {
    if (selectedTopicId) {
      const topicEvents = events.filter((e) => e.topicId === selectedTopicId);
      if (topicEvents.length > 0) {
        const start = new Date(
          Math.min(...topicEvents.map((e) => new Date(e.startDate).getTime()))
        );
        const end = new Date(
          Math.max(...topicEvents.map((e) => new Date(e.endDate).getTime()))
        );
        setTopicRange({ start, end });
      }
    }
  }, [selectedTopicId, events]);

  const onSubmit = (values: TAssignmentFormData) => {
    const mappedResources: IResource[] = resources.map((file) => ({
      resorceId: nanoid(),
      resourceName: file.name,
      resourceType: file.type || "unknown",
      resourceSize: `${(file.size / 1024).toFixed(1)} KB`,
      resourceUrl: URL.createObjectURL(file),
    }));

    const assignment: IAssignment = {
      id: editingAssignment ? editingAssignment.id : nanoid(),
      ...values,
      startDate:
        values.startDate instanceof Date
          ? values.startDate.toISOString()
          : values.startDate,
      endDate:
        values.endDate instanceof Date
          ? values.endDate.toISOString()
          : values.endDate,
      resources: editingAssignment
        ? [...(editingAssignment.resources || []), ...mappedResources]
        : mappedResources,
      createdAt: editingAssignment
        ? editingAssignment.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingAssignment) {
      dispatch(updateAssignment(assignment));
      dispatch(
        addActivity({
          batchId: batchId as string || "",
          userId: "U101",
          action: "updated",
          activityText: `Assignmnet ${values.name} was updated for plan ${findPlanNameById(values.planId,plans)}.`,
          actionDate: new Date().toISOString(),
        })
      );

    } else {
      dispatch(addAssignment(assignment));
      dispatch(
        addActivity({
          batchId: batchId as string || "",
          userId: "U101",
          action: "created",
          activityText: `Assignmnet ${values.name} was created for plan ${findPlanNameById(values.planId,plans)}.`,
          actionDate: new Date().toISOString(),
        })
      );
    }

    form.reset();
    setResources([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingAssignment ? "Edit Assignment" : "Add Assignment"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Assignment Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Assignment name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trainer */}
            <FormField
              control={form.control}
              name="trainerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer</FormLabel>
                  <FormControl>
                    <SmartSelect
                      isMultiSelect={false}
                      options={mockEmployees.map((e) => ({
                        value: e.userId,
                        label: `${e.basicData.firstName} ${e.basicData.lastName}`,
                        role: e.basicData.role,
                      }))}
                      value={field.value}
                      onChange={(val) => field.onChange(val as string)}
                      placeholder="Select a trainer"
                      filterKey="role"
                      showFilter
                      showSearchbar
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plan */}
            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <FormControl>
                    <SmartSelect
                      isMultiSelect={false}
                      options={plans.map((p) => ({
                        value: p.planId,
                        label: p.planTitle,
                      }))}
                      value={field.value}
                      onChange={(val) => field.onChange((val as string) ?? "")}
                      placeholder="Select a plan"
                      showFilter
                      showSearchbar
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Topic */}
            {selectedPlanId && (
              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <SmartSelect
                        isMultiSelect={false}
                        options={filteredTopics.map((t) => ({
                          value: t.topicId,
                          label: t.topicTitle,
                        }))}
                        value={field.value}
                        onChange={(val) =>
                          field.onChange((val as string) ?? "")
                        }
                        placeholder="Select a topic"
                        showFilter
                        showSearchbar
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Dates */}
            {selectedTopicId && (
              <>
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
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
                      {topicRange.start && (
                        <p className="text-xs text-muted-foreground">
                          Must be on/after {topicRange.start.toDateString()}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
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
                      {topicRange.end && (
                        <p className="text-xs text-muted-foreground">
                          Must be on/before {topicRange.end.toDateString()}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* File Upload */}
            <FormItem>
              <FormLabel>Resources</FormLabel>
              <FileUpload onFiles={setResources} />
            </FormItem>

            <DialogFooter>
              <Button type="submit">
                {editingAssignment ? "Update Assignment" : "Save Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
