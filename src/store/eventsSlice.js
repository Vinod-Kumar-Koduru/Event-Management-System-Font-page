import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EventsAPI, LogsAPI } from "../utils/api";

export const fetchEventsForProfile = createAsyncThunk(
  "events/fetchForProfile",
  async (profileId) => {
    if (!profileId) return [];
    const data = await EventsAPI.list(profileId);
    return data;
  }
);

export const createEvent = createAsyncThunk(
  "events/create",
  async (payload) => {
    const data = await EventsAPI.create(payload);
    return data;
  }
);

export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ id, payload }) => {
    const data = await EventsAPI.update(id, payload);
    return data;
  }
);

export const fetchLogs = createAsyncThunk("events/logs", async (eventId) => {
  const data = await LogsAPI.listForEvent(eventId);
  return { eventId, logs: data };
});

const slice = createSlice({
  name: "events",
  initialState: { items: [], status: "idle", error: null, logsByEvent: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsForProfile.pending, (s) => (s.status = "loading"))
      .addCase(fetchEventsForProfile.fulfilled, (s, a) => {
        s.status = "idle";
        s.items = a.payload;
      })
      .addCase(fetchEventsForProfile.rejected, (s, a) => {
        s.status = "error";
        s.error = a.error.message;
      })
      .addCase(createEvent.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateEvent.fulfilled, (s, a) => {
        s.items = s.items.map((it) =>
          it._id === a.payload._id ? a.payload : it
        );
      })
      .addCase(fetchLogs.fulfilled, (s, a) => {
        s.logsByEvent[a.payload.eventId] = a.payload.logs;
      });
  },
});

export default slice.reducer;
