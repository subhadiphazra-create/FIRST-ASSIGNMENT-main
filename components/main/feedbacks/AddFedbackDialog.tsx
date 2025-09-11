"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { feedbackSchema, TFeedbackForm } from "@/schemas/feedbackSchema";
import { Employees, TrainingPlan } from "@/types/type";
import { addMentorFeedback } from "@/store/mentorFeedbacksSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SmartSelect } from "@/components/ui/multi-select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import AddFeedbackFormat, {
  TFeedbackDetailsForm,
} from "./AddFeedbackFormat";

// ----------------- Types -----------------
interface FeedbackDiscussion {
  id: string;
  category: string;
  subCategory: string;
}

type Props = {
  employees: Employees;
  plans: TrainingPlan[];
};

// ----------------- Component -----------------
export default function AddFeedbackDialog({ employees, plans }: Props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // Local state for discussions
  const [discussions, setDiscussions] = useState<FeedbackDiscussion[]>([]);

  const form = useForm<TFeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedbackId: uuidv4(),
      feedbackName: "",
      planId: "",
      batchId: "",
      topicId: "",
      traineeId: [],
      trainerId: [],
      feedbackDetails: undefined,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  });

  const selectedPlanId = form.watch("planId");
  const selectedPlan = plans.find((p) => p.planId === selectedPlanId);

  const onSubmit = (data: TFeedbackForm) => {
    dispatch(
      addMentorFeedback({
        ...data,
        feedbackDiscussions: discussions.map((d, idx) => ({
          ...d,
          index: idx,
        })),
      })
    );
    setOpen(false);
    setDiscussions([]);
    form.reset();
  };

  const handleAddDiscussion = (details: TFeedbackDetailsForm) => {
    setDiscussions((prev) => [
      ...prev,
      { id: uuidv4(), category: details.feedbackCategory, subCategory: details.feedbackSubCategory },
    ]);
  };

  const handleRemoveDiscussion = (id: string) => {
    setDiscussions((prev) => prev.filter((d) => d.id !== id));
  };

  // ----------------- Render -----------------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Feedback</Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-4xl rounded-2xl max-h-[90%] overflow-y-auto scroll-bar-hide">
        <DialogHeader>
          <DialogTitle>Create Feedback</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Feedback Name */}
            <FormField
              control={form.control}
              name="feedbackName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter feedback name" {...field} />
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

            {/* Topic */}
            {selectedPlan && (
              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <SmartSelect
                        isMultiSelect={false}
                        options={selectedPlan.planTopics.map((t) => ({
                          value: t.topicId,
                          label: t.topicTitle,
                        }))}
                        value={field.value}
                        onChange={(val) =>
                          field.onChange((val as string) ?? "")
                        }
                        placeholder="Select topic"
                        showFilter
                        showSearchbar
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                          (e) => e.basicData.role.toLowerCase() === "trainee"
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
                  <FormLabel>Trainers / Others</FormLabel>
                  <FormControl>
                    <SmartSelect
                      isMultiSelect
                      options={employees
                        .filter(
                          (e) => e.basicData.role.toLowerCase() !== "trainee"
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
                      placeholder="Select trainers"
                      showFilter
                      showSearchbar
                      filterKey="role"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discussions */}
            <div>
              <AddFeedbackFormat onSave={handleAddDiscussion} />

              <h3 className="font-semibold mt-4 mb-2">Feedback Discussions</h3>
              {discussions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No discussions added yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discussions.map((d, idx) => (
                      <TableRow key={d.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{d.category}</TableCell>
                        <TableCell>{d.subCategory}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveDiscussion(d.id)}
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

            <Button type="submit" className="w-full">
              Save Feedback
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
