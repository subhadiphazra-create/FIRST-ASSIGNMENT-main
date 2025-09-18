// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  selectedUserId: string | null;
}

const initialState: UserState = {
  selectedUserId: "all", // default value
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUserId: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const { setSelectedUserId } = userSlice.actions;
export default userSlice.reducer;
