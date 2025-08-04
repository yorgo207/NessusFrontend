import React, { useState } from 'react';
import "./NessusScanForm.css";
import { useNavigate } from 'react-router-dom';

async function submitUserData(formData) {
  const response = await fetch('http://127.0.0.1:8000/api/v1/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      password: formData.password,
      scan_name: formData.scan_name,
      scan_type: formData.scan_type,
      scan_ip: formData.scan_ip,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

async function fetchScanResults() {
  const response = await fetch('http://127.0.0.1:8000/api/v1/nessus/new', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch results: ${response.status}`);
  }

  return await response.json();
}

export default function NessusScanForm({ setScanResults, resetAllResults}) {
  const navigate = useNavigate(); // ✅ must be inside the component

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    scan_name: '',
    scan_type: 'Basic Scan',
    scan_ip: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buttonText, setButtonText] = useState("Start Nessus Scan");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAllResults();
    setButtonText("Submitting...");
    setLoading(true);

    try {
      await submitUserData(formData);
      const scanData = await fetchScanResults();
      setScanResults(scanData);
      navigate('/results'); 
    } catch (error) {
      console.error("Error:", error);
      setButtonText("Retry Scan");
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0f172a] flex items-center justify-center py-10 overflow-x-hidden">
      <form onSubmit={handleSubmit} className="w-screen h-full bg-[#0f172a] p-10 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-10 text-center">Credentials</h1>

          {[ 
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Scan Name', name: 'scan_name', type: 'text' },
            { label: 'Scan IP', name: 'scan_ip', type: 'text' },
          ].map((field) => (
            <div key={field.name} className="mb-6">
              <label className="block text-2xl text-white font-semibold mb-3">{field.label}</label>
              <input
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                type={field.type}
                required
                disabled={loading}
              />
            </div>
          ))}

          <div className="mb-8">
            <label className="block text-2xl text-white font-semibold mb-3">Scan Type</label>
            <select
              name="scan_type"
              value={formData.scan_type}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
              disabled={loading}
            >
              <option value="Basic Network Scan">Basic Network Scan</option>
              <option value="Host Discovery">Host Discovery</option>
              <option value="Ping-Only Discovery">Ping-Only Discovery</option>
            </select>
          </div>

          {loading && (
            <div className="spinner-container text-center">
              <div className="spinner mb-2"></div>
              <p className="text-white">Loading, please wait...</p>
            </div>
          )}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {!loading && (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded text-lg transition"
            >
              {buttonText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
