"use client";

import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { SmartSelect } from "@/components/ui/multi-select";
import { assignMentorsToFeedback } from "@/store/mentorFeedbacksSlice";
import { RootState } from "@/store";

// ✅ Schema updated with planId + batchId
const assignSchema = z.object({
  feedbackId: z.string().min(1, "Select a feedback"),
  planId: z.string().min(1, "Select a plan"),
  batchId: z.string().min(1, "Batch is required"),
  traineeId: z.array(z.string()).min(1, "Select at least one trainee"),
  trainerId: z.array(z.string()).optional(),
});

export type TAssignForm = z.infer<typeof assignSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employees: any[];
};

export default function AssignMentorsDialog({
  isOpen,
  onClose,
  employees,
}: Props) {
  const dispatch = useDispatch();
  const feedbacks = useSelector(
    (state: RootState) => state.mentorFeedback.feedbacks
  );
  const plans = useSelector((state: RootState) => state.plans.plans);

  const form = useForm<TAssignForm>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      feedbackId: "",
      planId: "",
      batchId: "",
      traineeId: [],
      trainerId: [],
    },
  });

  const onSubmit = (data: TAssignForm) => {
    dispatch(
      assignMentorsToFeedback({
        feedbackId: data.feedbackId,
        planId: data.planId,
        batchId: data.batchId,
        traineeId: data.traineeId,
        trainerId: data.trainerId ?? [],
      })
    );
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full min-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Assign Mentors</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
            {/* Feedback */}
            <FormField
              control={form.control}
              name="feedbackId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <SmartSelect
                      options={feedbacks.map((fb) => ({
                        value: fb.feedbackId,
                        label: fb.feedbackName,
                      }))}
                      value={field.value}
                      onChange={(val) => field.onChange(val as string)}
                      placeholder="Select feedback"
                      showSearchbar
                    />
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
                      onChange={(val) => {
                        const newVal = (val as string) ?? "";
                        field.onChange(newVal);

                        // auto-set batchId
                        const batchId =
                          plans.find((p) => p.planId === newVal)?.batchId || "";
                        form.setValue("batchId", batchId, {
                          shouldValidate: true,
                        });
                      }}
                      placeholder="Select plan"
                      showFilter
                      showSearchbar
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trainees */}
            <FormField
              control={form.control}
              name="traineeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainees</FormLabel>
                  <FormControl>
                    <SmartSelect
                      isMultiSelect
                      options={employees
                        .filter(
                          (e) => e.basicData.role?.toLowerCase() === "trainee"
                        )
                        .map((t) => ({
                          value: t.userId,
                          label: `${t.basicData.firstName} ${t.basicData.lastName}`,
                        }))}
                      value={field.value}
                      onChange={(val) =>
                        field.onChange((val as string[]) ?? [])
                      }
                      placeholder="Select trainees"
                      showSearchbar
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trainers */}
            <FormField
              control={form.control}
              name="trainerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentors</FormLabel>
                  <FormControl>
                    <SmartSelect
                      isMultiSelect
                      options={employees
                        .filter(
                          (e) => e.basicData.role?.toLowerCase() !== "trainee"
                        )
                        .map((t) => ({
                          value: t.userId,
                          label: `${t.basicData.firstName} ${t.basicData.lastName}`,
                          role: t.basicData.role,
                        }))}
                      value={field.value}
                      onChange={(val) =>
                        field.onChange((val as string[]) ?? [])
                      }
                      placeholder="Select mentors"
                      showFilter
                      showSearchbar
                      filterKey="role"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
