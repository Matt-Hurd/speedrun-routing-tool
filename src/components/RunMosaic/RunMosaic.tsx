import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mosaic, MosaicWindow, MosaicBranch, MosaicNode } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import 'react-mosaic-component/styles/index.less';

import MapDisplay from '../MapDisplay/MapDisplay';
import ProgressDisplay from '../ProgressDisplay/ProgressDisplay';
import RouteListDisplay from '../RouteListDisplay/RouteListDisplay';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setRouteId, selectProgress, setGameId } from '../../store/progress/progressSlice';
import classNames from 'classnames';
import { Classes } from '@blueprintjs/core';

import './RunMosaic.css'
import { loadGames, selectGamesStatus } from '../../store/games/gamesSlice';
import { loadRoutes, selectRoutesStatus } from '../../store/routes/routesSlice';
import { useSelector } from 'react-redux';
import { loadThings, selectThingsStatus } from '../../store/things/thingsSlice';
import BranchNotesDisplay from '../BranchNotesDisplay/BranchNotesDisplay';
import PointNotesDisplay from '../PointNotesDisplay/PointNotesDisplay';
import { incrementProgress, decrementProgress, incrementSection, decrementSection } from '../../store/progress/progressSlice';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';


type RunParams = {
  gameId: string;
  routeId: string;
};

const RunMosaic: React.FC = () => {
  const { gameId, routeId } = useParams<RunParams>();
  const progress = useAppSelector(selectProgress);
  const gamesStatus = useSelector(selectGamesStatus);
  const routesStatus = useSelector(selectRoutesStatus);
  const thingsStatus = useSelector(selectThingsStatus);
  const dispatch = useAppDispatch();

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (event.ctrlKey && event.shiftKey) {
            dispatch(decrementSection());
          } else {
            dispatch(decrementProgress());
          }
          break;
        case 'ArrowRight':
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

    window.addEventListener('keydown', handleKeyDown);

    // Make sure to clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (gamesStatus === "idle") {
      dispatch(loadGames());
    }
  }, [gamesStatus, dispatch]);

  useEffect(() => {
    if (gameId === undefined )
      return;
      if (routesStatus === "idle") {
        dispatch(loadRoutes(gameId));
      }
      if (thingsStatus === "idle") {
        dispatch(loadThings(gameId));
      }
  }, [dispatch, gameId, thingsStatus, routesStatus]);
  
  useEffect(() => {
    if (routeId === undefined)
        throw new Error('routeId invalid in RunMosaic');
      dispatch(setRouteId(routeId));
      dispatch(setGameId(gameId));
  }, [routeId, gameId, dispatch]);
  
  if (!progress || !progress.routeId || gameId === undefined || routesStatus !== "succeeded" || gamesStatus !== "succeeded" || thingsStatus !== "succeeded") {
    // Show a loading spinner, or any other placeholder
    return <div>Loading...</div>;
  }

  // Render a MosaicWindow for each key in the layout
  const renderWindow = (id: string, path: MosaicBranch[]) => {
    let component: JSX.Element;

    switch (id) {
      case 'Map':
        component = <MapDisplay />;
        break;
      case 'Progress':
        component = <ProgressDisplay />;
        break;
      case 'Route List':
        component = <RouteListDisplay />;
        break;
      case 'Point Notes':
          component = <PointNotesDisplay />;
          break;
      case 'Branch Notes':
          component = <BranchNotesDisplay />;
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
    localStorage.setItem("layout", JSON.stringify(currentNode));
  };

  const initialLayoutStorage = localStorage.getItem("layout")
  const initialLayout = initialLayoutStorage ? JSON.parse(initialLayoutStorage) : {
    direction: 'row',
    first: 'Map',
    second: {
      direction: 'column',
      first: {
        direction: 'row',
        first: 'Progress',
        second: 'Route List',
      },
      second: {
        direction: 'row',
        first: 'Point Notes',
        second: 'Branch Notes',
      },
    },
    splitPercentage: 40,
  };
  
  return (
    <div className="run-mosaic">
      <Mosaic
        renderTile={renderWindow}
        onChange={onChange}
        initialValue={initialLayout}
        blueprintNamespace="bp5"
      />
    </div>
  );
};

export default RunMosaic;
