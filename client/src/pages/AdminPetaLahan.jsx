import React, { useState } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import LahanTable from '../components/LahanTable';
import LahanDetailModal from '../components/LahanDetailModal';

const AdminPetaLahan = () => {
  const [lahanForTable, setLahanForTable] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLahan, setSelectedLahan] = useState(null);

  const handleOpenModal = (lahan) => {
    setSelectedLahan(lahan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLahan(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Peta Lahan Interaktif</h1>
      
      <div style={{ height: '60vh', width: '100%' }}>
        <InteractiveMap onFilteredLahanChange={setLahanForTable} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Data Lahan (Sesuai Pilihan Peta)</h2>
        <LahanTable lahans={lahanForTable} onOpenModal={handleOpenModal} />
      </div>

      {isModalOpen && (
        <LahanDetailModal lahan={selectedLahan} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AdminPetaLahan;
