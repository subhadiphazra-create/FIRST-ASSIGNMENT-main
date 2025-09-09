import { Attendance } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AttendanceState {
  attendances: Attendance[];
}

const initialState: AttendanceState = {
  attendances: [],
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendances: (state, action: PayloadAction<Attendance[]>) => {
      state.attendances = action.payload;
    },
    addAttendance: (state, action: PayloadAction<Attendance>) => {
      state.attendances.push(action.payload);
    },
    updateAttendance: (state, action: PayloadAction<Attendance>) => {
      const idx = state.attendances.findIndex(
        (a) => a.attendanceId === action.payload.attendanceId
      );
      if (idx !== -1) {
        state.attendances[idx] = action.payload;
      }
    },
    removeAttendance: (state, action: PayloadAction<{ id: string }>) => {
      state.attendances = state.attendances.filter(
        (a) => a.attendanceId !== action.payload.id
      );
    },
  },
});

export const {
  setAttendances,
  addAttendance,
  updateAttendance,
  removeAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
