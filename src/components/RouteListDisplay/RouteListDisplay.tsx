import React, { useEffect, useRef } from "react";
import { selectProgress } from "../../store/progressSlice";
import { useSelector } from "react-redux";
import "./RouteListDisplay.scss";
import { Korok, Point } from "../../models";
import { selectRouteData } from "../../store/routeSlice";

const RouteListDisplay: React.FC = () => {
  const { branchIndex, pointIndex } = useSelector(selectProgress);
  const route = useSelector(selectRouteData);

  const activePointRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activePointRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [branchIndex, pointIndex]);

  if (!route) return null;

  const getNote = (point: Point) => {
    if (point.shortNote !== "") return point.shortNote;
    const thing = route.things[point.thingId];
    if (thing.type === "Korok") {
      const korok = thing as Korok;
      return korok.korokType;
    }
    return "";
  };

  return (
    <div className="routeList" id="routeListDisplay">
      {route.branches.map((branch, bIdx) => (
        <div className="routeList__branch" key={bIdx}>
          <div className="routeList__branchName">
            <strong>{branch.name}</strong>
          </div>
          {bIdx !== branchIndex
            ? null
            : branch.points.map((point, pIdx) => (
                <div
                  className={`routeList__point ${
                    bIdx === branchIndex && pIdx === pointIndex ? "routeList__point--active" : ""
                  }`}
                  key={bIdx + "_" + pIdx}
                  ref={bIdx === branchIndex && pIdx === pointIndex ? activePointRef : null}
                >
                  <div className="routeList__pointId">{pIdx}</div>
                  <div className="routeList__pointName">{route.things[point.thingId].name}</div>
                  <div className="routeList__pointNotes">{getNote(point)}</div>
                </div>
              ))}
        </div>
      ))}
    </div>
  );
};

export default RouteListDisplay;
