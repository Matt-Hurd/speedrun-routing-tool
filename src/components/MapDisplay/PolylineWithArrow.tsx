import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

const PolylineWithArrow: React.FC<{ positions: any; color: string; warp: boolean }> = ({ positions, color, warp }) => {
  const map = useMap();

  useEffect(() => {
    const polyline = L.polyline(positions, { color: color });

    if (!warp) {
      polyline.addTo(map);
    }

    const arrowHead = L.polylineDecorator(polyline, {
      patterns: warp
        ? [
            {
              offset: 0,
              repeat: 5,
              symbol: L.Symbol.dash({ pixelSize: 0, pathOptions: { fillOpacity: 1, weight: 2 } }),
            },
            {
              offset: 25,
              repeat: 150,
              symbol: L.Symbol.arrowHead({ pixelSize: 20, pathOptions: { fillOpacity: 1, weight: 0 } }),
            },
          ]
        : [
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
  }, [map, positions, color, warp]);

  return null;
};

export default PolylineWithArrow;
