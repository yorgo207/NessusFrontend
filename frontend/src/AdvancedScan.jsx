import React, { useState } from 'react';

export default function AdvancedScan({ scanData, setScanData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openIndices, setOpenIndices] = useState(new Set());

  const fetchAdvancedScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/nessus/advanced');
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      console.log('✅ Received scan data:', data);
      setScanData(data);
    } catch (err) {
      setError('Failed to fetch advanced scan results.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    const newSet = new Set(openIndices);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setOpenIndices(newSet);
  };

  return (
    <div className="mt-8 text-white px-4">
      {!scanData && (
        <div className="flex justify-center mt-10">
          <button
            onClick={fetchAdvancedScan}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-xl font-semibold transition"
            disabled={loading}
          >
            {loading ? 'Launching Advanced Scan...' : 'Launch Advanced Scan'}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-10">
          <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full" />
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-6 font-medium">{error}</p>}

      {Array.isArray(scanData) && scanData.length > 0 && (
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Advanced Scan Results</h3>
          <div className="grid grid-cols-1 gap-6">
            {scanData.map((entry, idx) => {
              const pluginId = entry['Plugin ID'] || entry['plugin_id'] || 'N/A';
              const risk = entry['Risk'] || entry['risk'] || 'N/A';
              const isOpen = openIndices.has(idx);

              return (
                <div
                  key={idx}
                  onClick={() => toggleCard(idx)}
                  className={`mx-4 p-6 rounded-xl border border-blue-600 bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-2xl transition duration-200 cursor-pointer ${
                    idx === scanData.length - 1 ? 'mb-12' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400">{`Result #${idx + 1}`}</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        <strong>Plugin ID:</strong> {pluginId} | <strong>Risk:</strong> {risk}
                      </p>
                    </div>
                    <span className="text-gray-400 text-xl">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="mt-4 bg-gray-950 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-200 whitespace-pre-wrap">
                        {JSON.stringify(entry, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
