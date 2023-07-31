import React, { useRef, useEffect } from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import { getIconForThing } from "./utilities";
import { Thing, Branch } from "../../models";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectThingsForGame } from "../../store/things/thingsSlice";
import { selectProgress } from "../../store/progress/progressSlice";

import './popup.css';

interface RouteMarkersProps {
  branch: Branch;
  activeThing: Thing;
}

export const RouteMarkers: React.FC<RouteMarkersProps> = ({
  branch,
  activeThing,
}) => {
  const progress = useSelector(selectProgress);
  const hideCompletedMarkers = useSelector((state: RootState) => state.userPreferences.hideCompletedMarkers);

  const { gameId, pointIndex} = progress;
  const markerRefs = useRef(new Map());
  const things = useSelector((state: RootState) =>
    selectThingsForGame(state, gameId)
  );

  useEffect(() => {
    if (activeThing && markerRefs.current.has(activeThing.id)) {
      markerRefs.current.get(activeThing.id).openPopup();
    }
  }, [activeThing]);

  return (
    <LayerGroup>
      {branch.points.slice(hideCompletedMarkers ? pointIndex : 0)
        .map((point, index) => (
          <Marker
            key={index}
            opacity={things[point.thingId].layerId === activeThing.layerId ? 1 : 0}
            position={[
              -things[point.thingId].coordinates.x,
              things[point.thingId].coordinates.y,
            ]}
            icon={getIconForThing(things[point.thingId])}
            ref={(ref) => markerRefs.current.set(point.thingId, ref)}
          >
            <Popup>{things[point.thingId].name}</Popup>
          </Marker>
        ))}
    </LayerGroup>
  );
};
