function TechStackTags({ techStack }) {
  if (!techStack || techStack.length === 0) {
    return <p className="text-gray-400">No tech stack specified</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-400 mb-3">🛠️ Tech Stack</h3>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm text-white font-medium hover:bg-gray-600 transition cursor-default"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TechStackTags;