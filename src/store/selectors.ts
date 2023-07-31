import { RootState } from '.'

export const selectCurrentRoute = (state: RootState) =>
  state.routes.routes[state.progress.gameId][state.progress.routeId];

export const selectCurrentBranch = (state: RootState) => {
  const route = selectCurrentRoute(state);
  return route ? route.branches[state.progress.branchIndex] : null;
};

export const selectCurrentPoint = (state: RootState) => {
  const branch = selectCurrentBranch(state);
  return branch ? branch.points[state.progress.pointIndex] : null;
};