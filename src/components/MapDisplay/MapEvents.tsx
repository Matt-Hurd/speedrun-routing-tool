import { useMapEvents } from "react-leaflet";

export const MapEvents: React.FC = () => {
  useMapEvents({
    click(e) {
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    },
  });
  return null;
};
