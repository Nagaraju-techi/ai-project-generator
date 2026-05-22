function ArchitectureBox({ schema, description }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-400 mb-3">🏗️ Architecture Overview</h3>
      {description && (
        <p className="text-gray-300 mb-3">{description}</p>
      )}
      {schema && (
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Database Schema</h4>
          <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
            {schema}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ArchitectureBox;