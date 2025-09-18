"use client";

import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SmartSelect } from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { assignMentorsToFeedback } from "@/store/mentorFeedbacksSlice";
import { RootState } from "@/store";
import { useParams } from "next/navigation";

// ✅ Schema
const rowSchema = z.object({
  traineeId: z.string().min(1, "Select trainee"),
  trainerIds: z.array(z.string()).min(0),
  planIds: z.array(z.string()).min(1, "Select at least one plan"),
  feedbackId: z.string().min(1, "Select a feedback template"),
  isSelfMentor: z.boolean().default(false),
});

const assignSchema = z.object({
  rows: z.array(rowSchema).min(1, "At least one row is required"),
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
  const batches = useSelector((state: RootState) => state.training.batches);

  const params = useParams();
  const currentBatch = params?.batchId as string;
  console.log(currentBatch);

  // ✅ Find the current batch
  const activeBatch = batches.find((b) => b.batchId === currentBatch);
  console.log(activeBatch);

  // ✅ Take mentors from batchMentor
  const batchMentors = activeBatch?.batchMentor ?? [];

  console.log(batchMentors);

  const form = useForm<TAssignForm>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      rows: employees
        .filter((e) => e.basicData.role?.toLowerCase() === "trainee")
        .map((t) => ({
          traineeId: t.userId,
          trainerIds: [...batchMentors], // ✅ Pre-populated mentors
          planIds: [],
          feedbackId: "",
          isSelfMentor: false,
        })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  const onSubmit = (data: TAssignForm) => {
    data.rows.forEach((row) => {
      const finalTrainerIds = row.isSelfMentor
        ? [...new Set([...row.trainerIds, row.traineeId])]
        : row.trainerIds;

      dispatch(
        assignMentorsToFeedback({
          feedbackId: row.feedbackId,
          planIds: row.planIds,
          traineeId: [row.traineeId],
          trainerId: finalTrainerIds,
        })
      );
    });
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full min-w-[90%] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Assign Mentors</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[15%]">Trainee</TableHead>
                  <TableHead className="w-[30%]">Mentors</TableHead>
                  <TableHead className="w-[30%]">Plans</TableHead>
                  <TableHead className="w-[20%]">Feedback Template</TableHead>
                  <TableHead className="w-[5%]">Self Mentor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const trainee = employees.find(
                    (e) => e.userId === field.traineeId
                  );
                  return (
                    <TableRow key={field.id}>
                      {/* Trainee Column */}
                      <TableCell className="truncate">
                        {trainee
                          ? `${trainee.basicData.firstName} ${trainee.basicData.lastName}`
                          : "Unknown"}
                      </TableCell>

                      {/* Mentors Column */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rows.${index}.trainerIds`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SmartSelect
                                  isMultiSelect
                                  className="w-full"
                                  options={employees
                                    .filter(
                                      (e) =>
                                        e.basicData.role?.toLowerCase() !==
                                        "trainee"
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
                      </TableCell>

                      {/* Plans Column */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rows.${index}.planIds`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SmartSelect
                                  isMultiSelect
                                  className="w-full"
                                  options={plans.map((p) => ({
                                    value: p.planId,
                                    label: p.planTitle,
                                  }))}
                                  value={field.value}
                                  onChange={(val) =>
                                    field.onChange((val as string[]) ?? [])
                                  }
                                  placeholder="Select plans"
                                  showSearchbar
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Feedback Template Column */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rows.${index}.feedbackId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SmartSelect
                                  className="w-full"
                                  options={feedbacks.map((fb) => ({
                                    value: fb.feedbackId,
                                    label: fb.feedbackName,
                                  }))}
                                  value={field.value}
                                  onChange={(val) =>
                                    field.onChange(val as string)
                                  }
                                  placeholder="Select feedback"
                                  showSearchbar
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Self Mentor Switch */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rows.${index}.isSelfMentor`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked)
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

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
