import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

const PolylineWithArrow: React.FC<{ positions: any; color: string }> = ({
  positions,
  color,
}) => {
  const map = useMap();

  useEffect(() => {
    const polyline = L.polyline(positions, { color: color }).addTo(map);

    const arrowHead = L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: 25,
          repeat: 150,
          symbol: L.Symbol.arrowHead({
            pixelSize: 20,
            pathOptions: { fillOpacity: 1, weight: 0 },
          }),
        },
      ],
    }).addTo(map);

    return () => {
      map.removeLayer(polyline);
      map.removeLayer(arrowHead);
    };
  }, [map, positions, color]);

  return null;
};

export default PolylineWithArrow;
