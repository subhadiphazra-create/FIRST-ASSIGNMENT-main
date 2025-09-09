"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { batchSchema } from "@/schemas/batchSchema";
import { addBatch } from "@/store/trainingSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Batch, Employees } from "@/types/type";
import { SmartSelect } from "../ui/multi-select";

type Props = { employees: Employees };

export default function AppTraineeDialog({ employees }: Props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Batch>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchId: uuidv4(),
      batchTitle: "",
      batchStatus: "planned",
      batchRegion: "",
      batchStartDate: "",
      batchEndDate: "",
      batchMentor: [],
      batchReviewer: [],
      batchTrainer: [],
      batchTrainee: [],
      companyId: "",
      courseDescription: "",
      uploadDate: new Date().toISOString(),
    },
  });

  const onSubmit = (data: Batch) => {
    dispatch(addBatch(data));
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Batch</Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-5xl rounded-2xl h-[90%] overflow-x-auto scroll-bar-hide">
        <DialogHeader>
          <DialogTitle>Create Training Batch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">Batch Title</Label>
              <Input
                {...register("batchTitle")}
                placeholder="Enter batch title"
              />
              {errors.batchTitle && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchTitle.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-3">Company ID</Label>
              <Input
                {...register("companyId")}
                placeholder="Enter company id"
              />
              {errors.companyId && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.companyId.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ✅ Replaced with SmartSelect single select */}
            <div>
              <Label className="mb-3">Status</Label>
              <SmartSelect
                isMultiSelect={false}
                options={[
                  { label: "Planned", value: "planned" },
                  { label: "Active", value: "active" },
                  { label: "Completed", value: "completed" },
                ]}
                value={watch("batchStatus")}
                onChange={(val) =>
                  setValue(
                    "batchStatus",
                    val as "planned" | "active" | "completed",
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    }
                  )
                }
                placeholder="Select status"
              />
              {errors.batchStatus && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchStatus.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-3">Region</Label>
              <Input {...register("batchRegion")} placeholder="Enter region" />
              {errors.batchRegion && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchRegion.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">Start Date</Label>
              <Input type="date" {...register("batchStartDate")} />
              {errors.batchStartDate && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchStartDate.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-3">End Date</Label>
              <Input type="date" {...register("batchEndDate")} />
              {errors.batchEndDate && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchEndDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4-5: SmartSelect (with UUIDs + role filtering) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">Mentors</Label>
              <SmartSelect
                isMultiSelect
                options={employees.map((e) => ({
                  value: e.userId,
                  label: `${e.basicData.firstName} ${e.basicData.lastName}`,
                  role: e.basicData.role,
                }))}
                value={watch("batchMentor")}
                onChange={(val) =>
                  setValue("batchMentor", val as string[], {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder="Select mentors"
                filterKey="role"
                showFilter
                showSearchbar
              />
              {errors.batchMentor && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchMentor.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-3">Reviewers</Label>
              <SmartSelect
                isMultiSelect
                options={employees.map((e) => ({
                  value: e.userId,
                  label: `${e.basicData.firstName} ${e.basicData.lastName}`,
                  role: e.basicData.role,
                }))}
                value={watch("batchReviewer")}
                onChange={(val) =>
                  setValue("batchReviewer", val as string[], {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder="Select reviewers"
                filterKey="role"
                showFilter
                showSearchbar
              />
              {errors.batchReviewer && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchReviewer.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">Trainers</Label>
              <SmartSelect
                isMultiSelect
                options={employees.map((e) => ({
                  value: e.userId,
                  label: `${e.basicData.firstName} ${e.basicData.lastName}`,
                  role: e.basicData.role,
                }))}
                value={watch("batchTrainer")}
                onChange={(val) =>
                  setValue("batchTrainer", val as string[], {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder="Select trainers"
                filterKey="role"
                showFilter
                showSearchbar
              />
              {errors.batchTrainer && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchTrainer.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-3">Trainees</Label>
              <SmartSelect
                isMultiSelect
                options={employees.map((e) => ({
                  value: e.userId,
                  label: `${e.basicData.firstName} ${e.basicData.lastName}`,
                  role: e.basicData.role,
                }))}
                value={watch("batchTrainee")}
                onChange={(val) =>
                  setValue("batchTrainee", val as string[], {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder="Select trainees"
                filterKey="role"
                showFilter
                showSearchbar
              />
              {errors.batchTrainee && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.batchTrainee.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 6 */}
          <div>
            <Label className="mb-3">Course Description</Label>
            <Textarea
              {...register("courseDescription")}
              placeholder="Enter course description"
            />
            {errors.courseDescription && (
              <p className="text-red-500 text-sm mt-2">
                {errors.courseDescription.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Save Batch
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
