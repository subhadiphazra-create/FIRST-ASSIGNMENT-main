"use client";

import AddPlanDialog from "@/components/main/batch/AddPlanDialog";
import ShowPlans from "@/components/main/ShowPlans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store";
import { TrainingPlan } from "@/types/type";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const EditPlanPage = (props: Props) => {
  const router = useRouter();
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);

  const plans = useSelector((state: RootState) => state.plans.plans);
  const [search, setSearch] = useState("");

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
      <div className="flex flex-col gap-4 overflow-x-auto scroll-bar-hide">
        {filteredPlans?.length === 0 ? (
          <h1>No Data Found</h1>
        ) : (
          filteredPlans?.map((plan, index) => (
            <ShowPlans key={index} plan={plan} />
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
