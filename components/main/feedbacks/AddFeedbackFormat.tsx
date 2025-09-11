"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const feedbackDetailsSchema = z.object({
  feedbackCategory: z.string().min(1, "Category is required"),
  feedbackSubCategory: z.string().min(1, "Sub-category is required"),
});

export type TFeedbackDetailsForm = z.infer<typeof feedbackDetailsSchema>;

type Props = {
  onSave: (details: TFeedbackDetailsForm) => void;
};

export default function AddFeedbackFormat({ onSave }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<TFeedbackDetailsForm>({
    resolver: zodResolver(feedbackDetailsSchema),
    defaultValues: {
      feedbackCategory: "",
      feedbackSubCategory: "",
    },
  });

  const onSubmit = (data: TFeedbackDetailsForm) => {
    onSave(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Discussion</Button>
      </DialogTrigger>
      <DialogContent className="w-full md:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Feedback Discussion</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="feedbackCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedbackSubCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sub-category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save Discussion
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
