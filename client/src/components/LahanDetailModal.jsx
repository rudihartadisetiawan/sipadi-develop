import React from 'react';
import DetailMap from './DetailMap';

const LahanDetailModal = ({ lahan, onClose }) => {
  if (!lahan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Detail Lahan: {lahan.nama_lahan}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Pemilik:</span> {lahan.user?.name || 'N/A'}</p>
              <p><span className="font-semibold">Luas:</span> {lahan.luas} Ha</p>
              <p><span className="font-semibold">Jenis Tanaman:</span> {lahan.jenis_tanaman || 'N/A'}</p>
            </div>
            <div>
              <p><span className="font-semibold">Kecamatan:</span> {lahan.kecamatan}</p>
              <p><span className="font-semibold">Desa:</span> {lahan.desa}</p>
              <p><span className="font-semibold">Alamat:</span> {lahan.alamat || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Peta Lokasi</h3>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <DetailMap geometry={lahan.geometry} />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LahanDetailModal;
