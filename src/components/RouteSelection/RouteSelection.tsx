import { useState, useEffect } from "react";
import { uploadRoute } from "../../store/routeSlice";
import { Link, useNavigate } from "react-router-dom";
import { Route } from "../../models";
import { useDispatch } from "react-redux";

interface RouteOption {
  name: string;
  path: string;
  gh?: boolean;
}

interface GameOption {
  name: string;
  routes: RouteOption[];
}

function RouteSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === "string") {
            const parsedRoute: Route = JSON.parse(content);
            dispatch(uploadRoute(parsedRoute));
            navigate("/uploaded");
          }
        } catch (error) {
          console.error("Failed to parse route:", error);
          // Handle the error. Maybe update the state to show an error message.
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2>Select a game and route</h2>
      {gameOptions.map((game) => (
        <div key={game.name}>
          <h3>{game.name}</h3>
          {game.routes.map((route) => (
            <div>
              <Link key={route.path} to={`/route/${route.gh ? route.path : encodeURIComponent(route.path)}`}>
                {route.name}
              </Link>
              <br />
            </div>
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
      <h3>.. Or upload a route file</h3>
      <input type="file" accept=".json" onChange={handleFileUpload} />
    </div>
  );
}

export default RouteSelection;
