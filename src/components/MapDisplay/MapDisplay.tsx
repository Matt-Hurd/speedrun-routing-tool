import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { ImageOverlay, MapContainer, Pane } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import { RouteMarkers } from "./RouteMarkers";
import { MapUpdate } from "./MapUpdate";
import { MapEvents } from "./MapEvents";
import RouteLines from "./RouteLines";
import { outerBounds, crs } from "./mapConstants";
import { selectRouteData } from "../../store/routeSlice";

import "./leaflet_tile_workaround.js";

const MapDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);
  const route = useSelector(selectRouteData);

  const { pointIndex, branchIndex } = progress;

  if (!route) return null;

  const activePoint = route.branches[branchIndex].points[pointIndex];

  const style = {
    height: "100%",
    width: "100%",
  };

  return (
    <MapContainer style={style} bounds={outerBounds} zoom={0} maxZoom={7} minZoom={-5} crs={crs} keyboard={false}>
      <RouteMarkers
        branch={route.branches[branchIndex]}
        activeThing={route.things[activePoint.layerId][activePoint.thingId]}
      />
      <RouteLines />
      <MapUpdate activePoint={activePoint} />
      <Pane name="bg" style={{ zIndex: 0 }}>
        <ImageOverlay url={route.url + route.game.layers[activePoint.layerId].baseImagePath} bounds={outerBounds} />
      </Pane>
      <MapEvents />
    </MapContainer>
  );
};

export default MapDisplay;
