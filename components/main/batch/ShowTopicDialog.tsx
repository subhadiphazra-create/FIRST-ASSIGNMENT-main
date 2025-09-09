"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "@reduxjs/toolkit";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { topicSchema, TTopicForm } from "@/schemas/topic-schema";
import { SmartSelect } from "@/components/ui/multi-select";
import { FileUpload } from "@/components/ui/handle-file";
import { PlanTopic } from "@/types/type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (topic: PlanTopic) => void;
  topicToEdit?: PlanTopic | null;
}

export default function ShowTopicDialog({
  isOpen,
  onClose,
  onAddTopic,
  topicToEdit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TTopicForm>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      topicTitle: "",
      topicDescription: "",
      topicDuration: "days",
      topicDurationValue: 1,
    },
  });

  const [resources, setResources] = useState<File[]>([]);

  // 🟢 Prefill values if editing
  useEffect(() => {
    if (topicToEdit) {
      reset({
        topicTitle: topicToEdit.topicTitle,
        topicDescription: topicToEdit.topicDescription,
        topicDuration: topicToEdit.topicDuration,
        topicDurationValue: topicToEdit.topicDurationValue,
      });

      setResources(
        topicToEdit.topicResources?.map((r) => {
          // convert back into File if needed
          return new File([], r.name, { type: r.type });
        }) || []
      );
    }
  }, [topicToEdit, reset]);

  const onSubmit = (values: TTopicForm) => {
    const mappedResources =
      resources.length > 0
        ? resources.map((f) => ({
            id: nanoid(),
            name: f.name,
            size: f.size,
            type: f.type,
          }))
        : topicToEdit?.topicResources || [];

    const newTopic: PlanTopic = {
      topicId: topicToEdit ? topicToEdit.topicId : nanoid(),
      topicTitle: values.topicTitle,
      topicDescription: values.topicDescription,
      topicDurationValue: values.topicDurationValue,
      topicDuration: values.topicDuration,
      topicResources: mappedResources,
    };

    onAddTopic(newTopic);

    reset();
    setResources([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>{topicToEdit ? "Edit Topic" : "Add Topic"}</DialogTitle>
        </DialogHeader>

        <form
          id="topic-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Topic Name</label>
            <Input placeholder="Enter topic name" {...register("topicTitle")} />
            {errors.topicTitle && (
              <p className="text-red-500 text-xs">
                {errors.topicTitle.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="flex gap-2">
            <div>
              <label className="block text-sm font-medium">
                Duration (value)
              </label>
              <Input
                type="number"
                min={1}
                {...register("topicDurationValue", { valueAsNumber: true })}
              />
              {errors.topicDurationValue && (
                <p className="text-red-500 text-xs">
                  {errors.topicDurationValue.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Duration (unit)
              </label>
              <SmartSelect
                options={[
                  { value: "days", label: "Days" },
                  { value: "weeks", label: "Weeks" },
                  { value: "months", label: "Months" },
                ]}
                value={watch("topicDuration")}
                onChange={(val) =>
                  setValue("topicDuration", val as "days" | "weeks" | "months")
                }
                placeholder="Select duration"
              />
              {errors.topicDuration && (
                <p className="text-red-500 text-xs">
                  {errors.topicDuration.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter description"
              {...register("topicDescription")}
            />
            {errors.topicDescription && (
              <p className="text-red-500 text-xs">
                {errors.topicDescription.message}
              </p>
            )}
          </div>

          {/* File Upload */}
          <FileUpload onFiles={setResources} />
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="topic-form" type="submit">
            {topicToEdit ? "Update Topic" : "Add Topic"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
