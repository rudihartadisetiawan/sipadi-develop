'use strict';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../lib/api';

// Fix for default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const PetaToko = () => {
  const [tokos, setTokos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokos = async () => {
      try {
        setLoading(true);
        // The service defaults to fetching 'aktif' status shops
        const response = await api.get('/toko');
        setTokos(response.results || []);
      } catch (err) {
        setError('Gagal memuat data toko pertanian.');
        console.error('Error fetching toko:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTokos();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading map...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Peta Toko Pertanian</h1>
      <div className="bg-white shadow rounded-lg p-4" style={{ height: '600px' }}>
        <MapContainer center={[-6.892, 110.6412]} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {tokos.map(toko => (
            toko.geometry && (
              <Marker key={toko.id} position={[toko.geometry.coordinates[1], toko.geometry.coordinates[0]]}>
                <Popup>
                  <div className="font-bold text-lg">{toko.nama_toko}</div>
                  <p><strong>Jam Buka:</strong> {toko.jam_buka?.substring(0, 5) || '-'} - {toko.jam_tutup?.substring(0, 5) || '-'}</p>
                  <p><strong>Produk:</strong> {toko.produk || '-'}</p>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PetaToko;
