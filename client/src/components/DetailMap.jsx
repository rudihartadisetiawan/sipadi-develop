import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// A component to handle map zooming
const MapController = ({ geometry }) => {
  const map = useMap();

  useEffect(() => {
    if (geometry) {
      const geoJsonLayer = L.geoJSON({ type: 'Feature', geometry: geometry });
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, geometry]);

  return null;
};

const DetailMap = ({ geometry }) => {
  return (
    <MapContainer
      center={[-6.892, 110.6412]} // Default center, will be overridden by fitBounds
      zoom={12}
      style={{ height: '250px', width: '100%' }}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      attributionControl={false} // Also hide attribution for a cleaner look
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geometry && <GeoJSON data={{ type: 'Feature', geometry: geometry }} style={{ color: 'orange' }} />}
      <MapController geometry={geometry} />
    </MapContainer>
  );
};

export default DetailMap;