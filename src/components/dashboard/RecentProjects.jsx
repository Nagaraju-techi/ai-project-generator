import { Link } from "react-router-dom";

function RecentProjects({ projects, loading }) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-700/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
        <p className="text-gray-400 mb-4">No projects saved yet</p>
        <Link
          to="/generator"
          className="text-purple-500 hover:text-purple-400 transition"
        >
          Generate your first project →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
      <div className="space-y-3">
        {projects.slice(0, 5).map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="block bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">{project.projectName || "Untitled"}</h4>
                <p className="text-gray-400 text-sm mt-1">
                  {project.techStackSelected || project.techStack?.[0] || "No stack"} • {project.difficulty || "Intermediate"}
                </p>
              </div>
              <span className="text-gray-500 text-sm">
                {project.createdAt?.toDate?.()
                  ? new Date(project.createdAt.toDate()).toLocaleDateString()
                  : "Recently"}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {projects.length > 5 && (
        <Link
          to="/saved-projects"
          className="block text-center text-purple-500 hover:text-purple-400 mt-4 text-sm"
        >
          View all {projects.length} projects →
        </Link>
      )}
    </div>
  );
}

export default RecentProjects;