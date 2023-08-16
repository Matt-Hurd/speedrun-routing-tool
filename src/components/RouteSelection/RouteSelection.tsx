import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface RouteOption {
  name: string;
  path: string;
}

interface GameOption {
  name: string;
  routes: RouteOption[];
}

function RouteSelection() {
  const [gameOptions, setGameOptions] = useState<GameOption[]>([]);
  const [customRouteUrl, setCustomRouteUrl] = useState<string>("");

  useEffect(() => {
    const loadDefaultRoutes = async () => {
      const response = await fetch(new URL("/assets/default_routes.json", import.meta.url).href);
      const data = await response.json();
      setGameOptions(data);
    };

    loadDefaultRoutes();
  }, []);

  const handleCustomRouteInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomRouteUrl(event.target.value);
  };

  return (
    <div>
      <h2>Select a game and route</h2>
      {gameOptions.map((game) => (
        <div key={game.name}>
          <h3>{game.name}</h3>
          {game.routes.map((route) => (
            <Link key={route.path} to={`/route/${encodeURIComponent(route.path)}`}>
              {route.name}
            </Link>
          ))}
        </div>
      ))}
      <h3>...Or use a remote route</h3>
      <input
        type="text"
        value={customRouteUrl}
        onChange={handleCustomRouteInput}
        placeholder="Input remote route URL"
      />
      {customRouteUrl && <Link to={`/route/${encodeURIComponent(customRouteUrl)}`}>Go</Link>}
    </div>
  );
}

export default RouteSelection;
