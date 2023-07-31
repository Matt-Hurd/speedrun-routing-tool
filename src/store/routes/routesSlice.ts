// store/routes/routesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Route } from "../../models";

type RoutesState = {
  routes: Record<string, Record<string, Route>>;
  status: "idle" | "loading" | 'succeeded' | "failed";
};

const initialState: RoutesState = {
  routes: {},
  status: "idle",
};

export const loadRoutes = createAsyncThunk("routes/loadRoutes", async (gameId: string) => {
  const response = await fetch(`/assets/${gameId}/routes.json`);
  const routes: Route[] = await response.json();
  return { gameId, routes };
});

export const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRoutes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadRoutes.fulfilled, (state, action: PayloadAction<{ gameId: string; routes: Route[] }>) => {
        state.status = "succeeded";
        const { gameId, routes } = action.payload;
        state.routes[gameId] = routes.reduce((accum, route) => {
          accum[route.id] = route;
          return accum;
        }, {} as Record<string, Route>);
      })
      .addCase(loadRoutes.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectRoutes = (state: RootState) => state.routes.routes;
export const selectRoutesForGame = (state: RootState, gameId: string) => state.routes.routes[gameId] || {};
export const selectRouteById = (state: RootState, gameId: string, routeId: string) =>
  state.routes.routes[gameId]?.[routeId];

export const selectRoutesStatus = (state: RootState) => state.routes.status;

export default routesSlice.reducer;
