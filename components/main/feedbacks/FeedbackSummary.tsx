"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { findPlanNameById } from "@/lib/findPlanNameById";
import { findNameById } from "@/lib/employeeUtils";

type PlanInfo = {
  id: string;
  name: string;
};

type Props = {
  plans?: PlanInfo[];
};

export default function PlanFeedbacksList({ plans }: Props) {
  const feedbacks = useSelector(
    (s: RootState) => s.mentorFeedback.feedbacks || []
  );

  const [editing, setEditing] = useState<{
    open: boolean;
    feedbackId: string | null;
    traineeId: string | null;
  }>({ open: false, feedbackId: null, traineeId: null });

  // ✅ group feedbacks by plan
  const groupedByPlan = useMemo(() => {
    const map = new Map<
      string,
      {
        planId: string;
        feedbacks: typeof feedbacks;
      }
    >();

    feedbacks.forEach((fb) => {
      const planIds = (fb as any).planIds ?? (fb.planId ? [fb.planId] : []);
      planIds.forEach((pid: string) => {
        if (!map.has(pid)) {
          map.set(pid, { planId: pid, feedbacks: [] });
        }
        map.get(pid)!.feedbacks.push(fb);
      });
    });

    return Array.from(map.values());
  }, [feedbacks]);

  const allPlans = useSelector((state: RootState) => state.plans.plans);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Plans</h2>

      {groupedByPlan.length === 0 ? (
        <p className="text-gray-500">No plans found in feedbacks.</p>
      ) : (
        <Accordion type="multiple" className="w-full">
          {groupedByPlan.map(({ planId, feedbacks: fbs }) => {
            const uniqueTrainees = new Set<string>();
            const uniqueTrainers = new Set<string>();

            fbs.forEach((fb) => {
              (fb.traineeId ?? []).forEach((t: string) =>
                uniqueTrainees.add(t)
              );
              (fb.trainerId ?? []).forEach((tr: string) =>
                uniqueTrainers.add(tr)
              );
            });

            const traineesArray = Array.from(uniqueTrainees);

            return (
              <AccordionItem key={planId} value={planId}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="font-medium">
                        Plan - {findPlanNameById(planId, allPlans)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {traineesArray.length} trainee
                        {traineesArray.length !== 1 ? "s" : ""} •{" "}
                        {uniqueTrainers.size} mentor
                        {uniqueTrainers.size !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  {traineesArray.length === 0 ? (
                    <div className="text-gray-500 px-4">
                      No trainees for this plan.
                    </div>
                  ) : (
                    <Accordion type="multiple" className="w-full">
                      {traineesArray.map((traineeId) => {
                        // ✅ filter only feedbacks for this trainee
                        const traineeFeedbacks = fbs.filter((fb) =>
                          (fb.traineeId ?? []).includes(traineeId)
                        );

                        return (
                          <AccordionItem
                            key={traineeId}
                            value={`${planId}-${traineeId}`}
                          >
                            <AccordionTrigger>
                              <div className="flex justify-between items-center w-full">
                                <div>
                                  <div className="font-medium">
                                    Trainee - {findNameById(traineeId)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {traineeFeedbacks.length} feedback
                                    {traineeFeedbacks.length !== 1 ? "s" : ""}
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="space-y-4">
                                {/* ✅ keep feedbacks separate */}
                                {traineeFeedbacks.map((fb) => {
                                  const isSelfAssigned = (
                                    fb.trainerId ?? []
                                  ).includes(traineeId);

                                  // ✅ group discussions by category per feedback
                                  const categoryMap = new Map<
                                    string,
                                    {
                                      highestMarks: number[];
                                      obtainedMarks: number[];
                                    }
                                  >();

                                  (fb.feedbackDiscussions ?? []).forEach(
                                    (disc: any) => {
                                      const category =
                                        disc.category ?? "Uncategorized";

                                      if (!categoryMap.has(category)) {
                                        categoryMap.set(category, {
                                          highestMarks: [],
                                          obtainedMarks: [],
                                        });
                                      }

                                      if (disc.highestMarks) {
                                        categoryMap
                                          .get(category)!
                                          .highestMarks.push(disc.highestMarks);
                                      }

                                      (disc.traineeDiscussions ?? [])
                                        .filter(
                                          (td: any) =>
                                            td.traineeId === traineeId
                                        )
                                        .forEach((td: any) => {
                                          if (td.obtainedMarks != null) {
                                            categoryMap
                                              .get(category)!
                                              .obtainedMarks.push(
                                                td.obtainedMarks
                                              );
                                          }
                                        });
                                    }
                                  );

                                  const categoryRows = Array.from(
                                    categoryMap.entries()
                                  ).map(([category, values]) => {
                                    const avgHighest =
                                      values.highestMarks.length > 0
                                        ? values.highestMarks.reduce(
                                            (a, b) => a + b,
                                            0
                                          ) / values.highestMarks.length
                                        : 0;

                                    const avgObtained =
                                      values.obtainedMarks.length > 0
                                        ? values.obtainedMarks.reduce(
                                            (a, b) => a + b,
                                            0
                                          ) / values.obtainedMarks.length
                                        : 0;

                                    const percentage =
                                      avgHighest > 0
                                        ? (
                                            (avgObtained / avgHighest) *
                                            100
                                          ).toFixed(1)
                                        : "—";

                                    return {
                                      category,
                                      avgHighest: avgHighest.toFixed(1),
                                      avgObtained: avgObtained.toFixed(1),
                                      percentage,
                                    };
                                  });

                                  return (
                                    <div
                                      key={fb.feedbackId}
                                      className="border rounded p-4 bg-white shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <div>
                                          <div className="font-semibold">
                                            {fb.feedbackName ?? fb.feedbackId}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Status: {fb.status ?? "N/A"} •
                                            Updated:{" "}
                                            {fb.updatedAt
                                              ? new Date(
                                                  fb.updatedAt
                                                ).toLocaleString()
                                              : "N/A"}
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                          {isSelfAssigned && (
                                            <span className="text-sm px-2 py-1 bg-yellow-100 rounded text-yellow-800">
                                              Self-assigned feedback
                                            </span>
                                          )}

                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              setEditing({
                                                open: true,
                                                feedbackId: fb.feedbackId,
                                                traineeId,
                                              })
                                            }
                                          >
                                            Edit
                                          </Button>
                                        </div>
                                      </div>

                                      <div className="overflow-x-auto">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Category</TableHead>
                                              <TableHead>
                                                Avg Highest Marks
                                              </TableHead>
                                              <TableHead>
                                                Avg Obtained Marks
                                              </TableHead>
                                              <TableHead>Percentage</TableHead>
                                              <TableHead>
                                                Assigned Mentors
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {categoryRows.map((row) => (
                                              <TableRow key={row.category}>
                                                <TableCell>
                                                  {row.category}
                                                </TableCell>
                                                <TableCell>
                                                  {row.avgHighest}
                                                </TableCell>
                                                <TableCell>
                                                  {row.avgObtained}
                                                </TableCell>
                                                <TableCell>
                                                  {row.percentage}%
                                                </TableCell>
                                                <TableCell>
                                                  {(fb.trainerId ?? []).length ===
                                                  0 ? (
                                                    "—"
                                                  ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                      {(
                                                        fb.trainerId ?? []
                                                      ).map((m: string) => (
                                                        <span
                                                          key={m}
                                                          className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-800"
                                                        >
                                                          {findNameById(m)}
                                                        </span>
                                                      ))}
                                                    </div>
                                                  )}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {editing.open && editing.feedbackId && editing.traineeId && <></>}
    </div>
  );
}
