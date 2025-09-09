import { IEvent } from "@/components/calendar/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
  events: IEvent[];
}

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<IEvent>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<IEvent>) => {
      state.events = state.events.map((e) =>
        e.id === action.payload.id ? action.payload : e
      );
    },
    setEvents: (state, action: PayloadAction<IEvent[]>) => {
      state.events = action.payload;
    },
    addEvents: (state, action: PayloadAction<IEvent[]>) => {
      state.events.push(...action.payload);
    },
    removeEventsByPlan: (state, action: PayloadAction<{ planId: string }>) => {
      state.events = state.events.filter(
        (e) => e.planId !== action.payload.planId
      );
    },
  },
});

export const {
  setEvents,
  addEvents,
  addEvent,
  updateEvent,
  removeEventsByPlan,
} = eventsSlice.actions;

export default eventsSlice.reducer;
