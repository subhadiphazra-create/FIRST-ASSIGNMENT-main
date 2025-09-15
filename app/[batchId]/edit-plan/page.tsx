"use client";

import AddPlanDialog from "@/components/main/batch/AddPlanDialog";
import ShowCards from "@/components/main/ShowCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store";
import { removePlan } from "@/store/plansSlice";
import { TrainingPlan } from "@/types/type";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

const EditPlanPage = (props: Props) => {
  const router = useRouter();
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);

  const plans = useSelector((state: RootState) => state.plans.plans);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const filteredPlans = plans?.filter((plan: TrainingPlan) =>
    plan.planTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        className="flex w-fit items-center justify-start gap-3 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft width={18} height={18} />
        <p className="text-xl font-medium">Back</p>
      </div>

      <div className="flex items-center gap-4 mt-4 w-full">
        <Input
          type="text"
          placeholder="Search plans..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 md:w-[75%]"
        />
        <Button onClick={() => setShowAddPlanDialog(true)}>
          <CirclePlus size={16} />
          Add Training Plan
        </Button>
      </div>

      <div className="my-3">
        <h1 className="text-xl font-semibold">All Plans</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredPlans?.length === 0 ? (
          <h1>No Data Found</h1>
        ) : (
          filteredPlans?.map((plan, index) => (
            <ShowCards
              cardFor="Plan"
              key={index}
              id={plan.planId}
              title={plan.planTitle}
              createdAt={plan.createdAt}
              onDelete={(id) => dispatch(removePlan({ planId: id }))}
              confirmTitle="Delete Plan?"
              extraContent={(
                isOpen: boolean,
                onClose: (open: boolean) => void
              ) => (
                <AddPlanDialog
                  isOpen={isOpen}
                  onClose={() => onClose(false)}
                  plan={plan}
                />
              )}
            />
          ))
        )}
      </div>
      {/* Training Plan Dialog */}
      {showAddPlanDialog && (
        <AddPlanDialog
          isOpen={showAddPlanDialog}
          onClose={() => setShowAddPlanDialog(false)}
        />
      )}
    </div>
  );
};

export default EditPlanPage;
