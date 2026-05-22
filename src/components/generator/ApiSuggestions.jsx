function ApiSuggestions({ endpoints }) {
  if (!endpoints || endpoints.length === 0) {
    return <p className="text-gray-400">No API endpoints suggested</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-400 mb-3">🔌 API Endpoints</h3>
      <div className="grid md:grid-cols-2 gap-2">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="bg-gray-900/50 rounded-lg p-2 font-mono text-sm text-gray-300">
            <code>{endpoint}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiSuggestions;