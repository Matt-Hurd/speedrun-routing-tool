import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ImageOverlay,
  Pane,
  useMapEvents,
} from "react-leaflet";
import { LatLngBounds, icon } from "leaflet";
import { useSelector } from "react-redux";
import { selectRouteById } from "../../store/routes/routesSlice";
import { selectProgress } from "../../store/progress/progressSlice";
import { RootState } from "../../store";
import { selectGameById } from "../../store/games/gamesSlice";
import { selectThingsForGame } from "../../store/things/thingsSlice";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { Thing } from "../../models";

export const TILE_SIZE = 256;
export const MAP_SIZE = [24000, 20000];

const outerBounds = new LatLngBounds([-5000, 6000], [5000, -6000]);

const potentialIcons = [
  "addison",
  "armor",
  "bargainer",
  "bubbulfrog",
  "camera",
  "cave",
  "chasm",
  "construct",
  "crystal",
  "earthwake",
  "fabric",
  "frox",
  "gacha",
  "gleeok",
  "hinox",
  "korok",
  "korokEnd",
  "korokPlatform",
  "korokSidePlatform",
  "korokStart",
  "lightroot",
  "map",
  "molduga",
  "picture",
  "schema",
  "schematic",
  "shrine",
  "talus",
  "tear",
  "tower",
  "well",
  "will",
  "x",
];

const icons = potentialIcons.reduce((accum, obj) => {
  accum[obj] = L.icon({
    iconUrl: "../assets/images/route_icons/" + obj + ".png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
  return accum;
}, {} as Record<string, L.Icon>);

const defaultIcon = L.icon({
  iconUrl: "../assets/images/route_icons/" + "blank" + ".png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
const MapDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);

  const { gameId, routeId, pointIndex, branchIndex } = progress;
  const markerRefs = useRef(new Map());

  const route = useSelector((state: RootState) =>
    selectRouteById(state, gameId, routeId)
  );
  const game = useSelector((state: RootState) => selectGameById(state, gameId));
  const activePoint = route.branches[branchIndex].points[pointIndex];
  const things = useSelector((state: RootState) =>
    selectThingsForGame(state, gameId)
  );
  
  useEffect(() => {
    // If activePoint is defined and there's a corresponding Marker, open the Popup
    if (activePoint && markerRefs.current.has(activePoint.thingId)) {
      markerRefs.current.get(activePoint.thingId).openPopup();
    }
  }, [activePoint]);

  if (!route) return null;

  const activeThing = things[activePoint.thingId];
  const crs = L.Util.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(
      4 / TILE_SIZE,
      MAP_SIZE[0] / TILE_SIZE,
      4 / TILE_SIZE,
      MAP_SIZE[1] / TILE_SIZE
    ),
  });

  const getIconForThing = (thing: Thing) => {
    const icon = icons[thing.icon];
    if (icon === undefined) {
      return defaultIcon;
    }
    return icon;
  };

  const markerElements = route.branches[branchIndex].points.filter(point => things[point.thingId].layerId === activeThing.layerId).map(
    (point, index) => (
      <Marker
        key={index}
        position={[
          -things[point.thingId].coordinates.x,
          things[point.thingId].coordinates.y,
        ]}
        icon={getIconForThing(things[point.thingId])}
        ref={ref => markerRefs.current.set(point.thingId, ref)}
      >
        <Popup>{things[point.thingId].name}</Popup>
      </Marker>
    )
  );

  const MapUpdate: React.FC = () => {
    const map = useMap();
    map.setView([
      -things[activePoint.thingId].coordinates.x,
      things[activePoint.thingId].coordinates.y,
    ]);
    return null;
  };
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      },
    });
    return null;
  };
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
      {/* <TileLayer url={game.layers[things[activePoint.thingId].layerId].imagePath} maxZoom={7} minZoom={1}  bounds={outerBounds}/> */}
      {markerElements}
      <MapUpdate />
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
