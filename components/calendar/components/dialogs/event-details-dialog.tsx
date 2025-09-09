"use client";

import { format, parseISO } from "date-fns";
import { Calendar, FolderCheck, NotebookTabs, Text, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditEventDialog } from "./edit-event-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { PlanTopic, TrainingPlan } from "@/types/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findNameById } from "@/lib/employeeUtils";
import { IAssignment, IEvent } from "../../interfaces";
import {
  findPlanNameById,
  findPlanStartDateById,
} from "@/lib/findPlanNameById";

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const [topicData, setTopicData] = useState<PlanTopic>();
  // const [ assigments, setAssignments ] = useState<IAssignment>();

  const plans = useSelector((state: RootState) => state.plans.plans);
  const allEvents = useSelector((state: RootState) => state.events.events);
  const assignments = useSelector(
    (state: RootState) => state.assignments.assignments
  );

  // 🔹 fetch plan + topic
  useEffect(() => {
    const plan = plans.find((p) => p.planId === event.planId);
    if (plan) {
      const topic = plan.planTopics.find((t) => t.topicId === event.topicId);
      setTopicData(topic);
    }
  }, [event.planId, event.topicId, plans]);

  // 🔹 calculate start & end for this topic
  const { startDate } = useMemo(() => {
    const topicEvents = allEvents.filter(
      (e) => e.planId === event.planId && e.topicId === event.topicId
    );

    if (topicEvents.length === 0) {
      return { startDate: null, endDate: null };
    }

    const sorted = topicEvents
      .map((e) => parseISO(e.dayOfEvent || "null"))
      .sort((a, b) => a.getTime() - b.getTime());

    const firstDay = sorted[0];
    const lastDay = sorted[sorted.length - 1];

    const startDate = new Date(
      firstDay.getFullYear(),
      firstDay.getMonth(),
      firstDay.getDate(),
      9,
      30
    );

    const endDate = new Date(
      lastDay.getFullYear(),
      lastDay.getMonth(),
      lastDay.getDate(),
      18,
      30
    );

    return { startDate, endDate };
  }, [allEvents, event.planId, event.topicId]);

  const topicAssignments = useMemo(
    () => assignments.filter((a) => a.topicId === event.topicId),
    [event.topicId]
  );

  const planName = findPlanNameById(event.planId, plans);
  const planStartDate = findPlanStartDateById(event.planId, plans);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="md:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Plan Name: {planName}</DialogTitle>

          <DialogTitle className="font-light text-sm italic">
            Plan Start Date: {format(planStartDate, "d MMM yyyy")}, 09:30 AM
          </DialogTitle>
          <DialogTitle className="font-light text-md">
            Topic Name: {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Responsible */}
          <div className="flex items-start gap-2">
            <User className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Responsible</p>
              <p className="text-sm text-muted-foreground">{event.user.name}</p>
            </div>
          </div>

          {/* Start Date */}
          {startDate && (
            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Event Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "MMM d, yyyy h:mm a")}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex items-start gap-2">
            <Text className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {" "}
                {topicData?.topicDescription || "No description found."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <NotebookTabs className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">All Assignments</p>
              <div className="w-full overflow-x-hidden">
                {topicAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No assigment added yet.
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topicAssignments.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell>
                            {t.name.length >= 10
                              ? t.name.substring(0, 20) + "..."
                              : t.name}
                          </TableCell>
                          <TableCell>{t.status}</TableCell>
                          <TableCell>
                            {format(t.startDate, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {format(t.endDate, "MMM d, yyyy")}
                          </TableCell>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>

          {/* Resources  */}
          <div className="flex items-start gap-2">
            <FolderCheck className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Resources</p>
              <ul className="text-sm text-muted-foreground">
                {topicData?.topicResources &&
                topicData.topicResources.length > 0 ? (
                  topicData.topicResources.map((res, idx) => (
                    <li key={idx} className="list-decimal">
                      {res.name}{" "}
                      {res.size ? `(${(res.size / 1024).toFixed(2)} KB)` : ""}
                    </li>
                  ))
                ) : (
                  <li>No resources found.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <EditEventDialog event={event}>
            <Button type="button" variant="outline">
              Edit
            </Button>
          </EditEventDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
