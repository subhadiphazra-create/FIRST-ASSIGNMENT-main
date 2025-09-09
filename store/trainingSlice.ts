import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Batch } from "@/types/type";

interface TrainingState {
  batches: Batch[];
}

const loadFromLocalStorage = (): Batch[] => {
  try {
    const data = localStorage.getItem("batches");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (batches: Batch[]) => {
  localStorage.setItem("batches", JSON.stringify(batches));
};

const initialState: TrainingState = {
  batches: typeof window !== "undefined" ? loadFromLocalStorage() : [],
};

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    addBatch: (state, action: PayloadAction<Batch>) => {
      state.batches.push(action.payload);
      saveToLocalStorage(state.batches);
    },
    removeBatch: (state, action: PayloadAction<string>) => {
      state.batches = state.batches.filter(
        (b) => b.batchId !== action.payload
      );
      saveToLocalStorage(state.batches);
    },
  },
});

export const { addBatch, removeBatch } = trainingSlice.actions;
export default trainingSlice.reducer;
