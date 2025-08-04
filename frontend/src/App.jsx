import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import NessusScanForm from './NessusScanForm';
import ScanResults from './ScanResult';
import AdvancedScan from './AdvancedScan';





function App() {
  const [scanResults, setScanResults] = useState(null);
  const [advancedScanResults, setAdvancedScanResults] = useState(null);
  const [interpreterResultsFetched, setInterpreterResultsFetched] = useState(false);

  const resetAllResults = () => {
  setScanResults(null);
  setInterpreterResultsFetched(false);
  setAdvancedScanResults(null);
};

  
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/scan" />} />

        <Route
          path="/scan"
          element={<NessusScanForm setScanResults={setScanResults} resetAllResults={resetAllResults} />}
        />

        <Route
          path="/results"
          element={
            scanResults ? (
              <ScanResults
                scanResults={scanResults}
                setInterpreterResultsFetched={setInterpreterResultsFetched} // ✅ pass setter
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="text-5xl text-blue-500 mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2">No Scan Results Found</h2>
                <p className="text-gray-300">
                  Please go to <span className="text-blue-400 font-semibold">New Scan</span> and run a scan first.
                </p>
              </div>
            )
          }
        />

        <Route
          path="/advanced"
          element={
            scanResults ? (
              interpreterResultsFetched ? (
                <AdvancedScan
                  scanData={advancedScanResults}
                  setScanData={setAdvancedScanResults}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                  <div className="text-5xl text-yellow-400 mb-4">🚫</div>
                  <h2 className="text-2xl font-bold mb-2">Interpreter Results Missing</h2>
                  <p className="text-gray-300">
                    Please go to <span className="text-blue-400 font-semibold">AI Interpreter</span> and fetch results before launching an Advanced Scan.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="text-5xl text-blue-500 mb-4">🚫</div>
                <h2 className="text-2xl font-bold mb-2">Advanced Scan Blocked</h2>
                <p className="text-gray-300">
                  Please run a <span className="text-blue-400 font-semibold">New Scan</span> before launching an Advanced Scan.
                </p>
              </div>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
