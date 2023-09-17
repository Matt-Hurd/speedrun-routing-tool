import React, { useRef, useEffect } from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import { Thing, Branch, Korok } from "../../models";
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
    iconUrl: new URL("/assets/images/route_icons/blank.png", import.meta.url).href,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const getIconForThing = (thing: Thing) => {
    if (!thing.icon) return defaultIcon;
    const icon = icons[thing.icon];
    if (icon !== undefined) {
      return icon;
    }

    const newIcon = L.icon({
      iconUrl: route?.game.icons[thing.icon] || new URL("/assets/images/route_icons/blank.png", import.meta.url).href,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    icons[thing.icon] = newIcon;
    return newIcon;
  };

  useEffect(() => {
    if (activeThing && markerRefs.current.has(activeThing.uid)) {
      markerRefs.current.get(activeThing.uid).openPopup();
    }
  }, [activeThing]);

  if (!route) return null;

  return (
    <LayerGroup>
      {branch.points.map((point, index) => {
        const currentThing = route.things[point.thingId];
        const { coordinates, name, type } = currentThing;
        const isKorok = type === "Korok";

        let opacity = 0;
        if (currentThing.layerId === activeThing.layerId) {
          if (hideCompletedMarkers && pointIndex <= index) {
            opacity = 1;
          } else if (!hideCompletedMarkers) {
            opacity = 1;
          }
        }

        return (
          <Marker
            key={index}
            opacity={opacity}
            position={[-coordinates.x, coordinates.y]}
            icon={getIconForThing(currentThing)}
            ref={(ref) => markerRefs.current.set(point.thingId, ref)}
          >
            <Popup autoPan={false}>
              {name}
              <br />
              {isKorok ? (currentThing as Korok).korokType : point.shortNote}
              <br />
              {coordinates.y.toFixed(0)} | {coordinates.x.toFixed(0)} | {coordinates.z.toFixed(0)}
            </Popup>
          </Marker>
        );
      })}
    </LayerGroup>
  );
};
