import { useMap } from "react-leaflet";
import { Point } from "../../models";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectThingsForGame } from "../../store/thingsSlice";
import { selectProgress } from "../../store/progressSlice";

interface MapUpdateProps {
  activePoint: Point;
}

export const MapUpdate: React.FC<MapUpdateProps> = ({ activePoint }) => {
  const progress = useSelector(selectProgress);

  const { gameId } = progress;
  const map = useMap();
  const things = useSelector((state: RootState) =>
    selectThingsForGame(state, gameId)
  );

  useEffect(() => {
    map.setView([
      -things[activePoint.thingId].coordinates.x,
      things[activePoint.thingId].coordinates.y,
    ]);
  }, [activePoint, map, things]);

  return null;
};
