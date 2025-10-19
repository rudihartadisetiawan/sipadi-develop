import React from 'react';

const LahanTable = ({ lahans, onOpenModal }) => {
  if (!lahans || lahans.length === 0) {
    return <p className="text-gray-500">Tidak ada data lahan yang cocok dengan filter.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lahan</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemilik</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas (Ha)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desa</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lahans.map((lahan) => (
            <tr key={lahan.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lahan.nama_lahan}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lahan.user?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lahan.luas}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lahan.kecamatan}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lahan.desa}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onOpenModal(lahan)} 
                  className="border border-green-500 text-green-600 hover:bg-green-50 rounded px-2 py-1 text-xs"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LahanTable;