import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { ImageOverlay, MapContainer, Pane } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectRouteById } from "../../store/routes/routesSlice";
import { selectProgress } from "../../store/progress/progressSlice";
import { RootState } from "../../store";
import { selectGameById } from "../../store/games/gamesSlice";
import { selectThingsForGame } from "../../store/things/thingsSlice";
import { RouteMarkers } from './RouteMarkers';
import { MapUpdate } from './MapUpdate';
import { MapEvents } from './MapEvents';
import RouteLines from './RouteLines';
import { outerBounds, crs } from './mapConstants';

import "./leaflet_tile_workaround.js";

const MapDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);

  const { gameId, routeId, pointIndex, branchIndex } = progress;

  const route = useSelector((state: RootState) =>
    selectRouteById(state, gameId, routeId)
  );
  const game = useSelector((state: RootState) => selectGameById(state, gameId));
  const activePoint = route.branches[branchIndex].points[pointIndex];
  const things = useSelector((state: RootState) =>
    selectThingsForGame(state, gameId)
  );

  if (!route) return null;

  const style = {
    height: "100%",
    width: "100%",
  };

  return (
    <MapContainer
      style={style}
      bounds={outerBounds}
      zoom={0}
      maxZoom={7}
      minZoom={-5}
      crs={crs}
    >
      <RouteMarkers branch={route.branches[branchIndex]} activeThing={things[activePoint.thingId]} />
      <RouteLines />
      <MapUpdate activePoint={activePoint} />
      <Pane name="bg" style={{ zIndex: 0 }}>
      <ImageOverlay
          url={game.layers[things[activePoint.thingId].layerId].baseImagePath}
          bounds={outerBounds}
        />
      </Pane>
      <MapEvents />
    </MapContainer>
  );
};

export default MapDisplay;
