function RoadmapCard({ roadmap }) {
  if (!roadmap || roadmap.length === 0) {
    return <p className="text-gray-400">No roadmap available</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-400 mb-3">📅 Implementation Roadmap</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-500/30"></div>
        <div className="space-y-4">
          {roadmap.map((step, index) => (
            <div key={index} className="relative pl-10">
              <div className="absolute left-0 top-1 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500">
                <span className="text-purple-400 text-sm font-bold">{index + 1}</span>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-gray-300">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoadmapCard;