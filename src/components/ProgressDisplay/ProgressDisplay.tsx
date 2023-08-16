import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";

import "./ProgressDisplay.scss";
import { Korok } from "../../models";
import { selectRouteData } from "../../store/routeSlice";

const ProgressDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);
  const { pointIndex, branchIndex } = progress;
  const route = useSelector(selectRouteData);

  const [, setOverlayWindow] = useState<Window | null>(null);

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
    const newWindow = window.open("#/overlay", "_blank", "width=1080,height=600");
    setOverlayWindow(newWindow);
  };

  useEffect(() => {
    if (!route) return;
    const getMaxPointIdx = (bidx: number, pointIndex: number) => {
      if (bidx === branchIndex) return pointIndex;
      return route.branches[bidx].points.length;
    };
    const newCounts: { [type: string]: number } = {
      Korok: 0,
      Shrine: 0,
      Lightroot: 0,
      Bubbulfrog: 0,
    };

    const visitedThings = new Set();

    for (let bidx = 0; bidx <= branchIndex; bidx++) {
      for (let pidx = 0; pidx < getMaxPointIdx(bidx, pointIndex); pidx++) {
        const point = route.branches[bidx].points[pidx];
        const thing = route.things[point.layerId][point.thingId];

        if (thing.type === "Shrine" && point.action !== "COMPLETE") continue;

        if (!visitedThings.has(point.thingId + point.layerId)) {
          visitedThings.add(point.thingId + point.layerId);
          const type = thing.type;
          if (newCounts[type] !== undefined) {
            if (type === "Korok") {
              const k = thing as Korok;
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
  }, [route, branchIndex, pointIndex]);

  return (
    <div className={"progress-window"}>
      {" "}
      <button className={"overlay-window-button"} onClick={openOverlayWindow}>
        Open Overlay Window
      </button>
      <div className={"progress-input-adjusters"}>
        <input type="number" value={shrineOffset} onChange={(e) => setShrineOffset(Number(e.target.value))} />
        <input type="number" value={lightrootOffset} onChange={(e) => setLightrootOffset(Number(e.target.value))} />
        <input type="number" value={korokOffset} onChange={(e) => setKorokOffset(Number(e.target.value))} />
        <input type="number" value={bubbulfrogOffset} onChange={(e) => setBubbulfrogOffset(Number(e.target.value))} />
      </div>
      <div className={"progress-icons"}>
        <div className={"progress-icon"}>
          <img src={"/assets/images/progress/shrine.png"} alt="Shrines" /> {counts["Shrine"] + shrineOffset}
        </div>
        <div className={"progress-icon"}>
          <img src={"/assets/images/progress/lightroot.png"} alt="Lightroots" /> {counts["Lightroot"] + lightrootOffset}
        </div>{" "}
        <div className={"progress-icon"}>
          <img src={"/assets/images/progress/korok.png"} alt="Koroks" /> {counts["Korok"] + korokOffset} (
          {counts["Korok"]})
        </div>
        <div className={"progress-icon"}>
          <img src={"/assets/images/progress/bubbulfrog.png"} alt="Bubbulgems" />{" "}
          {counts["Bubbulfrog"] + bubbulfrogOffset}
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;
