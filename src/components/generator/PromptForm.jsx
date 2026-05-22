function PromptForm({ formData, setFormData, onSubmit, loading }) {
  const options = {
    techStacks: ["MERN", "MEAN", "Python/Django", "Java/Spring Boot", "Flutter", "React Native", "Next.js", "Vue.js"],
    interests: ["E-commerce", "Social Media", "Healthcare", "Fintech", "Education", "Gaming", "AI/ML", "IoT"],
    difficulties: ["Beginner", "Intermediate", "Advanced"],
    timelines: ["2 weeks", "4 weeks", "8 weeks", "12 weeks"],
    projectTypes: ["Full Stack Web", "Mobile App", "API/Backend", "Frontend Only", "Database Design", "Cloud Native"],
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Tech Stack *</label>
          <select
            value={formData.techStack}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Tech Stack</option>
            {options.techStacks.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Domain Interest *</label>
          <select
            value={formData.interest}
            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Domain</option>
            {options.interests.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Difficulty Level</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          >
            {options.difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Project Timeline</label>
          <select
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          >
            {options.timelines.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-300 mb-2">Project Type</label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          >
            {options.projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.techStack || !formData.interest}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Project Idea 🚀"}
      </button>
    </form>
  );
}

export default PromptForm;