import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProfilesAPI } from "../utils/api";

export const fetchProfiles = createAsyncThunk("profiles/fetch", async () => {
  const data = await ProfilesAPI.list();
  return data;
});

export const addProfile = createAsyncThunk("profiles/add", async (payload) => {
  const data = await ProfilesAPI.create(payload);
  return data;
});

const slice = createSlice({
  name: "profiles",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (s) => (s.status = "loading"))
      .addCase(fetchProfiles.fulfilled, (s, a) => {
        s.status = "idle";
        s.items = a.payload;
      })
      .addCase(fetchProfiles.rejected, (s, a) => {
        s.status = "error";
        s.error = a.error.message;
      })
      .addCase(addProfile.fulfilled, (s, a) => {
        s.items.push(a.payload);
      });
  },
});

export default slice.reducer;
