import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadGames,
  selectGames,
  selectGamesStatus,
} from "../../store/gamesSlice";
import {
  loadRoutes,
  selectRoutes,
  selectRoutesStatus,
} from "../../store/routesSlice";
import { AppDispatch, RootState } from "../../store";
import React from "react";
import { Link } from "react-router-dom";

function RouteSelection() {
  const dispatch = useDispatch<AppDispatch>();

  const games = useSelector(selectGames);
  const gamesStatus = useSelector(selectGamesStatus);
  const routesStatus = useSelector(selectRoutesStatus);
  const gameIds = Object.keys(games);

  const [selectedGameId, setSelectedGameId] = React.useState<string | null>(null);

  useEffect(() => {
    if (gamesStatus === "idle") {
      dispatch(loadGames());
    }
  }, [gamesStatus, dispatch]);

  useEffect(() => {
    if (routesStatus === "idle") {
      gameIds.forEach((gameId) => {
        dispatch(loadRoutes(gameId));
      });
    }
  }, [dispatch, gameIds, routesStatus]);

  const allRoutes = useSelector((state: RootState) => selectRoutes(state));

  if (gamesStatus !== "succeeded") {
    return <div>Loading...</div>;
  }

  // Render dropdown options for each route in each game
  return (
    <div>
      <h2>Select a game</h2>
      {Object.values(games).map(game => (
        <button key={game.id} onClick={() => setSelectedGameId(game.id)}>
          {game.name}
        </button>
      ))}
      {selectedGameId && (
        <>
          <h2>Select a route</h2>
          {routesStatus === 'loading' && <div>Loading routes...</div>}
          {routesStatus === 'failed' && <div>Error loading routes</div>}
          {Object.values(allRoutes[selectedGameId]).map(route => (
            <Link key={route.id} to={`/${selectedGameId}/${route.id}`}>
              {route.name}
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

export default RouteSelection;
