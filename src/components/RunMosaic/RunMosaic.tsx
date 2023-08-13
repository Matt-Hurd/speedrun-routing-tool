import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Mosaic, MosaicWindow, MosaicBranch, MosaicNode } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import "react-mosaic-component/styles/index.less";

import MapDisplay from "../MapDisplay/MapDisplay";
import ProgressDisplay from "../ProgressDisplay/ProgressDisplay";
import RouteListDisplay from "../RouteListDisplay/RouteListDisplay";
import { useAppDispatch } from "../../hooks";

import "./RunMosaic.css";
import { loadRoute, selectRouteStatus } from "../../store/routeSlice";
import { useSelector } from "react-redux";
import BranchNotesDisplay from "../BranchNotesDisplay/BranchNotesDisplay";
import PointNotesDisplay from "../PointNotesDisplay/PointNotesDisplay";
import { incrementProgress, decrementProgress, incrementSection, decrementSection } from "../../store/progressSlice";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import UpcomingDisplay from "../UpcomingDisplay/UpcomingDisplay";
import StorageManager from "../../utils/StorageManager";
import liveSplitService from "../../services/LiveSplitWebSocket";
import { RootState } from "../../store";

type RunParams = {
  routeUrl: string;
};

const RunMosaic: React.FC = () => {
  const { routeUrl } = useParams<RunParams>();
  const routeStatus = useSelector(selectRouteStatus);
  const dispatch = useAppDispatch();
  const liveSplit = liveSplitService;
  const darkMode = useSelector((state: RootState) => state.userPreferences.darkMode);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (event.ctrlKey && event.shiftKey) {
            dispatch(decrementSection());
          } else {
            dispatch(decrementProgress());
          }
          break;
        case "ArrowRight":
          if (event.ctrlKey && event.shiftKey) {
            dispatch(incrementSection());
          } else {
            dispatch(incrementProgress());
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  useEffect(() => {
    if (routeUrl === undefined) return;
    if (routeStatus === "idle") {
      dispatch(loadRoute(routeUrl));
    }
  }, [dispatch, routeUrl, routeStatus]);

  useEffect(() => {
    function handleLoad() {
      (async () => {
        liveSplit.connect();
      })();
    }
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
    return () => {
      if (liveSplit) {
        liveSplit.disconnect();
      }
    };
  }, [liveSplit]);

  if (routeStatus !== "succeeded") {
    return <div>Loading...</div>;
  }

  const renderWindow = (id: string, path: MosaicBranch[]) => {
    let component: JSX.Element;

    switch (id) {
      case "Map":
        component = <MapDisplay />;
        break;
      case "Progress":
        component = <ProgressDisplay />;
        break;
      case "Route List":
        component = <RouteListDisplay />;
        break;
      case "Point Notes":
        component = <PointNotesDisplay />;
        break;
      case "Branch Notes":
        component = <BranchNotesDisplay />;
        break;
      case "Upcoming Display":
        component = <UpcomingDisplay />;
        break;
      default:
        component = <div />;
    }

    return (
      <MosaicWindow path={path} title={id}>
        {component}
      </MosaicWindow>
    );
  };

  const onChange = (currentNode: MosaicNode<string> | null) => {
    StorageManager.setItem("layout", JSON.stringify(currentNode));
  };

  const initialLayoutStorage = StorageManager.getItem("layout");
  const initialLayout = initialLayoutStorage
    ? JSON.parse(initialLayoutStorage)
    : {
        direction: "row",
        first: {
          direction: "column",
          first: "Map",
          second: {
            first: "Route List",
            second: {
              first: "Upcoming Display",
              second: "Progress",
              direction: "column",
              splitPercentage: 60,
            },
            direction: "row",
            splitPercentage: 70,
          },
          splitPercentage: 67,
        },
        second: {
          first: "Point Notes",
          second: "Branch Notes",
          direction: "column",
        },
        splitPercentage: 77,
      };

  const darkModeClass = darkMode ? "darkmode" : "";

  return (
    <div className={"run-mosaic " + darkModeClass}>
      <Mosaic renderTile={renderWindow} onChange={onChange} initialValue={initialLayout} blueprintNamespace="bp5" />
    </div>
  );
};

export default RunMosaic;
