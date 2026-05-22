function FeatureList({ features }) {
  if (!features || features.length === 0) {
    return <p className="text-gray-400">No features listed</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-400 mb-3">✨ Key Features</h3>
      <div className="grid md:grid-cols-2 gap-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400 mt-1">✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureList;