import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import type { TrainingPlan, PlanTopic } from "@/types/type";

interface PlansState {
  plans: TrainingPlan[];
}

const initialState: PlansState = {
  plans: [],
};

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    addPlan: {
      reducer(state, action: PayloadAction<TrainingPlan>) {
        console.log("🔥 addPlan reducer hit:", action.payload);
        state.plans.push(action.payload);
      },
      prepare(
        payload: Omit<TrainingPlan, "planId" | "createdAt"> & {
          planId?: string;
        }
      ) {
        const id = payload.planId ?? nanoid();
        return {
          payload: {
            ...payload,
            planId: id,
            createdAt: new Date().toISOString(),
            updatedAt:new Date().toISOString(),
          } as TrainingPlan,
        };
      },
    },

    updateTopicDescription(
      state,
      action: PayloadAction<{
        planId: string;
        topicId: string;
        topicDescription: string;
      }>
    ) {
      const plan = state.plans.find((p) => p.planId === action.payload.planId);
      if (plan) {
        const topic = plan.planTopics.find(
          (t) => t.topicId === action.payload.topicId
        );
        if (topic) {
          topic.topicDescription = action.payload.topicDescription;
          topic.updatedAt = new Date().toISOString();
        }
      }
    },

    removePlan(state, action: PayloadAction<{ planId: string }>) {
      state.plans = state.plans.filter(
        (p) => p.planId !== action.payload.planId
      );
    },

    addTopicToPlan(
      state,
      action: PayloadAction<{ planId: string; topic: PlanTopic }>
    ) {
      const plan = state.plans.find((p) => p.planId === action.payload.planId);
      if (plan) {
        plan.planTopics.push(action.payload.topic);
      }
    },

    removeTopicFromPlan(
      state,
      action: PayloadAction<{ planId: string; topicId: string }>
    ) {
      const plan = state.plans.find((p) => p.planId === action.payload.planId);
      if (plan) {
        plan.planTopics = plan.planTopics.filter(
          (t) => t.topicId !== action.payload.topicId
        );
      }
    },

    updatePlan(state, action: PayloadAction<TrainingPlan>) {
      // 🔄 Replace whole plan
      const index = state.plans.findIndex(
        (p) => p.planId === action.payload.planId
      );
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },

    updatePlanBy(
      state,
      action: PayloadAction<{
        planId: string;
        updates: Partial<
          Omit<TrainingPlan, "planId" | "createdAt" | "planTopics">
        >;
      }>
    ) {
      // ✏️ Patch specific fields (title, color, dates…)
      const { planId, updates } = action.payload;
      const plan = state.plans.find((p) => p.planId === planId);
      if (plan) {
        Object.assign(plan, updates, {
          updatedAt: new Date().toISOString(),
        });
      }
    },
  },
});

export const {
  addPlan,
  removePlan,
  addTopicToPlan,
  removeTopicFromPlan,
  updatePlanBy,
  updatePlan,
  updateTopicDescription,
} = plansSlice.actions;

export default plansSlice.reducer;
