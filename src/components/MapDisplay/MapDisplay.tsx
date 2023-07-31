import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { ImageOverlay, MapContainer, Pane } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectRouteById } from "../../store/routesSlice";
import { selectProgress } from "../../store/progressSlice";
import { RootState } from "../../store";
import { selectGameById } from "../../store/gamesSlice";
import { selectThingsForGame } from "../../store/thingsSlice";
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
      keyboard={false}
    >
      <RouteMarkers branch={route.branches[branchIndex]} activeThing={things[activePoint.layerId][activePoint.thingId]} />
      <RouteLines />
      <MapUpdate activePoint={activePoint} />
      <Pane name="bg" style={{ zIndex: 0 }}>
      <ImageOverlay
          url={process.env.PUBLIC_URL + game.layers[activePoint.layerId].baseImagePath}
          bounds={outerBounds}
        />
      </Pane>
      <MapEvents />
    </MapContainer>
  );
};

export default MapDisplay;
