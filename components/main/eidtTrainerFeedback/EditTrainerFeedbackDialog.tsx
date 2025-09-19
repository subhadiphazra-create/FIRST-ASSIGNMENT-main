"use client";

import React, { useEffect } from "react";
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
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateTraineeDiscussionScore } from "@/store/mentorFeedbacksSlice";

const editDiscussionSchema = z
  .object({
    id: z.string(),
    subCategory: z.string().optional(),
    category: z.string().optional(),

    highestMarks: z
      .number({ invalid_type_error: "Highest marks must be a number" })
      .min(1, "Highest marks must be at least 1")
      .nullable()
      .optional(),

    obtainedMarks: z
      .number({ invalid_type_error: "Obtained marks must be a number" })
      .min(0, "Obtained marks cannot be less than 0")
      .nullable()
      .optional(),

    remarks: z.string().optional(),
    updatedBy: z.string().optional(),
  })
  .refine(
    (data) =>
      data.highestMarks == null || data.obtainedMarks == null
        ? true
        : data.obtainedMarks <= data.highestMarks,
    {
      message: "Obtained marks cannot be greater than highest marks",
      path: ["obtainedMarks"],
    }
  );

const editFeedbackFormSchema = z.object({
  feedbackId: z.string(),
  feedbackDiscussions: z.array(editDiscussionSchema),
});

export type TEditFeedbackFormValues = z.infer<typeof editFeedbackFormSchema>;

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

  const currentUserId = useSelector(
    (state: RootState) => state.users.selectedUserId
  );

  const feedback = useSelector((state: RootState) =>
    state.mentorFeedback.feedbacks.find((f) => f.feedbackId === feedbackId)
  );

  // 🔒 Check mentor access
  const hasAccess =
    feedback?.trainerId?.includes(currentUserId) ||
    feedback?.mentorId?.includes(currentUserId);

  const form = useForm<TEditFeedbackFormValues>({
    resolver: zodResolver(editFeedbackFormSchema),
    mode: "onSubmit",
    defaultValues: {
      feedbackId,
      feedbackDiscussions: [],
    },
  });

  const { control, register, handleSubmit, reset, formState } = form;
  const { isSubmitting } = formState;

  const { fields } = useFieldArray({
    control,
    name: "feedbackDiscussions",
    keyName: "fieldId",
  });

  // 🔄 Reset form when feedback/trainee changes
  useEffect(() => {
    if (!feedback) {
      reset({
        feedbackId,
        feedbackDiscussions: [],
      });
      return;
    }

    const mapped = (feedback.feedbackDiscussions ?? []).map((d) => {
      // only get discussions made by THIS mentor
      const traineeDiscussion = d.traineeDiscussions?.find(
        (t) =>
          t.traineeId === traineeId && t.updatedBy === currentUserId // 🔑 filter by mentor
      );

      return {
        id: d.id,
        category: d.category,
        subCategory: d.subCategory,
        highestMarks: d.highestMarks ?? 5,
        obtainedMarks:
          traineeDiscussion?.obtainedMarks !== undefined
            ? traineeDiscussion?.obtainedMarks
            : null,
        remarks: traineeDiscussion?.remarks ?? "",
        updatedBy: currentUserId,
      };
    });

    reset({
      feedbackId,
      feedbackDiscussions: mapped,
    });
  }, [feedbackId, feedback, traineeId, reset, currentUserId]);

  // ✅ Submit handler
  const onSubmit = (data: TEditFeedbackFormValues) => {
    if (!data.feedbackDiscussions) {
      onClose();
      return;
    }

    data.feedbackDiscussions.forEach((disc) => {
      dispatch(
        updateTraineeDiscussionScore({
          feedbackId: data.feedbackId,
          discussionId: disc.id,
          traineeId: traineeId || "",
          obtainedMarks:
            disc.obtainedMarks === undefined ? null : disc.obtainedMarks,
          remarks: disc.remarks ?? "",
          highestMarks:
            disc.highestMarks === undefined ? null : disc.highestMarks,
          updatedBy: currentUserId, // 🔑 always set current mentor
        })
      );
    });

    onClose();
  };

  if (!hasAccess) {
    return null; // 🚫 no dialog for unauthorized mentors
  }

  // ✅ Group fields by category (for UI only)
  const grouped: Record<string, typeof fields> = {};
  fields.forEach((f, idx) => {
    const cat = f.category ?? "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ ...f, index: idx });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Feedback: {feedback?.feedbackName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {Object.entries(grouped).length === 0 ? (
              <p className="text-gray-500 px-4">No discussions found.</p>
            ) : (
              Object.entries(grouped).map(([category, groupFields]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger>{category}</AccordionTrigger>
                  <AccordionContent>
                    {groupFields.map((field) => {
                      const pathBase =
                        `feedbackDiscussions.${field.index}` as const;

                      return (
                        <div
                          key={field.fieldId}
                          className="border rounded p-4 mb-3"
                        >
                          <h4 className="font-medium mb-2">
                            {field.subCategory}
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            {/* Highest Marks */}
                            <div>
                              <Input
                                type="number"
                                placeholder="Highest Marks"
                                {...register(`${pathBase}.highestMarks`, {
                                  valueAsNumber: true,
                                })}
                              />
                              {formState.errors.feedbackDiscussions?.[
                                field.index
                              ]?.highestMarks && (
                                <p className="text-red-500 text-sm">
                                  {
                                    formState.errors.feedbackDiscussions[
                                      field.index
                                    ]?.highestMarks?.message
                                  }
                                </p>
                              )}
                            </div>

                            {/* Obtained Marks */}
                            <div>
                              <Input
                                type="number"
                                placeholder="Obtained Marks"
                                {...register(`${pathBase}.obtainedMarks`, {
                                  valueAsNumber: true,
                                })}
                              />
                              {formState.errors.feedbackDiscussions?.[
                                field.index
                              ]?.obtainedMarks && (
                                <p className="text-red-500 text-sm">
                                  {
                                    formState.errors.feedbackDiscussions[
                                      field.index
                                    ]?.obtainedMarks?.message
                                  }
                                </p>
                              )}
                            </div>

                            {/* Remarks */}
                            <Input
                              placeholder="Remarks"
                              {...register(`${pathBase}.remarks`)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
