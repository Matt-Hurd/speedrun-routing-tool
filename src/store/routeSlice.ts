import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route, Thing } from "../models";
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
  let split = url.split("/");
  data.url = split.slice(0, split.length - 1).join("/") + "/";
  return data;
}

export const loadRoute = createAsyncThunk<Route, string, { dispatch: AppDispatch }>(
  "route/load",
  async (routeUrl, thunkAPI) => {
    const response = await fetchFromUrl(routeUrl);
    return response;
  },
);

const convertPayloadToRoute = (payload: any) => {
  let newThings: Record<string, Record<string, Thing>> = {};
  payload.things.forEach((thing: Thing) => {
    if (!newThings[thing.layerId]) {
      newThings[thing.layerId] = {};
    }
    newThings[thing.layerId][thing.id] = thing;
  });

  payload.things = newThings;
  return payload;
};

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
        state.data = convertPayloadToRoute(action.payload);
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
