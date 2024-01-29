import React from "react";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import { RootState } from "../../store";
import PolylineWithArrow from "./PolylineWithArrow";
import { selectRouteData } from "../../store/routeSlice";
import { convertPoint3DTo2D } from "./projectionUtils";

const RouteLines: React.FC = () => {
  const progress = useSelector(selectProgress);
  const hideCompletedMarkers = useSelector((state: RootState) => state.userPreferences.hideCompletedMarkers);
  const { branchIndex, pointIndex } = progress;
  const route = useSelector(selectRouteData);

  if (!route) return null;

  const point = route.branches[branchIndex].points[pointIndex];
  const thing = route.things[point.thingId];
  const visibleLayerId = thing.layerId;

  const polylines = [];
  let lastLayerId = null;
  let lastPosition = null;

  if (branchIndex > 0 && pointIndex === 0) {
    const previousBranch = route.branches[branchIndex - 1];
    const lastPointOfPreviousBranch = previousBranch.points[previousBranch.points.length - 1];
    const lastThingOfPreviousBranch = route.things[lastPointOfPreviousBranch.thingId];
    if (lastThingOfPreviousBranch) {
      lastLayerId = lastThingOfPreviousBranch.layerId;
      lastPosition = [-lastThingOfPreviousBranch.coordinates.x, lastThingOfPreviousBranch.coordinates.y];
    }
  }

  const activeBranch = route.branches[branchIndex];

  for (let i = hideCompletedMarkers ? Math.max(0, pointIndex - 1) : 0; i < activeBranch.points.length; i++) {
    const point = activeBranch.points[i];
    const thing = route.things[point.thingId];
    if (!thing) continue;

    if (i === 0 && lastLayerId === null) {
      lastLayerId = thing.layerId;
    }

    const layer = route.game.layers[thing.layerId];
    if ((thing.layerId === visibleLayerId || lastLayerId === visibleLayerId) && lastPosition !== null && (!layer.rotation || thing.layerId === lastLayerId)) {
      let position = [-thing.coordinates.x, thing.coordinates.y];
      if (layer.rotation) {
        const converted = convertPoint3DTo2D(thing.coordinates, layer);
        position = [converted.x, converted.y];
      }
      polylines.push(
        <PolylineWithArrow
          key={`polyline-${polylines.length}`}
          positions={[lastPosition, position]}
          color="blue"
          warp={point.action === "WARP"}
        />
      );
    }

    if (layer.rotation) {
      const converted = convertPoint3DTo2D(thing.coordinates, layer);
      lastPosition = [converted.x, converted.y];
    } else {
      lastPosition = [-thing.coordinates.x, thing.coordinates.y];
    }
    lastLayerId = thing.layerId;
  }

  if (branchIndex < route.branches.length - 1) {
    const nextBranch = route.branches[branchIndex + 1];
    const firstPointOfNextBranch = nextBranch.points[0];
    const firstThingOfNextBranch = route.things[firstPointOfNextBranch.thingId];
    if (firstThingOfNextBranch) {
      if (firstThingOfNextBranch.layerId === visibleLayerId && lastPosition !== null) {
        const position = [-firstThingOfNextBranch.coordinates.x, firstThingOfNextBranch.coordinates.y];
        polylines.push(
          <PolylineWithArrow
            key={`polyline-${polylines.length}`}
            positions={[lastPosition, position]}
            color="blue"
            warp={firstPointOfNextBranch.action === "WARP"}
          />,
        );
      }
    }
  }

  return <>{polylines}</>;
};

export default RouteLines;
