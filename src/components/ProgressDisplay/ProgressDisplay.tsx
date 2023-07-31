import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectProgress } from "../../store/progressSlice";
import { selectRouteById } from "../../store/routesSlice";
import { selectThingsForGame } from "../../store/thingsSlice";

import "./ProgressDisplay.scss";
import { Korok } from "../../models";

const ProgressDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);
  const { gameId, routeId, pointIndex, branchIndex } = progress;

  const route = useSelector((state: RootState) => selectRouteById(state, gameId, routeId));
  const things = useSelector((state: RootState) => selectThingsForGame(state, gameId));
  const [overlayWindow, setOverlayWindow] = useState<Window | null>(null);

  const [counts, setCounts] = useState<{ [type: string]: number }>({
    Korok: 0,
    Shrine: 0,
    Lightroot: 0,
    Bubbulfrog: 0,
  });

  const [korokOffset, setKorokOffset] = useState(0);
  const [shrineOffset, setShrineOffset] = useState(0);
  const [lightrootOffset, setLightrootOffset] = useState(0);
  const [bubbulfrogOffset, setBubbulfrogOffset] = useState(0);

  const openOverlayWindow = () => {
    const newWindow = window.open("#/overlay", "_blank", "width=800,height=600");
    setOverlayWindow(newWindow);
  };

  useEffect(() => {
    const getMaxPointIdx = (bidx: number, pointIndex: number) => {
      if (bidx === branchIndex) return pointIndex;
      return route.branches[bidx].points.length;
    };
    let newCounts: { [type: string]: number } = {
      Korok: 0,
      Shrine: 0,
      Lightroot: 0,
      Bubbulfrog: 0,
    };

    let visitedThings = new Set();

    for (let bidx = 0; bidx <= branchIndex; bidx++) {
      for (let pidx = 0; pidx < getMaxPointIdx(bidx, pointIndex); pidx++) {
        const point = route.branches[bidx].points[pidx];
        if (!visitedThings.has(point.thingId + point.layerId)) {
          visitedThings.add(point.thingId + point.layerId);
          const type = things[point.layerId][point.thingId].type;
          if (newCounts[type] !== undefined) {
            if (type === "Korok") {
              const k = things[point.layerId][point.thingId] as Korok;
              if (k.korokType === "Korok Friends") newCounts[type] += 2;
              else if (k.korokType !== "" && k.korokType !== undefined) newCounts[type]++;
            } else {
              newCounts[type]++;
            }
          } else {
            newCounts[type] = 1;
          }
        }
      }
    }

    setCounts(newCounts);
  }, [route, branchIndex, pointIndex, things]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        backgroundColor: "black",
        fontSize: "24px",
        height: "100%",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      {" "}
      <button
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={openOverlayWindow}
      >
        Open Overlay Window
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "10px",
        }}
      >
        <input
          style={{
            width: "100%",
          }}
          type="number"
          value={shrineOffset}
          onChange={(e) => setShrineOffset(Number(e.target.value))}
        />
        <input
          style={{
            width: "100%",
          }}
          type="number"
          value={lightrootOffset}
          onChange={(e) => setLightrootOffset(Number(e.target.value))}
        />
        <input
          style={{
            width: "100%",
          }}
          type="number"
          value={korokOffset}
          onChange={(e) => setKorokOffset(Number(e.target.value))}
        />
        <input
          style={{
            width: "100%",
          }}
          type="number"
          value={bubbulfrogOffset}
          onChange={(e) => setBubbulfrogOffset(Number(e.target.value))}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/images/route_icons/shrine.png"}
            alt="Shrines"
            style={{ width: "40px", height: "40px", paddingRight: "5px" }}
          />{" "}
          {counts["Shrine"] + shrineOffset}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/images/route_icons/lightroot.png"}
            alt="Lightroots"
            style={{ width: "40px", height: "40px", paddingRight: "5px" }}
          />{" "}
          {counts["Lightroot"] + lightrootOffset}
        </div>{" "}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/images/route_icons/korok.png"}
            alt="Koroks"
            style={{ width: "40px", height: "40px", paddingRight: "5px" }}
          />{" "}
          {counts["Korok"] + korokOffset}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/images/route_icons/bubbulfrog.png"}
            alt="Bubbulgems"
            style={{ width: "40px", height: "40px", paddingRight: "5px" }}
          />{" "}
          {counts["Bubbulfrog"] + bubbulfrogOffset}
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;
