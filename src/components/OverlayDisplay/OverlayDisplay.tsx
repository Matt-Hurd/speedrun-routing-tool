import React from "react";
import { connect } from "react-redux";
import { motion } from "framer-motion";
import "./OverlayDisplay.scss";
import { Route, Thing } from "../../models";
import { RootState } from "../../store";

type DungeonStatus = {
  [key: string]: boolean;
};

const initialDungeonStatus: DungeonStatus = {
  Wind: false,
  Water: false,
  Fire: false,
  Lightning: false,
  Spirit: false,
};

const TOTAL_KOROK = 1000;
const TOTAL_SHRINE = 152;
const TOTAL_LIGHTROOT = 120;
const TOTAL_BUBBULFROG = 147;

interface OverlayDisplayProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any;
  route: Route | null;
}

class OverlayDisplay extends React.Component<OverlayDisplayProps> {
  state = {
    korokCount: 0,
    shrineCount: 0,
    lightrootCount: 0,
    bubbulfrogCount: 0,
    dungeonStatus: initialDungeonStatus,
  };

  componentDidUpdate(prevProps: OverlayDisplayProps) {
    if (this.props.route !== prevProps.route || this.props.progress !== prevProps.progress) {
      this.calculateProgress();
    }
  }

  calculateProgress = () => {
    const { route, progress } = this.props;
    if (!route) return;

    let newKorokCount = 0;
    let newShrineCount = 0;
    let newLightrootCount = 0;
    let newBubbulfrogCount = 0;
    const newDungeonStatus = { ...initialDungeonStatus };

    for (let bidx = 0; bidx <= progress.branchIndex; bidx++) {
      const branch = route.branches[bidx];
      const pointCount = bidx === progress.branchIndex ? progress.pointIndex : branch.points.length;

      for (let pidx = 0; pidx < pointCount; pidx++) {
        const point = branch.points[pidx];
        const thing = route.things[point.thingId] as Thing;

        switch (thing.type) {
          case "Korok":
            newKorokCount += 1;
            newDungeonStatus["Fire"] = true;
            break;
          case "Shrine":
            newShrineCount += 1;
            break;
          case "Lightroot":
            newLightrootCount += 1;
            break;
          case "Bubbulfrog":
            newBubbulfrogCount += 1;
            break;
          case "Dungeon":
            newDungeonStatus[thing.name] = true;
            break;
          default:
            break;
        }
      }
    }

    this.setState({
      korokCount: newKorokCount,
      shrineCount: newShrineCount,
      lightrootCount: newLightrootCount,
      bubbulfrogCount: newBubbulfrogCount,
      dungeonStatus: newDungeonStatus,
    });
  };

  render() {
    const { korokCount, shrineCount, lightrootCount, bubbulfrogCount, dungeonStatus } = this.state;
    return (
      <div className="overlay-display">
        {/* Display progress bars for counts */}
        <div className="progress-item">
          <div className="progress-title">Korok</div>
          <div className="progress-container">
            <motion.div className="progress-bar" animate={{ width: `${(korokCount / TOTAL_KOROK) * 100}%` }} />
            <div className="progress-count">{korokCount}</div>
          </div>
        </div>
        <div className="progress-item">
          <div className="progress-title">Shrine</div>
          <div className="progress-container">
            <motion.div className="progress-bar" animate={{ width: `${(shrineCount / TOTAL_SHRINE) * 100}%` }} />
            <div className="progress-count">{shrineCount}</div>
          </div>
        </div>
        <div className="progress-item">
          <div className="progress-title">Lightroot</div>
          <div className="progress-container">
            <motion.div className="progress-bar" animate={{ width: `${(lightrootCount / TOTAL_LIGHTROOT) * 100}%` }} />
            <div className="progress-count">{lightrootCount}</div>
          </div>
        </div>
        <div className="progress-item">
          <div className="progress-title">Bubbulfrog</div>
          <div className="progress-container">
            <motion.div
              className="progress-bar"
              animate={{ width: `${(bubbulfrogCount / TOTAL_BUBBULFROG) * 100}%` }}
            />
            <div className="progress-count">{bubbulfrogCount}</div>
          </div>
        </div>

        {/* Display icons for dungeons */}
        <div className="dungeon-status">
          {Object.entries(dungeonStatus).map(([dungeon, isComplete]) => (
            <motion.img
              key={dungeon}
              src={`/assets/images/overlay/${dungeon}.png`}
              initial={{ opacity: isComplete ? 1 : 0.3 }}
              animate={{ opacity: isComplete ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const route = state.route.data;

  return { progress: state.progress, route };
};

const display = connect(mapStateToProps)(OverlayDisplay);

export default display;
