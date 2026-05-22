import { Link } from "react-router-dom";
import Button from "../common/Button";

function SavedProjectsList({ projects, loading, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-700/50 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
        <p className="text-gray-400 mb-4">No saved projects yet</p>
        <Link to="/generator">
          <Button>Generate Your First Project</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition"
        >
          <div className="flex justify-between items-start">
            <Link to={`/project/${project.id}`} className="flex-1">
              <h3 className="text-white font-semibold hover:text-purple-400 transition">
                {project.projectName}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {project.techStack} • {project.difficulty} • {project.timeline}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {project.createdAt?.toDate?.()
                  ? new Date(project.createdAt.toDate()).toLocaleDateString()
                  : "Recently saved"}
              </p>
            </Link>
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-500 hover:text-red-400 transition p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SavedProjectsList;