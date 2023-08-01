import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface ProgressState {
  branchIndex: number;
  pointIndex: number;
}

const initialState: ProgressState = {
  branchIndex: 0,
  pointIndex: 0,
};

export const incrementProgress = createAsyncThunk("progress/increment", (_, { getState }) => {
  const state: RootState = getState() as RootState;
  const { progress } = state;

  if (state.route.data) {
    if (
      progress.branchIndex < state.route.data.branches.length - 1 &&
      progress.pointIndex === state.route.data.branches[progress.branchIndex].points.length - 1
    ) {
      return { ...progress, branchIndex: progress.branchIndex + 1, pointIndex: 0 };
    } else if (progress.pointIndex < state.route.data.branches[progress.branchIndex].points.length - 1) {
      return { ...progress, pointIndex: progress.pointIndex + 1 };
    }
  }

  return progress;
});

export const decrementProgress = createAsyncThunk("progress/decrement", (_, { getState }) => {
  const state: RootState = getState() as RootState;
  const { progress } = state;

  if (state.route.data) {
    if (progress.branchIndex > 0 && progress.pointIndex === 0) {
      const prevBranchLastPointIndex = state.route.data.branches[progress.branchIndex - 1].points.length - 1;
      return { ...progress, branchIndex: progress.branchIndex - 1, pointIndex: prevBranchLastPointIndex };
    } else if (progress.pointIndex > 0) {
      return { ...progress, pointIndex: progress.pointIndex - 1 };
    }
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
    setProgress: (state, action) => {
      return action.payload;
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
