"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addMentorFeedback, updateMentorFeedback } from "@/store/mentorFeedbacksSlice";
import { feedbackSchema, TFeedbackForm } from "@/schemas/feedbackSchema";
import { TrainingPlan } from "@/types/type";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import AddFeedbackFormat, { TFeedbackDetailsForm } from "./AddFeedbackFormat";
import { SmartSelect } from "@/components/ui/multi-select";
import FeedbackDiscussionsAccordion from "./FeedbackDiscussionsAccordion";
import ConfirmDialog from "./ConfirmDialog";


export interface FeedbackDiscussionLocal {
  id: string;
  category: string;
  subCategory: string;
}

type Props = {
  plans: TrainingPlan[];
  feedback?: TFeedbackForm;
  mode?: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
};

export default function AddFeedbackDialog({
  feedback,
  mode = "create",
  isOpen,
  onClose,
}: Props) {
  const dispatch = useDispatch();

  const [discussions, setDiscussions] = useState<FeedbackDiscussionLocal[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState<FeedbackDiscussionLocal | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{ type: "category" | "discussion"; id: string } | null>(null);

  const form = useForm<TFeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedbackId: uuidv4(),
      feedbackName: "",
      status: "Inactive",
      traineeId: [],
      trainerId: [],
      feedbackDetails: undefined,
      feedbackDiscussions: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (feedback && mode === "edit") {
      form.reset(feedback);
      setDiscussions(
        (feedback.feedbackDiscussions || []).map((d) => ({
          id: d.id,
          category: d.category,
          subCategory: d.subCategory,
        }))
      );
    }
  }, [feedback, mode, form]);

  const onSubmit = (data: TFeedbackForm) => {
    const payload: TFeedbackForm = {
      ...data,
      feedbackDiscussions: discussions.map((d, idx) => ({
        id: d.id,
        index: idx,
        category: d.category,
        subCategory: d.subCategory,
      })),
      updatedAt: new Date().toISOString(),
    };

    if (mode === "create") {
      dispatch(addMentorFeedback(payload));
    } else {
      dispatch(updateMentorFeedback({ feedbackId: data.feedbackId, data: payload }));
    }

    onClose();
    setDiscussions([]);
    form.reset({
      feedbackId: uuidv4(),
      feedbackName: "",
      status: "Inactive",
      feedbackDetails: undefined,
      feedbackDiscussions: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  };

  // ---- Discussion Handlers ----
  const handleAddDiscussion = (details: TFeedbackDetailsForm) => {
    setDiscussions((prev) => [
      ...prev,
      { id: uuidv4(), category: details.feedbackCategory, subCategory: details.feedbackSubCategory },
    ]);
    setDialogOpen(false);
  };

  const handleUpdateDiscussion = (details: TFeedbackDetailsForm) => {
    if (editingDiscussion) {
      // update subcategory
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === editingDiscussion.id
            ? { ...d, category: details.feedbackCategory, subCategory: details.feedbackSubCategory }
            : d
        )
      );
    }
    if (editingCategory) {
      // update category name only
      setDiscussions((prev) =>
        prev.map((d) =>
          d.category === editingCategory ? { ...d, category: details.feedbackCategory } : d
        )
      );
    }
    setEditingDiscussion(null);
    setEditingCategory(null);
    setDialogOpen(false);
  };

  const confirmRemove = () => {
    if (pendingRemove) {
      if (pendingRemove.type === "discussion") {
        setDiscussions((prev) => prev.filter((d) => d.id !== pendingRemove.id));
      } else {
        setDiscussions((prev) => prev.filter((d) => d.category !== pendingRemove.id));
      }
    }
    setConfirmOpen(false);
    setPendingRemove(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full md:min-w-4xl rounded-2xl max-h-[90%] overflow-y-auto scroll-bar-hide">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Feedback" : "Edit Feedback"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Feedback Name + Status */}
            <div className="grid gap-4 md:grid-cols-2">
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <SmartSelect
                        options={[
                          { value: "Active", label: "Active" },
                          { value: "Inactive", label: "Inactive" },
                        ]}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        placeholder="Choose status"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Discussions Accordion */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Feedback Discussions</h3>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingDiscussion(null);
                    setEditingCategory(null);
                    setDialogOpen(true);
                  }}
                >
                  Add Discussion
                </Button>
              </div>

              <FeedbackDiscussionsAccordion
                discussions={discussions}
                onEditCategory={(category) => {
                  setEditingCategory(category);
                  setEditingDiscussion(null);
                  setDialogOpen(true);
                }}
                onRemoveCategory={(category) => {
                  setPendingRemove({ type: "category", id: category });
                  setConfirmOpen(true);
                }}
                onEditSubCategory={(d) => {
                  setEditingDiscussion(d);
                  setEditingCategory(null);
                  setDialogOpen(true);
                }}
                onRemoveSubCategory={(id) => {
                  setPendingRemove({ type: "discussion", id });
                  setConfirmOpen(true);
                }}
              />
            </div>

            <Button type="submit" className="w-full">
              {mode === "create" ? "Save Feedback" : "Update Feedback"}
            </Button>
          </form>
        </Form>

        {/* Add/Edit Discussion Dialog */}
        {dialogOpen && (
          <AddFeedbackFormat
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            existingCategories={[...new Set(discussions.map((d) => d.category))]}
            initialData={
              editingDiscussion
                ? { feedbackCategory: editingDiscussion.category, feedbackSubCategory: editingDiscussion.subCategory }
                : editingCategory
                ? { feedbackCategory: editingCategory, feedbackSubCategory: "" }
                : undefined
            }
            onlyEditCategory={!!editingCategory} // ✅ pass prop
            onSave={editingDiscussion || editingCategory ? handleUpdateDiscussion : handleAddDiscussion}
          />
        )}

        {/* Confirm remove dialog */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={confirmRemove}
          title="Remove item"
          description="Are you sure you want to remove this? This action cannot be undone."
        />
      </DialogContent>
    </Dialog>
  );
}
