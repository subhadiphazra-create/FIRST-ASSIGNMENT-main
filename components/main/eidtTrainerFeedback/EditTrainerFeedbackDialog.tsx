"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { FeedbackDiscussion } from "@/types/type";
import { updateTraineeDiscussionScore } from "@/store/mentorFeedbacksSlice";
import { feedbackFormSchema, TFeedbackFormValues } from "@/schemas/addFeedbacks";

interface EditFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackId: string;
  traineeId?: string;
}

export default function EditFeedbackDialog({
  isOpen,
  onClose,
  feedbackId,
  traineeId,
}: EditFeedbackDialogProps) {
  const dispatch = useDispatch();
  const feedback = useSelector((state: RootState) =>
    state.mentorFeedback.feedbacks.find((f) => f.feedbackId === feedbackId)
  );

  const form = useForm<TFeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedbackId,
      feedbackName: feedback?.feedbackName ?? "",
      feedbackDiscussions:
        feedback?.feedbackDiscussions?.map((d) => ({
          id: d.id,
          category: d.category,
          subCategory: d.subCategory,
          highestMarks: d.highestMarks ?? 0,
          traineeDiscussions: [
            {
              traineeId: traineeId ?? "",
              obtainedMarks:
                d.traineeDiscussions?.find((t) => t.traineeId === traineeId)
                  ?.obtainedMarks ?? null,
              remarks:
                d.traineeDiscussions?.find((t) => t.traineeId === traineeId)
                  ?.remarks ?? "",
            },
          ],
        })) || [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "feedbackDiscussions",
  });

  const discussionsByCategory: Record<string, FeedbackDiscussion[]> =
    feedback?.feedbackDiscussions?.reduce((acc, d) => {
      acc[d.category] = acc[d.category] || [];
      acc[d.category].push(d);
      return acc;
    }, {} as Record<string, FeedbackDiscussion[]>) ?? {};

  const onSubmit = (data: TFeedbackFormValues) => {
    data.feedbackDiscussions?.forEach((disc) => {
      const trainee = disc.traineeDiscussions?.[0];
      if (trainee) {
        dispatch(
          updateTraineeDiscussionScore({
            feedbackId,
            discussionId: disc.id,
            traineeId: trainee.traineeId,
            obtainedMarks: trainee.obtainedMarks ?? null,
            remarks: trainee.remarks ?? "",
          })
        );
      }
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Feedback: {feedback?.feedbackName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {fields.map((item, idx) => (
              <AccordionItem key={item.id} value={item.category}>
                <AccordionTrigger>{item.category}</AccordionTrigger>
                <AccordionContent>
                  <div className="border rounded p-4 mb-3">
                    <h4 className="font-medium mb-2">{item.subCategory}</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {/* ✅ editable highest marks */}
                      <Input
                        type="number"
                        placeholder="Highest Marks"
                        {...form.register(
                          `feedbackDiscussions.${idx}.highestMarks`,
                          { valueAsNumber: true }
                        )}
                      />

                      {/* obtained marks for this trainee */}
                      <Input
                        type="number"
                        placeholder="Obtained Marks"
                        {...form.register(
                          `feedbackDiscussions.${idx}.traineeDiscussions.0.obtainedMarks`,
                          { valueAsNumber: true }
                        )}
                      />

                      {/* remarks for this trainee */}
                      <Input
                        placeholder="Remarks"
                        {...form.register(
                          `feedbackDiscussions.${idx}.traineeDiscussions.0.remarks`
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
