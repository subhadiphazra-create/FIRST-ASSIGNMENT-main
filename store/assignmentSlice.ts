import { IAssignment } from "@/components/calendar/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssignmentsState {
  assignments: IAssignment[];
}

const initialState: AssignmentsState = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<IAssignment[]>) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action: PayloadAction<IAssignment>) => {
      state.assignments.push(action.payload);
    },
    updateAssignment: (state, action: PayloadAction<IAssignment>) => {
      const idx = state.assignments.findIndex(
        (a) => a.id === action.payload.id
      );
      if (idx !== -1) {
        state.assignments[idx] = action.payload;
      }
    },
    removeAssignment: (state, action: PayloadAction<{ id: string }>) => {
      state.assignments = state.assignments.filter(
        (a) => a.id !== action.payload.id
      );
    },
  },
});

export const {
  setAssignments,
  addAssignment,
  updateAssignment,
  removeAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
