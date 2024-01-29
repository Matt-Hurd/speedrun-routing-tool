import { useMap } from "react-leaflet";
import { Point } from "../../models";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRouteData } from "../../store/routeSlice";
import { convertPoint3DTo2D } from "./projectionUtils";

interface MapUpdateProps {
  activePoint: Point;
}

export const MapUpdate: React.FC<MapUpdateProps> = ({ activePoint }) => {
  const route = useSelector(selectRouteData);
  const map = useMap();

  useEffect(() => {
    if (route) {
      const thing = route.things[activePoint.thingId];
      const layer = route.game.layers[thing.layerId];

      if (layer.rotation) {
        const converted = convertPoint3DTo2D(thing.coordinates, layer);
        map.setView([
          converted.x,
          converted.y
        ])
      } else {
        map.setView([
          -route.things[activePoint.thingId].coordinates.x,
          route.things[activePoint.thingId].coordinates.y,
        ]);
      }
    }
  }, [activePoint, map, route]);

  return null;
};
