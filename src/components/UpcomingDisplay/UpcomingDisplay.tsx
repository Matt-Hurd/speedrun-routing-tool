import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectProgress } from "../../store/progressSlice";
import { selectRouteById } from "../../store/routesSlice";
import { selectThingsForGame } from "../../store/thingsSlice";
import { Korok, Shrine } from "../../models/Thing";

const UpcomingDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);
  const { gameId, routeId, pointIndex, branchIndex } = progress;

  const route = useSelector((state: RootState) => selectRouteById(state, gameId, routeId));
  const things = useSelector((state: RootState) => selectThingsForGame(state, gameId));

  const [rockKorokCount, setRockKorokCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [zuggleBosses, setZuggleBosses] = useState(0);

  useEffect(() => {
    let rockKorokCount = 0;
    let points = 0;
    let provingGroundFound = false;
    let zuggleBosses = 0;

    for (let bidx = branchIndex; bidx < route.branches.length; bidx++) {
      if (provingGroundFound) break;

      for (let pidx = bidx === branchIndex ? pointIndex : 0; pidx < route.branches[bidx].points.length; pidx++) {
        const point = route.branches[bidx].points[pidx];
        const thing = things[point.layerId][point.thingId];

        if (thing.type === "Shrine") {
          const shrine = thing as Shrine;
          if (shrine.isProvingGrounds) {
            provingGroundFound = true;
            break;
          }
        }

        if (thing.type === "Korok") {
          const korok = thing as Korok;
          if (korok.korokType === "Rock Pattern") rockKorokCount++;
        }

        if (thing.type === "Hinox" || thing.type === "Molduga" || thing.type === "Construct" || thing.type === "Frox")
          zuggleBosses++;
        points++;
      }
    }

    setRockKorokCount(rockKorokCount);
    setPoints(points);
    setZuggleBosses(zuggleBosses);
  }, [route, branchIndex, pointIndex, things]);

  return (
    <div style={{ fontSize: "24px", height: "100%", padding: "10px" }}>
      <p>Before next proving ground:</p>
      <p>Points: {points}</p>
      <p>Rock Koroks: {rockKorokCount}</p>
      <p>Zuggle Bosses: {zuggleBosses}</p>
    </div>
  );
};

export default UpcomingDisplay;
