import React, { useRef, useEffect } from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import { Thing, Branch } from "../../models";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectProgress } from "../../store/progressSlice";

import "./popup.css";
import { selectRouteData } from "../../store/routeSlice";
import L, { Icon } from "leaflet";

interface RouteMarkersProps {
  branch: Branch;
  activeThing: Thing;
}

export const RouteMarkers: React.FC<RouteMarkersProps> = ({ branch, activeThing }) => {
  const progress = useSelector(selectProgress);
  const route = useSelector(selectRouteData);
  const hideCompletedMarkers = useSelector((state: RootState) => state.userPreferences.hideCompletedMarkers);

  const { pointIndex } = progress;
  const markerRefs = useRef(new Map());

  const icons: Record<string, Icon> = {};

  const defaultIcon = L.icon({
    iconUrl: process.env.PUBLIC_URL + "/assets/images/route_icons/blank.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const getIconForThing = (thing: Thing) => {
    if (!thing.icon) return defaultIcon;
    const icon = icons[thing.icon];
    if (icon !== undefined) {
      return defaultIcon;
    }

    const newIcon = L.icon({
      iconUrl: route?.url + "icons/" + thing.icon + ".png",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    icons[thing.icon] = newIcon;
    return newIcon;
  };

  useEffect(() => {
    if (activeThing && markerRefs.current.has(activeThing.id)) {
      markerRefs.current.get(activeThing.id).openPopup();
    }
  }, [activeThing]);

  if (!route) return;

  return (
    <LayerGroup>
      {branch.points.slice(hideCompletedMarkers ? pointIndex : 0).map((point, index) => (
        <Marker
          key={index}
          opacity={route.things[point.layerId][point.thingId].layerId === activeThing.layerId ? 1 : 0}
          position={[
            -route.things[point.layerId][point.thingId].coordinates.x,
            route.things[point.layerId][point.thingId].coordinates.y,
          ]}
          icon={getIconForThing(route.things[point.layerId][point.thingId])}
          ref={(ref) => markerRefs.current.set(point.thingId, ref)}
        >
          <Popup>
            {route.things[point.layerId][point.thingId].name}
            <br />
            {route.things[point.layerId][point.thingId].coordinates.y.toFixed(0)} |{" "}
            {route.things[point.layerId][point.thingId].coordinates.x.toFixed(0)} |{" "}
            {route.things[point.layerId][point.thingId].coordinates.z.toFixed(0)}
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
};
