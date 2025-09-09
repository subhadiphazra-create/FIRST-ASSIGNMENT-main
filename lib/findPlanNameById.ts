import { TrainingPlan } from "@/types/type";

export const findPlanNameById = (id: string, plans: TrainingPlan[]): string => {
  const plan = plans.find((p) => p.planId === id);
  return plan ? plan.planTitle : "Unknown Plan";
};


export const findPlanStartDateById = (id: string, plans: TrainingPlan[]): string => {
  const plan = plans.find((p) => p.planId === id);
  return plan ? plan.planStartDate : "N/A";
};