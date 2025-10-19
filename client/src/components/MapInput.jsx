import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import area from '@turf/area'; // Import Turf.js for area calculation
import '@geoman-io/leaflet-geoman-free'; // For drawing controls
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'; // Geoman styles

// Fix for default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// This component handles the drawing functionality using Leaflet-Geoman
const DrawingControl = ({ onGeometryChange, onAreaChange, initialGeometry }) => {
  const map = useMap();
  const drawnItemsRef = useRef(new L.FeatureGroup()).current;

  useEffect(() => {
    if (!map) return;

    map.addLayer(drawnItemsRef);

    // Add Geoman controls for drawing and editing polygons
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawText: false,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
    });

    // Function to calculate area and propagate geometry changes
    const calculateAndPropagate = (layer) => {
      const geojson = layer.toGeoJSON();
      onGeometryChange(geojson.geometry);

      // Calculate area in square meters using Turf.js
      const areaSqm = area(geojson);
      const areaHectares = areaSqm / 10000;
      // Pass the raw number back to the parent form.
      // The parent component is responsible for formatting.
      onAreaChange(areaHectares);
    };

    // Event listeners for Geoman actions
    map.on('pm:create', (e) => {
      const { layer } = e;
      drawnItemsRef.clearLayers(); // Ensure only one polygon exists at a time
      drawnItemsRef.addLayer(layer);
      calculateAndPropagate(layer);
      map.pm.disableDraw(); // Disable drawing mode after creation to allow map interaction
    });

    map.on('pm:remove', () => {
      drawnItemsRef.clearLayers();
      onGeometryChange(null);
      onAreaChange(0);
    });

    map.on('pm:edit', (e) => {
      calculateAndPropagate(e.layer);
    });

    // Cleanup function to remove controls and layers
    return () => {
      if (map.pm) {
        map.pm.removeControls();
      }
      map.removeLayer(drawnItemsRef);
      map.off('pm:create');
      map.off('pm:remove');
      map.off('pm:edit');
    };
  }, [map, onGeometryChange, onAreaChange, drawnItemsRef]);

  useEffect(() => {
    if (initialGeometry && map && drawnItemsRef.getLayers().length === 0) {
      const geoJsonFeature = {
        type: 'Feature',
        geometry: initialGeometry,
      };

      const initialLayer = L.geoJSON(geoJsonFeature);
      
      initialLayer.eachLayer(layer => {
        // Make sure the layer has the correct styling for editing
        if (layer.setStyle) {
          layer.setStyle({ color: 'orange' });
        }
        drawnItemsRef.addLayer(layer);
      });
      
      if (drawnItemsRef.getBounds().isValid()) {
        map.fitBounds(drawnItemsRef.getBounds(), { padding: [50, 50] });
      }
    }
  }, [initialGeometry, map, drawnItemsRef]);

  return null;
};

// New component to handle map side-effects like auto-zooming.
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


/**
 * A map input component that allows users to either select a location by drilling down 
 * from district (kecamatan) to village (desa) or by drawing a polygon.
 */
const MapInput = ({ onGeometryChange, onAreaChange, onLocationChange, initialGeometry }) => {
  const [mapLevel, setMapLevel] = useState('kecamatan');
  const [geojsonData, setGeojsonData] = useState(null);
  
  // Data stores for boundary geometries
  const [allKecamatanData, setAllKecamatanData] = useState(null);
  const [allDesaData, setAllDesaData] = useState(null);

  // State for filter dropdowns
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [desaOptions, setDesaOptions] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedDesa, setSelectedDesa] = useState('');

  // 1. Fetch initial boundary data (kecamatan and desa)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kec, desa] = await Promise.all([
          fetch('/batas_kecamatan_demak.geojson').then(res => res.json()),
          fetch('/batas_desa_demak.geojson').then(res => res.json()),
        ]);

        setAllKecamatanData(kec);
        setAllDesaData(desa);
        setGeojsonData(kec); // Start with kecamatan level
        setKecamatanOptions([...new Set(kec.features.map(f => f.properties.WADMKC))].sort());
      } catch (error) {
        console.error("Failed to fetch boundary data:", error);
      }
    };
    fetchData();
  }, []);

  // 2. Handlers for filter dropdowns
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

  // 3. Handlers for map clicks to drill down
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

  // Handler for the "Back" button
  const handleBackClick = () => {
    setSelectedDesa('');
    setDesaOptions([]);
    setMapLevel('kecamatan');
    setGeojsonData(allKecamatanData);
    setSelectedKecamatan('');
    if (onLocationChange) onLocationChange({ kecamatan: '', desa: '' });
  };

  // 4. Function to attach events and tooltips to each GeoJSON feature
  const onEachFeature = (feature, layer) => {
    // If a specific village is selected, make its polygon non-interactive
    // to allow drawing over it without interference.
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
    
    if (content) {
      layer.bindTooltip(content);
    }

    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 3, color: '#3388ff' }),
      mouseout: (e) => e.target.setStyle(styleGeoJSON(feature)),
    });
  };

  // Style function for GeoJSON layers
  const styleGeoJSON = () => {
    const colorMap = { kecamatan: '#28a745', desa: '#ffc107' };
    return { 
      color: colorMap[mapLevel] || '#000000', 
      weight: 2, 
      fillOpacity: 0.1,
      interactive: true, // Make sure layers are interactive by default
    };
  };

  return (
    <div className="space-y-4">
      {!initialGeometry && (
        <>
          {/* Filter Dropdowns */}
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

      {/* Map Container */}
      <div style={{ height: '400px', width: '100%' }} className="border border-gray-300 rounded-md relative">
          {!initialGeometry && mapLevel !== 'kecamatan' && (
              <button 
                  onClick={handleBackClick} 
                  className="absolute top-3 left-14 z-[1000] bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow"
              >
                  Kembali
              </button>
          )}
          <MapContainer center={[-6.892, 110.6412]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              
              {!initialGeometry && geojsonData && <GeoJSON data={geojsonData} style={styleGeoJSON} onEachFeature={onEachFeature} key={mapLevel + selectedKecamatan + selectedDesa} />}
              
              <DrawingControl onGeometryChange={onGeometryChange} onAreaChange={onAreaChange} initialGeometry={initialGeometry} />
              
              {/* This component now handles the auto-zoom functionality */}
              {!initialGeometry && <MapEffects geojsonData={geojsonData} />}
          </MapContainer>
      </div>
      {initialGeometry && (
        <p className="text-sm text-gray-500 mt-2">Gunakan kontrol di kiri atas peta untuk mengedit poligon lahan Anda.</p>
      )}
    </div>
  );
};

export default MapInput;