import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route } from "../models";
import { AppDispatch, RootState } from ".";

interface RouteState {
  status: "idle" | "loading" | "succeeded" | "failed";
  data: Route | null;
  error: string | undefined;
}

const initialState: RouteState = {
  status: "idle",
  data: null,
  error: undefined,
};

async function fetchFromUrl(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const split = url.split("/");
  data.url = split.slice(0, split.length - 1).join("/") + "/";
  return data;
}

export const loadRoute = createAsyncThunk<Route, string, { dispatch: AppDispatch }>("route/load", async (routeUrl) => {
  const response = await fetchFromUrl(routeUrl);
  return response;
});

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRoute.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadRoute.fulfilled, (state, action: PayloadAction<Route>) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loadRoute.rejected, (state, action) => {
        state.status = "failed";
        state.data = null;
        state.error = action.error.message;
      });
  },
});

export const selectRouteStatus = (state: RootState) => state.route.status;
export const selectRouteData = (state: RootState) => state.route.data;
export const selectRouteError = (state: RootState) => state.route.error;

export default routeSlice.reducer;
