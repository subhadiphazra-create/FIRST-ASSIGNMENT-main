"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FeedbackDiscussion } from "@/types/type";
import EditFeedbackDialog from "./EditTrainerFeedbackDialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  traineeId: string;
}

export default function TrainerFeedbackSummary({
  traineeId,
  isOpen,
  onClose,
}: Props) {
  const mentorFeedbacks = useSelector((state: RootState) =>
    state.mentorFeedback.feedbacks.filter((f) =>
      f.traineeId?.includes(traineeId)
    )
  );

  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);

  const discussionsByCategory = (
    feedbackId: string
  ): Record<string, FeedbackDiscussion[]> => {
    const fb = mentorFeedbacks.find((f) => f.feedbackId === feedbackId);
    if (!fb?.feedbackDiscussions) return {};
    return fb.feedbackDiscussions.reduce((acc, d) => {
      acc[d.category] = acc[d.category] || [];
      acc[d.category].push(d);
      return acc;
    }, {} as Record<string, FeedbackDiscussion[]>);
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="w-full md:min-w-5xl">
        <DialogTitle className="text-xl font-bold mb-4">
          Trainee Feedback Summary
        </DialogTitle>

        {mentorFeedbacks.length === 0 ? (
          <p className="text-gray-500">
            No feedback assigned for this trainee.
          </p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {mentorFeedbacks.map((fb) => (
              <AccordionItem key={fb.feedbackId} value={fb.feedbackId}>
                <AccordionTrigger>{fb.feedbackName}</AccordionTrigger>
                <AccordionContent>
                  {Object.entries(discussionsByCategory(fb.feedbackId)).map(
                    ([category, items]) => (
                      <div key={category} className="mb-4">
                        <h4 className="font-semibold mb-2">{category}</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30%]">SubCategory</TableHead>
                              <TableHead className="w-[20%]">Highest</TableHead>
                              <TableHead className="w-[20%]">Obtained</TableHead>
                              <TableHead className="w-[30%]">Remarks</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((d) => {
                              const traineeScore =
                                d.traineeDiscussions?.find(
                                  (t) => t.traineeId === traineeId
                                );
                              return (
                                <TableRow key={d.id}>
                                  <TableCell>{d.subCategory}</TableCell>
                                  <TableCell>{d.highestMarks ?? "-"}</TableCell>
                                  <TableCell>
                                    {traineeScore?.obtainedMarks ?? "-"}
                                  </TableCell>
                                  <TableCell>
                                    {traineeScore?.remarks ?? "-"}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  )}
                  <div className="flex justify-end mt-3">
                    <Button
                      size="sm"
                      onClick={() => setEditingFeedback(fb.feedbackId)}
                    >
                      Edit
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {editingFeedback && (
          <EditFeedbackDialog
            isOpen={!!editingFeedback}
            onClose={() => setEditingFeedback(null)}
            feedbackId={editingFeedback}
            traineeId={traineeId} // ✅ pass trainee
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
