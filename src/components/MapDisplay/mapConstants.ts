import { LatLngBounds } from "leaflet";
import L from "leaflet";

export const TILE_SIZE = 256;
export const MAP_SIZE = [24000, 20000];

export const outerBounds = new LatLngBounds([-5000, 6000], [5000, -6000]);

export const crs = L.Util.extend({}, L.CRS.Simple, {
  // transformation: new L.Transformation(4 / TILE_SIZE, MAP_SIZE[0] / TILE_SIZE, 4 / TILE_SIZE, MAP_SIZE[1] / TILE_SIZE),
});
