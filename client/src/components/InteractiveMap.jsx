import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const InteractiveMap = ({ onFilteredLahanChange }) => {
  const [mapLevel, setMapLevel] = useState('kecamatan');
  const [geojsonData, setGeojsonData] = useState(null);
  const [lahanMarkers, setLahanMarkers] = useState([]);
  
  const [allKecamatanData, setAllKecamatanData] = useState(null);
  const [allDesaData, setAllDesaData] = useState(null);
  const [allLahanData, setAllLahanData] = useState([]);
  const [lahanCounts, setLahanCounts] = useState({});

  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [desaOptions, setDesaOptions] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedDesa, setSelectedDesa] = useState('');

  const mapRef = useRef();



  useEffect(() => {
    const getAuthToken = () => {
      const tokenNames = ['accessToken', 'token', 'authToken', 'access_token'];
      for (const name of tokenNames) {
        const token = localStorage.getItem(name) || sessionStorage.getItem(name);
        if (token) return token;
      }
      return null;
    };

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

        const token = getAuthToken();
        if (token) {
          const lahanRes = await fetch('http://localhost:5000/v1/admin/map/lahan', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (lahanRes.ok) {
            const lahanJson = await lahanRes.json();
            const transformedLahan = lahanJson.map(l => ({
                ...l,
                lat: l.centroid?.coordinates[1],
                lng: l.centroid?.coordinates[0],
            })).filter(l => l.lat && l.lng);
            setAllLahanData(transformedLahan);
            if (onFilteredLahanChange) {
              onFilteredLahanChange(transformedLahan);
            }
            setLahanMarkers([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!allLahanData.length || !allKecamatanData || !allDesaData) return;
    const counts = {};
    allKecamatanData.features.forEach(feature => {
      const kecName = feature.properties.WADMKC;
      counts[kecName] = allLahanData.filter(lahan => lahan.kecamatan === kecName).length;
    });
    allDesaData.features.forEach(feature => {
      const desaName = feature.properties.NAMOBJ;
      counts[desaName] = allLahanData.filter(lahan => lahan.desa === desaName).length;
    });
    setLahanCounts(counts);
  }, [allLahanData, allKecamatanData, allDesaData]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && geojsonData?.features.length) {
      const bounds = L.geoJSON(geojsonData).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [geojsonData]);

  const handleKecamatanFilterChange = (e) => {
    const kecName = e.target.value;
    setSelectedKecamatan(kecName);
    setSelectedDesa('');
    setLahanMarkers([]);
    if (!kecName) {
      setGeojsonData(allKecamatanData);
      setMapLevel('kecamatan');
      setDesaOptions([]);
      if (onFilteredLahanChange) {
        onFilteredLahanChange(allLahanData);
      }
      return;
    }
    const filteredLahan = allLahanData.filter(lahan => lahan.kecamatan === kecName);
    if (onFilteredLahanChange) {
      onFilteredLahanChange(filteredLahan);
    }
    const filteredDesas = allDesaData.features.filter(f => f.properties.WADMKC === kecName);
    const desaNames = [...new Set(filteredDesas.map(f => f.properties.NAMOBJ))].sort();
    setDesaOptions(desaNames);
    const newGeoJson = { ...allDesaData, features: filteredDesas };
    setGeojsonData(newGeoJson);
    setMapLevel('desa');
  };

  const handleDesaFilterChange = (e) => {
    const desaName = e.target.value;
    setSelectedDesa(desaName);
    if (!desaName) {
      const filteredLahan = allLahanData.filter(lahan => lahan.kecamatan === selectedKecamatan);
      if (onFilteredLahanChange) {
        onFilteredLahanChange(filteredLahan);
      }
      setLahanMarkers([]);
      const filteredDesas = allDesaData.features.filter(f => f.properties.WADMKC === selectedKecamatan);
      const newGeoJson = { ...allDesaData, features: filteredDesas };
      setGeojsonData(newGeoJson);
      return;
    }
    const desaFeature = allDesaData.features.find(f => f.properties.NAMOBJ === desaName && f.properties.WADMKC === selectedKecamatan);
    if (desaFeature) {
      const newGeoJson = { type: 'FeatureCollection', features: [desaFeature] };
      setGeojsonData(newGeoJson);
      const markers = allLahanData.filter(lahan => lahan.desa === desaName);
      if (onFilteredLahanChange) {
        onFilteredLahanChange(markers);
      }
      setLahanMarkers(markers);
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
    if (selectedDesa) {
      setSelectedDesa('');
      const filteredLahan = allLahanData.filter(lahan => lahan.kecamatan === selectedKecamatan);
      if (onFilteredLahanChange) {
        onFilteredLahanChange(filteredLahan);
      }
      setLahanMarkers([]);
      const filteredDesas = allDesaData.features.filter(f => f.properties.WADMKC === selectedKecamatan);
      const newGeoJson = { ...allDesaData, features: filteredDesas };
      setGeojsonData(newGeoJson);
    } else {
      setSelectedKecamatan('');
      setSelectedDesa('');
      setDesaOptions([]);
      if (onFilteredLahanChange) {
        onFilteredLahanChange(allLahanData);
      }
      setLahanMarkers([]);
      setGeojsonData(allKecamatanData);
      setMapLevel('kecamatan');
    }
  };

  const onEachFeature = (feature, layer) => {
    let content = '';
    const props = feature.properties;
    let count = 0;
    switch (mapLevel) {
      case 'kecamatan':
        count = lahanCounts[props.WADMKC] || 0;
        content = `<b>Kecamatan: ${props.WADMKC}</b><br/>Jumlah Lahan: ${count}`;
        layer.on({ click: handleKecamatanClick });
        break;
      case 'desa':
        count = lahanCounts[props.NAMOBJ] || 0;
        content = `<b>Desa: ${props.NAMOBJ}</b><br/>Jumlah Lahan: ${count}`;
        layer.on({ click: handleDesaClick });
        break;
    }
    layer.bindPopup(content);
    layer.on({
        mouseover: (e) => e.target.setStyle({ weight: 3, color: '#3388ff' }),
        mouseout: (e) => e.target.setStyle(styleGeoJSON(feature)),
    });
  };

  const styleGeoJSON = (feature) => {
    const colorMap = { kecamatan: '#28a745', desa: '#ffc107' };
    return { 
        color: colorMap[mapLevel] || '#000000', 
        weight: 2, 
        fillOpacity: 0.1 
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex space-x-4 items-center">
          <div className='flex-grow'>
              <label htmlFor="kecamatan-filter" className="block text-sm font-medium text-gray-700">Kecamatan</label>
              <select id="kecamatan-filter" value={selectedKecamatan} onChange={handleKecamatanFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">-- Pilih Kecamatan --</option>
                  {kecamatanOptions.map(kec => <option key={kec} value={kec}>{kec}</option>)}
              </select>
          </div>
          <div className='flex-grow'>
              <label htmlFor="desa-filter" className="block text-sm font-medium text-gray-700">Desa</label>
              <select id="desa-filter" value={selectedDesa} onChange={handleDesaFilterChange} disabled={!selectedKecamatan} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200">
                  <option value="">-- Pilih Desa --</option>
                  {desaOptions.map(desa => <option key={desa} value={desa}>{desa}</option>)}
              </select>
          </div>
      </div>

      <div className="flex-grow border border-gray-300 rounded-md relative">
          {mapLevel !== 'kecamatan' && (
              <button 
                  onClick={handleBackClick} 
                  className="absolute top-3 left-14 z-[1000] bg-white hover:bg-gray-100 text-gray-800 font-poppins py-2 px-4 border border-gray-400 rounded shadow"
              >
                  Kembali
              </button>
          )}
          <MapContainer center={[-6.892, 110.6412]} zoom={10} style={{ height: '100%', width: '100%' }} ref={mapRef}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              {geojsonData && <GeoJSON data={geojsonData} style={styleGeoJSON} onEachFeature={onEachFeature} key={mapLevel + selectedKecamatan + selectedDesa} />}
              {lahanMarkers.map(lahan => (
                  <Marker key={lahan.id} position={[lahan.lat, lahan.lng]}>
                      <Popup>
                          <b>{lahan.nama_lahan}</b><br />
                          Pemilik: {lahan.user.name}<br />
                          Luas: {lahan.luas} Ha
                      </Popup>
                  </Marker>
              ))}
          </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveMap;
