'use strict';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import area from '@turf/area';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const DrawingControl = ({ onGeometryChange, onAreaChange, initialGeometry, geometryType }) => {
  const map = useMap();
  const drawnItemsRef = useRef(new L.FeatureGroup()).current;

  useEffect(() => {
    if (!map) return;

    map.addLayer(drawnItemsRef);

    map.pm.addControls({
      position: 'topleft',
      drawPolygon: geometryType === 'Polygon',
      drawMarker: geometryType === 'Point',
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawText: false,
      editMode: true,
      dragMode: true,
      cutPolygon: geometryType === 'Polygon',
      removalMode: true,
    });

    const handleGeometryUpdate = (layer, shape) => {
      const geojson = layer.toGeoJSON();
      onGeometryChange(geojson.geometry);

      if (shape === 'Polygon') {
        const areaSqm = area(geojson);
        const areaHectares = areaSqm / 10000;
        onAreaChange(areaHectares);
      }
    };

    map.on('pm:create', (e) => {
      const { layer, shape } = e;
      drawnItemsRef.clearLayers();
      drawnItemsRef.addLayer(layer);
      handleGeometryUpdate(layer, shape);
      map.pm.disableDraw();
    });

    map.on('pm:remove', () => {
      drawnItemsRef.clearLayers();
      onGeometryChange(null);
      if (geometryType === 'Polygon') onAreaChange(0);
    });

    map.on('pm:edit', (e) => {
      handleGeometryUpdate(e.layer, e.shape || (e.layer instanceof L.Polygon ? 'Polygon' : 'Marker'));
    });

    return () => {
      if (map.pm) map.pm.removeControls();
      map.removeLayer(drawnItemsRef);
      map.off('pm:create');
      map.off('pm:remove');
      map.off('pm:edit');
    };
  }, [map, onGeometryChange, onAreaChange, drawnItemsRef, geometryType]);

  useEffect(() => {
    if (initialGeometry && map && drawnItemsRef.getLayers().length === 0) {
      const geoJsonFeature = { type: 'Feature', geometry: initialGeometry };
      const initialLayer = L.geoJSON(geoJsonFeature);
      initialLayer.eachLayer(layer => {
        if (layer.setStyle) layer.setStyle({ color: 'orange' });
        drawnItemsRef.addLayer(layer);
      });
      if (drawnItemsRef.getBounds().isValid()) {
        map.fitBounds(drawnItemsRef.getBounds(), { padding: [50, 50] });
      }
    }
  }, [initialGeometry, map, drawnItemsRef]);

  return null;
};

const MapEffects = ({ geojsonData }) => {
  const map = useMap();
  useEffect(() => {
    if (map && geojsonData?.features.length) {
      const bounds = L.geoJSON(geojsonData).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    }
  }, [map, geojsonData]);
  return null;
};

const MapInput = ({ onGeometryChange, onAreaChange, onLocationChange, initialGeometry, geometryType = 'Polygon' }) => {
  const [mapLevel, setMapLevel] = useState('kecamatan');
  const [geojsonData, setGeojsonData] = useState(null);
  const [allKecamatanData, setAllKecamatanData] = useState(null);
  const [allDesaData, setAllDesaData] = useState(null);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [desaOptions, setDesaOptions] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedDesa, setSelectedDesa] = useState('');

  useEffect(() => {
    if (geometryType === 'Polygon') {
      const fetchData = async () => {
        try {
          const [kec, desa] = await Promise.all([
            fetch('/batas_kecamatan_demak.geojson').then(res => res.json()),
            fetch('/batas_desa_demak.geojson').then(res => res.json()),
          ]);
          setAllKecamatanData(kec);
          setAllDesaData(desa);
          setGeojsonData(kec);
          setKecamatanOptions([...new Set(kec.features.map(f => f.properties.WADMKC))].sort());
        } catch (error) {
          console.error("Failed to fetch boundary data:", error);
        }
      };
      fetchData();
    }
  }, [geometryType]);

  const handleKecamatanFilterChange = (e) => {
    const kecName = e.target.value;
    setSelectedKecamatan(kecName);
    setSelectedDesa('');
    if (!kecName) {
      setGeojsonData(allKecamatanData);
      setMapLevel('kecamatan');
      setDesaOptions([]);
      if (onLocationChange) onLocationChange({ kecamatan: '', desa: '' });
      return;
    }
    const filteredDesas = allDesaData.features.filter(f => f.properties.WADMKC === kecName);
    const desaNames = [...new Set(filteredDesas.map(f => f.properties.NAMOBJ))].sort();
    setDesaOptions(desaNames);
    const newGeoJson = { ...allDesaData, features: filteredDesas };
    setGeojsonData(newGeoJson);
    setMapLevel('desa');
    if (onLocationChange) onLocationChange({ kecamatan: kecName, desa: '' });
  };

  const handleDesaFilterChange = (e) => {
    const desaName = e.target.value;
    setSelectedDesa(desaName);
    if (!desaName) {
      const filteredDesas = allDesaData.features.filter(f => f.properties.WADMKC === selectedKecamatan);
      const newGeoJson = { ...allDesaData, features: filteredDesas };
      setGeojsonData(newGeoJson);
      if (onLocationChange) onLocationChange({ kecamatan: selectedKecamatan, desa: '' });
      return;
    }
    const desaFeature = allDesaData.features.find(f => f.properties.NAMOBJ === desaName && f.properties.WADMKC === selectedKecamatan);
    if (desaFeature) {
      const newGeoJson = { type: 'FeatureCollection', features: [desaFeature] };
      setGeojsonData(newGeoJson);
      if (onLocationChange) onLocationChange({ kecamatan: selectedKecamatan, desa: desaName });
    }
  };

  const handleKecamatanClick = (e) => {
    const kecName = e.target.feature.properties.WADMKC;
    handleKecamatanFilterChange({ target: { value: kecName } });
    setSelectedKecamatan(kecName);
  };

  const handleDesaClick = (e) => {
    const desaName = e.target.feature.properties.NAMOBJ;
    handleDesaFilterChange({ target: { value: desaName } });
    setSelectedDesa(desaName);
  };

  const handleBackClick = () => {
    setSelectedDesa('');
    setDesaOptions([]);
    setMapLevel('kecamatan');
    setGeojsonData(allKecamatanData);
    setSelectedKecamatan('');
    if (onLocationChange) onLocationChange({ kecamatan: '', desa: '' });
  };

  const onEachFeature = (feature, layer) => {
    if (selectedDesa) {
      layer.setStyle({ interactive: false });
      return;
    }
    let content = '';
    const props = feature.properties;
    if (mapLevel === 'kecamatan') {
      content = `<b>Kecamatan: ${props.WADMKC}</b>`;
      layer.on({ click: handleKecamatanClick });
    } else if (mapLevel === 'desa') {
      content = `<b>Desa: ${props.NAMOBJ}</b>`;
      layer.on({ click: handleDesaClick });
    }
    if (content) layer.bindTooltip(content);
    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 3, color: '#3388ff' }),
      mouseout: (e) => e.target.setStyle(styleGeoJSON(feature)),
    });
  };

  const styleGeoJSON = () => {
    const colorMap = { kecamatan: '#28a745', desa: '#ffc107' };
    return { color: colorMap[mapLevel] || '#000000', weight: 2, fillOpacity: 0.1, interactive: true };
  };

  return (
    <div className="space-y-4">
      {geometryType === 'Polygon' && !initialGeometry && (
        <>
          <div className="flex space-x-4">
            <div className='flex-grow'>
              <label htmlFor="kecamatan-filter" className="block text-sm font-medium text-gray-700">1. Pilih Kecamatan</label>
              <select id="kecamatan-filter" value={selectedKecamatan} onChange={handleKecamatanFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">-- Semua Kecamatan --</option>
                {kecamatanOptions.map(kec => <option key={kec} value={kec}>{kec}</option>)}
              </select>
            </div>
            <div className='flex-grow'>
              <label htmlFor="desa-filter" className="block text-sm font-medium text-gray-700">2. Pilih Desa</label>
              <select id="desa-filter" value={selectedDesa} onChange={handleDesaFilterChange} disabled={!selectedKecamatan} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200">
                <option value="">-- Semua Desa --</option>
                {desaOptions.map(desa => <option key={desa} value={desa}>{desa}</option>)}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">3. Klik wilayah di peta untuk memilih, atau gunakan ikon di kiri atas untuk menggambar lahan.</p>
        </>
      )}
      {geometryType === 'Point' && (
        <p className="text-sm text-gray-500 mt-2">Gunakan ikon penanda (marker) di kiri atas untuk menandai lokasi toko di peta.</p>
      )}

      <div style={{ height: '400px', width: '100%' }} className="border border-gray-300 rounded-md relative">
        {geometryType === 'Polygon' && !initialGeometry && mapLevel !== 'kecamatan' && (
          <button onClick={handleBackClick} className="absolute top-3 left-14 z-[1000] bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow">
            Kembali
          </button>
        )}
        <MapContainer center={[-6.892, 110.6412]} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {geometryType === 'Polygon' && !initialGeometry && geojsonData && <GeoJSON data={geojsonData} style={styleGeoJSON} onEachFeature={onEachFeature} key={mapLevel + selectedKecamatan + selectedDesa} />}
          <DrawingControl onGeometryChange={onGeometryChange} onAreaChange={onAreaChange} initialGeometry={initialGeometry} geometryType={geometryType} />
          {geometryType === 'Polygon' && !initialGeometry && <MapEffects geojsonData={geojsonData} />}
        </MapContainer>
      </div>
      {initialGeometry && geometryType === 'Polygon' && (
        <p className="text-sm text-gray-500 mt-2">Gunakan kontrol di kiri atas peta untuk mengedit poligon lahan Anda.</p>
      )}
    </div>
  );
};

export default MapInput;
