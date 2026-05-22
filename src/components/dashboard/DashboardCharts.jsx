function DashboardCharts({ projects }) {
  // Calculate statistics
  const techStackCount = {};
  const difficultyCount = { Beginner: 0, Intermediate: 0, Advanced: 0 };

  projects.forEach((project) => {
    if (project.techStack) {
      techStackCount[project.techStack] = (techStackCount[project.techStack] || 0) + 1;
    }
    if (project.difficulty) {
      difficultyCount[project.difficulty] = (difficultyCount[project.difficulty] || 0) + 1;
    }
  });

  const topTechStacks = Object.entries(techStackCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCount = Math.max(...Object.values(difficultyCount), 1);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Difficulty Distribution */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Projects by Difficulty
        </h3>
        <div className="space-y-3">
          {Object.entries(difficultyCount).map(([level, count]) => (
            <div key={level}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{level}</span>
                <span className="text-gray-400">{count} projects</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                                    level === "Beginner"
                    ? "bg-green-500"
                    : level === "Intermediate"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                  }`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tech Stacks */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Popular Tech Stacks
        </h3>
        {topTechStacks.length > 0 ? (
          <div className="space-y-3">
            {topTechStacks.map(([tech, count], index) => (
              <div key={tech} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                  <span className="text-gray-300">{tech}</span>
                </div>
                <span className="text-purple-400 font-medium">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">
            Generate projects to see statistics
          </p>
        )}
      </div>
    </div>
  );
}

export default DashboardCharts;