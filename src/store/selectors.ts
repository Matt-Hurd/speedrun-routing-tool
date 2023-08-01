import { RootState } from ".";

export const selectCurrentBranch = (state: RootState) => {
  return state.route.data ? state.route.data.branches[state.progress.branchIndex] : null;
};

export const selectCurrentPoint = (state: RootState) => {
  const branch = selectCurrentBranch(state);
  return branch ? branch.points[state.progress.pointIndex] : null;
};
