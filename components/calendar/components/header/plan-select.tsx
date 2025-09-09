"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendar } from "../../contexts/calendar-context";

export function PlanSelect() {
  const { selectedPlanId, setSelectedPlanId } = useCalendar();
  const plans = useSelector((state: RootState) => state.plans.plans);

  return (
    <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
      <SelectTrigger className="flex-1 md:w-48">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>

      <SelectContent align="end">
        <SelectItem value="all">All Plans</SelectItem>

        {plans.map((plan) => (
          <SelectItem key={plan.planId} value={plan.planId}>
            {plan.planTitle}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
