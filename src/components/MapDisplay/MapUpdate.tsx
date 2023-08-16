import { useMap } from "react-leaflet";
import { Point } from "../../models";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRouteData } from "../../store/routeSlice";

interface MapUpdateProps {
  activePoint: Point;
}

export const MapUpdate: React.FC<MapUpdateProps> = ({ activePoint }) => {
  const route = useSelector(selectRouteData);
  const map = useMap();

  useEffect(() => {
    if (route)
      map.setView([-route.things[activePoint.thingId].coordinates.x, route.things[activePoint.thingId].coordinates.y]);
  }, [activePoint, map, route]);

  return null;
};
