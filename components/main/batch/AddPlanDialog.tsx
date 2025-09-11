"use client";

import { expandPlanToEvents } from "@/lib/expandPlanToEvents";
import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ShowTopicDialog from "./ShowTopicDialog";
import { PlanTopic, TrainingPlan } from "@/types/type";
import { addPlan, updatePlan } from "@/store/plansSlice";
import { planSchema, TPlanForm } from "@/schemas/plan-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addEvents, removeEventsByPlan } from "@/store/eventsSlice"; // ✅ import new actions
import { useParams } from "next/navigation";
import { HOLIDAY_DATES } from "@/constants/index";
import { CirclePlus } from "lucide-react";
import { addActivity } from "@/store/activitySlice";

// 🔹 Identify day type
function getDayType(date: Date): "holiday" | "sunday" | "saturday" | "working" {
  const day = date.getDay();
  const dateStr = date.toISOString().split("T")[0];

  if (day === 0) return "sunday";
  if (day === 6) return "saturday";
  if (HOLIDAY_DATES.includes(dateStr)) return "holiday";
  return "working";
}

// 🔹 Calculate end date (working days only)
function calculateEndDate(startDate: Date, totalDays: number): Date {
  const result = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < totalDays - 1) {
    result.setDate(result.getDate() + 1);
    const type = getDayType(result);
    if (type === "working") {
      daysAdded++;
    }
  }
  return result;
}

// 🔹 Combine date string + time string → Date
function combineDateAndTime(date: string, time: string): Date {
  const [hour, minutePart] = time.split(":");
  const [minute, ampm] = minutePart.split(" ");
  let h = parseInt(hour, 10);
  if (ampm.toLowerCase() === "pm" && h < 12) h += 12;
  if (ampm.toLowerCase() === "am" && h === 12) h = 0;
  return new Date(`${date}T${String(h).padStart(2, "0")}:${minute}:00`);
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan?: TrainingPlan | null;
}

export default function AddPlanDialog({ isOpen, onClose, plan }: Props) {
  const dispatch = useDispatch();
  const [topics, setTopics] = useState<PlanTopic[]>([]);
  const [topicToEdit, setTopicToEdit] = useState<PlanTopic | null>(null);
  const [showTopicDialog, setShowTopicDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { batchId } = useParams();

  const form = useForm<TPlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      planTitle: "",
      planStartDate: new Date().toISOString().split("T")[0],
      color: "blue",
    },
  });

  // ✅ Load existing plan into form when editing
  useEffect(() => {
    if (plan) {
      form.reset({
        planTitle: plan.planTitle,
        planStartDate: plan.planStartDate,
        color: plan.color,
      });
      setTopics(plan.planTopics);
    }
  }, [plan, form]);

  const onAddOrUpdateTopic = (topic: PlanTopic) => {
    if (topicToEdit) {
      setTopics((prev) =>
        prev.map((t) => (t.topicId === topic.topicId ? topic : t))
      );
      setTopicToEdit(null);
    } else {
      setTopics((prev) => [...prev, topic]);
    }
  };

  const onRemoveTopic = (topicId: string) => {
    setTopics((prev) => prev.filter((t) => t.topicId !== topicId));
  };

  const onEditTopic = (topic: PlanTopic) => {
    setTopicToEdit(topic);
    setShowTopicDialog(true);
  };

  // 🧮 Calculate total duration
  const totalDuration = useMemo(() => {
    let totalDays = 0;
    topics.forEach((t) => {
      if (t.topicDuration === "days") totalDays += t.topicDurationValue;
      if (t.topicDuration === "weeks") totalDays += t.topicDurationValue * 7;
      if (t.topicDuration === "months") totalDays += t.topicDurationValue * 30;
    });
    return totalDays;
  }, [topics]);

  const onSubmit = (values: TPlanForm) => {
    if (topics.length === 0) {
      setShowErrorDialog(true);
      return;
    }

    const startDateTime = combineDateAndTime(values.planStartDate, "09:30 AM");
    let endDateOnly = calculateEndDate(startDateTime, totalDuration);

    const newPlan: TrainingPlan = {
      planId: plan?.planId || nanoid(),
      planTitle: values.planTitle,
      planStartDate: values.planStartDate,
      planTopics: topics,
      createdAt: plan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      planStartTime: "09:30 AM",
      planEndTime: "06:30 PM",
      user: "U001",
      color: values.color,
      totalDurationInDays: totalDuration,
      batchId: plan?.batchId || (batchId as string),
      planEndDate: endDateOnly.toISOString().split("T")[0],
    };

    if (plan) {
      // ✅ update plan
      dispatch(updatePlan(newPlan));
      
      dispatch(
        addActivity({
          batchId: batchId as string || "",
          userId: "U101",
          action: "updated",
          activityText: `Plan ${values.planTitle} was updated.`,
          actionDate: new Date().toISOString(),
        })
      );

      // remove old events for this plan
      dispatch(removeEventsByPlan({ planId: plan.planId }));

      // add new regenerated events
      const updatedEvents = expandPlanToEvents(newPlan);
      dispatch(addEvents(updatedEvents));
    } else {
      // ✅ add new plan
      dispatch(addPlan(newPlan));

      const topicEvents = expandPlanToEvents(newPlan);
      dispatch(addEvents(topicEvents));
      dispatch(
        addActivity({
          batchId: batchId as string || "",
          userId: "U101",
          action: "created",
          activityText: `Plan ${values.planTitle} was created on this batch.`,
          actionDate: new Date().toISOString(),
        })
      );
    }

    form.reset();
    setTopics([]);
    onClose();
    window.location.reload();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full md:min-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {plan ? "Edit Training Plan" : "Add Training Plan"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id="plan-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              {/* Plan Title */}
              <FormField
                control={form.control}
                name="planTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter plan title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plan Start Date */}
              <FormField
                control={form.control}
                name="planStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plan Color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pick a color" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "blue",
                            "green",
                            "red",
                            "yellow",
                            "purple",
                            "orange",
                            "gray",
                          ].map((color) => (
                            <SelectItem key={color} value={color}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded-full bg-${color}-600`}
                                />
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setTopicToEdit(null);
                  setShowTopicDialog(true);
                }}
              >
                Add Topic
              </Button>

              {/* Topics Table */}
              <div>
                <h3 className="font-semibold mt-4 mb-2">Topics</h3>
                {topics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No topics added yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topics.map((t) => (
                        <TableRow key={t.topicId}>
                          <TableCell>{t.topicTitle}</TableCell>
                          <TableCell>{t.topicDescription}</TableCell>
                          <TableCell>
                            {t.topicDurationValue} {t.topicDuration}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="secondary"
                              type="button"
                              size="sm"
                              onClick={() => onEditTopic(t)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onRemoveTopic(t.topicId)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-semibold">
                          Total Duration
                        </TableCell>
                        <TableCell colSpan={2}>{totalDuration} days</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
            </form>
          </Form>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button form="plan-form" type="submit">
              {plan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nested Topic Dialog */}
      {showTopicDialog && (
        <ShowTopicDialog
          isOpen={showTopicDialog}
          onClose={() => {
            setShowTopicDialog(false);
            setTopicToEdit(null);
          }}
          onAddTopic={onAddOrUpdateTopic}
          topicToEdit={topicToEdit}
        />
      )}

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validation Error</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Please add at least one topic before{" "}
            {plan ? "updating" : "creating"} the plan.
          </p>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
