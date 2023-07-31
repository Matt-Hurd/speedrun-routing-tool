import React, { useEffect, useRef } from "react";
import { selectProgress } from "../../store/progressSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectRouteById } from "../../store/routesSlice";
import { selectThingsForGame } from "../../store/thingsSlice";
import "./RouteListDisplay.scss";
import { Korok, Point } from "../../models";

const RouteListDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);

  const route = useSelector((state: RootState) => selectRouteById(state, progress.gameId, progress.routeId));
  const things = useSelector((state: RootState) => selectThingsForGame(state, progress.gameId));

  const activePointRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activePointRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [progress]);

  const getNote = (point: Point) => {
    if (point.shortNote !== "") return point.shortNote;
    const thing = things[point.layerId][point.thingId];
    if (thing.type === "Korok") {
      const korok = thing as Korok;
      return korok.korokType;
    }
    return "";
  };

  return (
    <div className="routeList">
      {route.branches.map((branch, branchIndex) => (
        <div className="routeList__branch" key={branchIndex}>
          <div className="routeList__branchName">
            <strong>{branch.name}</strong>
          </div>
          {branch.points.map((point, pointIndex) => (
            <div
              className={`routeList__point ${
                branchIndex === progress.branchIndex && pointIndex === progress.pointIndex
                  ? "routeList__point--active"
                  : ""
              }`}
              key={branchIndex + "_" + pointIndex}
              ref={branchIndex === progress.branchIndex && pointIndex === progress.pointIndex ? activePointRef : null}
            >
              <div className="routeList__pointId">{pointIndex}</div>
              <div className="routeList__pointName">{things[point.layerId][point.thingId].name}</div>
              <div className="routeList__pointNotes">{getNote(point)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RouteListDisplay;
