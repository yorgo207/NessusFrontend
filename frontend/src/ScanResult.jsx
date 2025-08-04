import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

async function fetchScanResults(interpreter) {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/nessus/result?interpreter=${interpreter}`);
  if (!response.ok) {
    throw new Error('Failed to fetch scan results');
  }
  return await response.json();
}

function ScanResults({ scanResults, setInterpreterResultsFetched }) {
  const [selectedInterpreter, setSelectedInterpreter] = useState('Gemini');
  const [loading, setLoading] = useState(false);
  const [newScanResults, setNewScanResults] = useState(null);
  const [error, setError] = useState(null);
  const [openIndices, setOpenIndices] = useState(new Set());

  const handleInterpreterChange = (e) => {
    setSelectedInterpreter(e.target.value);
  };

  const handleFetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchScanResults(selectedInterpreter);
      setNewScanResults(data);
      setInterpreterResultsFetched(true); 
    } catch (error) {
      setError('An error occurred while fetching results.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    const newSet = new Set(openIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setOpenIndices(newSet);
  };

  // Extract plugins from Markdown summary (string)
    function extractPluginSections(text) {
    const lines = text.split('\n');
    const introLines = [];
    const pluginSections = [];

    let collectingIntro = true;
    let currentSection = [];

    for (let line of lines) {
      if (line.startsWith('**')) {
        if (currentSection.length) {
          pluginSections.push(currentSection.join('\n'));
        }
        currentSection = [line];
        collectingIntro = false;
      } else if (collectingIntro) {
        introLines.push(line);
      } else {
        currentSection.push(line);
      }
    }

    if (currentSection.length) {
      pluginSections.push(currentSection.join('\n'));
    }

    return {
      intro: introLines.join('\n'),
      pluginSections,
    };
  }


  return (
    <div className="mt-8 text-white">
      {/* Static Scan Results Cards */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-semibold mb-8 mt-5 text-center">Scan Results</h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(scanResults).map(([key, value], index) => {
              const pluginId = value['Plugin ID'] || value['plugin_id'] || 'N/A';
              const risk = value['Risk'] || value['risk'] || 'N/A';
              const isOpen = openIndices.has(index);
              return (
                <div
                  key={key}
                  onClick={() => toggleCard(index)}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden mx-4 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-blue-500">{`${index + 1}`}</h3>
                      <p className="text-sm text-gray-300">
                        <strong>Plugin ID:</strong> {pluginId} | <strong>Risk:</strong> {risk}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {isOpen ? '▲ Collapse' : '▼ Expand'}
                    </span>
                  </div>
                  {isOpen && (
                    <pre className="mt-4 text-sm text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interpreter Selector */}
      <div className="mb-8 flex justify-center mt-10">
        <div className="w-1/2">
          <label className="block text-2xl text-white font-semibold mb-3 text-center">Select Interpreter</label>
          <select
            id="interpreter"
            value={selectedInterpreter}
            onChange={handleInterpreterChange}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
          >
            <option value="Gemini">Gemini</option>
            <option value="Cohere">Cohere</option>
            <option value="WhiterabbitNeo">WhiterabbitNeo</option>
          </select>
        </div>
      </div>

      {/* Fetch Button */}
      <div className="mb-8 flex justify-center mt-10">
        <button
          onClick={handleFetchResults}
          className="w-1/4 p-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch New Results'}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Markdown Summary with Plugin Cards */}
      {newScanResults && typeof newScanResults === 'string' && (() => {
        const { intro, pluginSections } = extractPluginSections(newScanResults);
        return (
          <div className="mt-12 text-white px-4">
            <h3 className="text-3xl font-bold mb-6 text-center">Fetched Scan Summary</h3>

            {/* Intro Summary */}
            <div className="bg-gray-900 rounded-xl shadow-lg mb-10 p-6">
              <div className="prose prose-invert max-w-none text-white">
                <ReactMarkdown>{intro.trim()}</ReactMarkdown>
              </div>
            </div>

            {/* Plugin Sections as Cards */}
           <div className="grid grid-cols-1 gap-4">
            {pluginSections.map((section, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg shadow-md border-l-4 border-r-4 border-blue-500 hover:bg-gray-700 hover:shadow-lg transition duration-200 px-2 mx-5 my-1"
              >
                <div className="p-4">
                  <div className="prose prose-invert max-w-none text-white">
                    <ReactMarkdown>{section.trim()}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        );
      })()}

    </div>
  );
}

export default ScanResults;
