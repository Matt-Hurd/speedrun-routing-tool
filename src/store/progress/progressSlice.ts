// progressSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../";
import { selectRouteById } from "../routes/routesSlice";

interface ProgressState {
  gameId: string;
  routeId: string;
  branchIndex: number;
  pointIndex: number;
}

const initialState: ProgressState = {
  gameId: '',
  routeId: '',
  branchIndex: 0,
  pointIndex: 0,
};

export const incrementProgress = createAsyncThunk(
  "progress/increment",
  (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { routes, progress } = state;

    if (progress.routeId) {
      const route = routes.routes[progress.gameId][progress.routeId];

      if (
        progress.branchIndex < route.branches.length - 1 &&
        progress.pointIndex === route.branches[progress.branchIndex].points.length - 1
      ) {
        // Move to next branch
        return { ...progress, branchIndex: progress.branchIndex + 1, pointIndex: 0 };
      } else if (progress.pointIndex < route.branches[progress.branchIndex].points.length - 1) {
        // Move to next point
        return { ...progress, pointIndex: progress.pointIndex + 1 };
      }
    }

    // If no increment is possible, return the current progress
    return progress;
  }
);

export const decrementProgress = createAsyncThunk(
  "progress/decrement",
  (_, { getState }) => {
    const state: RootState = getState() as RootState;
    const { routes, progress } = state;

    if (progress.routeId) {
      const route = routes.routes[progress.gameId][progress.routeId];

      if (progress.branchIndex > 0 && progress.pointIndex === 0) {
        // Move to previous branch's last point
        const prevBranchLastPointIndex = route.branches[progress.branchIndex - 1].points.length - 1;
        return { ...progress, branchIndex: progress.branchIndex - 1, pointIndex: prevBranchLastPointIndex };
      } else if (progress.pointIndex > 0) {
        // Move to previous point
        return { ...progress, pointIndex: progress.pointIndex - 1 };
      }
    }

    // If no decrement is possible, return the current progress
    return progress;
  }
);

export const incrementSection = createAsyncThunk(
  "section/increment",
  (_, {getState}) => {
    const state: RootState = getState() as RootState;
    const {routes, progress} = state;

    if (progress.routeId) {
      const route = routes.routes[progress.gameId][progress.routeId];

      if (progress.branchIndex < route.branches.length - 1) {
        // Move to next branch
        return {...progress, branchIndex: progress.branchIndex + 1, pointIndex: 0};
      } else if (
        progress.pointIndex < route.branches[progress.branchIndex].points.length - 1
      ) {
        return {...progress, pointIndex: route.branches[progress.branchIndex].points.length - 1};
      }
    }

    // If no increment is possible, return the current progress
    return progress;
  }
);

export const decrementSection = createAsyncThunk(
  "section/decrement",
  (_, {getState}) => {
    const state: RootState = getState() as RootState;
    const {progress} = state;

    if (progress.routeId) {
      if (progress.branchIndex > 0) {
        // Move back to previous branch at first point
        return {...progress, branchIndex: progress.branchIndex - 1, pointIndex: 0};
      } else if (progress.pointIndex > 0) {
        // Move back to first branch at first point
        return {...progress, pointIndex: 0};
      }
    }

    // If no decrement is possible, return the current progress
    return progress;
  }
);

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgress: (state, action) => {
      return action.payload;
    },
    setRouteId: (state, action) => {
      state.routeId = action.payload;
      state.branchIndex = 0;
      state.pointIndex = 0;
    },
    setGameId: (state, action) => {
      state.gameId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(incrementProgress.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(decrementProgress.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(incrementSection.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(decrementSection.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectActivePoint = (state: RootState) => {
  if (!state.progress.routeId || !state.progress.gameId) {
    return null;
  }
  
  const route = selectRouteById(state, state.progress.gameId, state.progress.routeId);
  if (!route) {
    return null;
  }

  return route.branches[state.progress.branchIndex].points[state.progress.pointIndex];
};

export const selectActiveBranch = (state: RootState) => {
  if (!state.progress.routeId || !state.progress.gameId) {
    return null;
  }
  
  const route = selectRouteById(state, state.progress.gameId, state.progress.routeId);
  if (!route) {
    return null;
  }

  return route.branches[state.progress.branchIndex];
};

export const { setProgress, setRouteId, setGameId } = progressSlice.actions;

export const selectProgress = (state: RootState) => state.progress;

export default progressSlice.reducer;
