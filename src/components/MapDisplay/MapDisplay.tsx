import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { MapContainer, Pane, TileLayer, ImageOverlay } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import { RouteMarkers } from "./RouteMarkers";
import { MapUpdate } from "./MapUpdate";
import { MapEvents } from "./MapEvents";
import RouteLines from "./RouteLines";
import { crs } from "./mapConstants";
import { selectRouteData } from "../../store/routeSlice";

import "./leaflet_tile_workaround.js";
import { LatLngBounds } from "leaflet";

const MapDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);
  const route = useSelector(selectRouteData);

  const { pointIndex, branchIndex } = progress;

  if (!route) return null;

  const activePoint = route.branches[branchIndex].points[pointIndex];
  const activeThing = route.things[activePoint.thingId];
  const layer = route.game.layers[activeThing.layerId];
  const basePath = layer.baseImagePath;
  const imageUrl = basePath.startsWith("/") ? route.url + basePath : basePath;
  const xoffset = -960;
  const yoffset = -540;
  const scale = 0.1;
  const outerBounds = new LatLngBounds(
    [yoffset * scale, xoffset * scale],
    [(yoffset + 1080) * scale, (xoffset + 1920) * scale]
  );

  const style = {
    height: "100%",
    width: "100%",
  };

  return (
    <MapContainer style={style} bounds={outerBounds} zoom={0} maxZoom={7} minZoom={1} crs={crs} keyboard={false}>
      <RouteMarkers branch={route.branches[branchIndex]} activeThing={activeThing} />
      <RouteLines />
      <MapUpdate activePoint={activePoint} />
      {layer.imagePath && (
        <Pane name="tile_bg" style={{ zIndex: 1 }}>
          <TileLayer url={route.game.layers[activeThing.layerId].imagePath} bounds={outerBounds} minZoom={1} />
        </Pane>
      )}
      <Pane name="bg" style={{ zIndex: 0 }}>
        <ImageOverlay url={imageUrl} bounds={outerBounds} />
      </Pane>
      <MapEvents />
    </MapContainer>
  );
};

export default MapDisplay;
