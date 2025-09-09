"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { TrainingPlan } from "@/types/type";
import { removePlan } from "@/store/plansSlice";
import ShowTopicDialog from "./batch/ShowTopicDialog";
import AddPlanDialog from "./batch/AddPlanDialog";

type ShowPlanProps = {
  plan: TrainingPlan;
};

export default function ShowPlans({ plan }: ShowPlanProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dispatch = useDispatch();

  const deletePlan = () => {
    dispatch(removePlan({ planId: plan.planId }));
    setConfirmOpen(false);
  };

  const timeAgoText = useTimeAgo(plan.createdAt);

  return (
    <div>
      {/* Card */}
      <Card
        className="w-full cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDetailsOpen(true)}
      >
        <div className="flex items-center justify-between">
          <CardContent>
            <h1 className="text-xl font-bold font-sans text-gray-900 dark:text-gray-100">
              {plan.planTitle}
            </h1>
            <p className="text-sm text-gray-400">{timeAgoText}</p>
          </CardContent>
          <div
            className="pr-4"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
          >
            <Trash2 />
          </div>
        </div>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600">
              Delete Plan?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <b>{plan.planTitle}</b>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deletePlan}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Details Dialog */}
      <AddPlanDialog isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} plan={plan} />
    </div>
  );
}
