import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dropRight from "lodash/dropRight";
import { filter } from "lodash";

import {
  Mosaic,
  MosaicWindow,
  MosaicBranch,
  getPathToCorner,
  Corner,
  getNodeAtPath,
  getOtherDirection,
  updateTree,
  getLeaves,
  MosaicDirection,
  MosaicParent,
  MosaicNode,
  RemoveButton,
} from "react-mosaic-component";
import "./RunMosaic.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "react-mosaic-component/react-mosaic-component.css";
import "react-mosaic-component/styles/index.less";

import Toolbar from "./Toolbar";
import MapDisplay from "../MapDisplay/MapDisplay";
import ProgressDisplay from "../ProgressDisplay/ProgressDisplay";
import RouteListDisplay from "../RouteListDisplay/RouteListDisplay";
import BranchNotesDisplay from "../BranchNotesDisplay/BranchNotesDisplay";
import PointNotesDisplay from "../PointNotesDisplay/PointNotesDisplay";
import UpcomingDisplay from "../UpcomingDisplay/UpcomingDisplay";

import { useAppDispatch } from "../../hooks";
import { loadRoute, selectRouteStatus } from "../../store/routeSlice";
import StorageManager from "../../utils/StorageManager";
import { RootState } from "../../store";
import { useKeyBindings } from "./useKeyBindings";
import { useLivesplit } from "./useLiveSplit";

type RunParams = {
  routeUrl?: string;
  user?: string;
  repo?: string;
  path?: string;
};

const RunMosaic: React.FC = () => {
  const { routeUrl, user, repo, path } = useParams<RunParams>();
  const routeStatus = useSelector(selectRouteStatus);
  const dispatch = useAppDispatch();
  const darkMode = useSelector((state: RootState) => state.userPreferences.darkMode);

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

  const [currentNode, setCurrentNode] = useState<MosaicNode<string> | null>(initialLayout);

  const findMissingDisplays = (node: MosaicNode<string> | null) => {
    const allDisplays = ["Map", "Progress", "Route List", "Point Notes", "Branch Notes", "Upcoming Display"];
    const allVisibleDisplays = getLeaves(node);
    return filter(allDisplays, (display) => {
      return !allVisibleDisplays.includes(display);
    });
  };

  const [availableDisplays, setAvailableDisplays] = useState<string[]>(findMissingDisplays(currentNode));

  useEffect(() => {
    if (routeUrl === undefined && user === undefined) return;
    if (routeStatus === "idle") {
      if (routeUrl) {
        dispatch(loadRoute(routeUrl));
      } else {
        const ghUrl = `https://raw.githubusercontent.com/${user}/${repo}/master/${path}/route.json`;
        dispatch(loadRoute(ghUrl));
      }
    }
  }, [dispatch, routeUrl, routeStatus, user, repo, path]);

  useKeyBindings();
  useLivesplit();

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
      <MosaicWindow path={path} title={id} toolbarControls={[<RemoveButton key={id} />]}>
        {component}
      </MosaicWindow>
    );
  };

  const onChange = (newCurrentNode: MosaicNode<string> | null) => {
    StorageManager.setItem("layout", JSON.stringify(newCurrentNode));
    setCurrentNode(newCurrentNode);
    setAvailableDisplays(findMissingDisplays(newCurrentNode));
  };

  const darkModeClass = darkMode ? "darkmode" : "";

  const addToTopRight = (displayType: string) => {
    console.log(currentNode);
    if (currentNode) {
      const path = getPathToCorner(currentNode, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(currentNode, dropRight(path)) as MosaicParent<string>;
      const destination = getNodeAtPath(currentNode, path) as MosaicNode<string>;
      const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : "row";

      let first: MosaicNode<string>;
      let second: MosaicNode<string>;
      if (direction === "row") {
        first = destination;
        second = displayType;
      } else {
        first = displayType;
        second = destination;
      }

      const newTree = updateTree(currentNode, [
        {
          path,
          spec: {
            $set: {
              direction,
              first,
              second,
            },
          },
        },
      ]);
      setCurrentNode(newTree);
      setAvailableDisplays(findMissingDisplays(newTree));
    }
  };

  const handleToolbarButtonClick = (action: string) => {
    console.log("Button action:", action);
  };

  const handleToolbarAddDisplay = (selectedOption: string) => {
    addToTopRight(selectedOption);
  };

  return (
    <div className={"run-mosaic " + darkModeClass}>
      {availableDisplays.length !== 0 && (
        <Toolbar
          onButtonClick={handleToolbarButtonClick}
          onAddDisplay={handleToolbarAddDisplay}
          missingDisplays={availableDisplays}
        />
      )}
      <Mosaic renderTile={renderWindow} onChange={onChange} value={currentNode} blueprintNamespace="bp5" />
    </div>
  );
};

export default RunMosaic;
