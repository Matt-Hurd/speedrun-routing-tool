import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import liveSplitService from "../services/LiveSplitWebSocket";

export interface ProgressState {
  branchIndex: number;
  pointIndex: number;
}

const initialState: ProgressState = {
  branchIndex: 0,
  pointIndex: 0,
};

export const incrementProgress = createAsyncThunk("progress/increment", async (_, { getState }) => {
  const state: RootState = getState() as RootState;
  const { progress } = state;
  const liveSplit = liveSplitService;

  if (state.route.data) {
    const point = state.route.data.branches[progress.branchIndex].points[progress.pointIndex];
    const thing = state.route.data.things[point.thingId];
    if (
      liveSplit.isConnected() &&
      ((thing.type === "Shrine" && point.action === "COMPLETE") || thing.type === "Lightroot")
    ) {
      const currentSplitName = await liveSplit.getCurrentSplitName();

      const shrineName = thing.name.replace(" Shrine", "").replace(" Lightroot", "");

      const sanitizedCurrentSplitName = currentSplitName.startsWith("-")
        ? currentSplitName.substring(1)
        : currentSplitName;

      if (sanitizedCurrentSplitName === shrineName) {
        liveSplit.split();
      }
    }

    if (
      progress.branchIndex < state.route.data.branches.length - 1 &&
      progress.pointIndex === state.route.data.branches[progress.branchIndex].points.length - 1
    ) {
      if (liveSplit.isConnected()) {
        const currentSplitName = await liveSplit.getCurrentSplitName();
        if (currentSplitName === state.route.data.branches[progress.branchIndex]?.name) {
          liveSplit.split();
        }
      }
      return { ...progress, branchIndex: progress.branchIndex + 1, pointIndex: 0 };
    } else if (progress.pointIndex < state.route.data.branches[progress.branchIndex].points.length - 1) {
      return { ...progress, pointIndex: progress.pointIndex + 1 };
    }
  }

  return progress;
});

export const decrementProgress = createAsyncThunk("progress/decrement", async (_, { getState }) => {
  const state: RootState = getState() as RootState;
  const { progress } = state;
  const liveSplit = liveSplitService;

  if (state.route.data) {
    let newProgress;
    if (progress.branchIndex > 0 && progress.pointIndex === 0) {
      const prevBranchLastPointIndex = state.route.data.branches[progress.branchIndex - 1].points.length - 1;
      if (liveSplit.isConnected()) {
        const previousSplitName = await liveSplit.getPreviousSplitName();
        if (previousSplitName === state.route.data.branches[progress.branchIndex - 1]?.name) {
          liveSplit.unsplit();
        }
      }
      newProgress = { ...progress, branchIndex: progress.branchIndex - 1, pointIndex: prevBranchLastPointIndex };
    } else if (progress.pointIndex > 0) {
      newProgress = { ...progress, pointIndex: progress.pointIndex - 1 };
    }
    if (newProgress) {
      const point = state.route.data.branches[newProgress.branchIndex].points[newProgress.pointIndex];
      const thing = state.route.data.things[point.thingId];
      if (
        liveSplit.isConnected() &&
        ((thing.type === "Shrine" && point.action === "COMPLETE") || thing.type === "Lightroot")
      ) {
        const previousSplitName = await liveSplit.getPreviousSplitName();
        if (previousSplitName.endsWith(thing.name)) {
          liveSplit.unsplit();
        }
      }
    }

    return newProgress;
  }

  return progress;
});

export const incrementSection = createAsyncThunk("section/increment", (_, { getState }) => {
  const state: RootState = getState() as RootState;
  const { progress } = state;

  if (state.route.data) {
    if (progress.branchIndex < state.route.data.branches.length - 1) {
      return { ...progress, branchIndex: progress.branchIndex + 1, pointIndex: 0 };
    } else if (progress.pointIndex < state.route.data.branches[progress.branchIndex].points.length - 1) {
      return { ...progress, pointIndex: state.route.data.branches[progress.branchIndex].points.length - 1 };
    }
  }

  return progress;
});

export const decrementSection = createAsyncThunk("section/decrement", (_, { getState }) => {
  const state: RootState = getState() as RootState;
  const { progress } = state;

  if (state.route.data) {
    if (progress.branchIndex > 0) {
      return { ...progress, branchIndex: progress.branchIndex - 1, pointIndex: 0 };
    } else if (progress.pointIndex > 0) {
      return { ...progress, pointIndex: 0 };
    }
  }

  return progress;
});

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgress: (_state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(incrementProgress.fulfilled, (_state, action) => {
      return action.payload;
    });
    builder.addCase(decrementProgress.fulfilled, (_state, action) => {
      return action.payload;
    });
    builder.addCase(incrementSection.fulfilled, (_state, action) => {
      return action.payload;
    });
    builder.addCase(decrementSection.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export const selectActivePoint = (state: RootState) => {
  if (!state.route.data) {
    return null;
  }

  return state.route.data.branches[state.progress.branchIndex].points[state.progress.pointIndex];
};

export const selectActiveBranch = (state: RootState) => {
  if (!state.route.data) {
    return null;
  }

  return state.route.data.branches[state.progress.branchIndex];
};

export const { setProgress } = progressSlice.actions;

export const selectProgress = (state: RootState) => state.progress;

export default progressSlice.reducer;
