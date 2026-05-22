import { useState } from "react";
import Button from "../common/Button";

function ProjectCard({ project, onSave, isSaved }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{project.projectName}</h3>
          <div className="flex gap-2 mt-2">
            {project.techStack?.slice(0, 3).map((tech, i) => (
              <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
        {onSave && (
          <Button
            onClick={() => onSave(project)}
            variant={isSaved ? "success" : "primary"}
            size="sm"
            disabled={isSaved}
          >
            {isSaved ? "Saved" : "Save Project"}
          </Button>
        )}
      </div>

      <p className="text-gray-300 mb-4 line-clamp-2">
        {project.description}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-purple-500 hover:text-purple-400 text-sm"
      >
        {expanded ? "Show Less" : "Read More"}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
          <div>
            <h4 className="font-semibold text-purple-400">Key Features</h4>
            <ul className="list-disc list-inside text-gray-300 mt-1">
              {project.keyFeatures?.slice(0, 3).map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400">Timeline</h4>
            <p className="text-gray-300">{project.implementationRoadmap?.[0]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;