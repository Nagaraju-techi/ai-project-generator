import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Generator() {
  const [formData, setFormData] = useState({
    techStack: "",
    interest: "",
    difficulty: "Intermediate",
    timeline: "4 weeks",
    projectType: "Full Stack Web"
  });
  const [generatedProject, setGeneratedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const options = {
    techStacks: ["MERN", "MEAN", "Python/Django", "Java/Spring Boot", "Flutter", "React Native", "Next.js", "Vue.js"],
    interests: ["E-commerce", "Social Media", "Healthcare", "Fintech", "Education", "Gaming", "AI/ML", "IoT"],
    difficulties: ["Beginner", "Intermediate", "Advanced"],
    timelines: ["2 weeks", "4 weeks", "8 weeks", "12 weeks"],
    projectTypes: ["Full Stack Web", "Mobile App", "API/Backend", "Frontend Only", "Database Design", "Cloud Native"]
  };

  // Mock API for testing (no real API call needed)
  const generateProject = async () => {
    setLoading(true);
    setError("");

    // Validate form inputs
    if (!formData.techStack || !formData.interest) {
      setError("Please select both Tech Stack and Domain Interest");
      setLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      // Dynamic tech stack based on selection
      let techStackArray = [];
      if (formData.techStack === "MERN") {
        techStackArray = ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS"];
      } else if (formData.techStack === "Python/Django") {
        techStackArray = ["Python", "Django", "PostgreSQL", "Bootstrap", "Django REST"];
      } else if (formData.techStack === "Next.js") {
        techStackArray = ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"];
      } else if (formData.techStack === "Flutter") {
        techStackArray = ["Flutter", "Dart", "Firebase", "REST APIs"];
      } else {
        techStackArray = [formData.techStack, "React", "Node.js", "MongoDB", "Express"];
      }

      // Mock project data based on form inputs
      const mockProject = {
        projectName: `${formData.techStack} ${formData.interest} ${formData.projectType === "Mobile App" ? "App" : "Platform"}`,
        description: `A ${formData.difficulty.toLowerCase()} level, ${formData.timeline} project that builds a complete ${formData.interest} solution using ${formData.techStack}. This production-ready application demonstrates modern software development practices, clean architecture, and scalable design patterns.`,
        keyFeatures: [
          "🔐 Complete authentication system (JWT)",
          "📊 Interactive dashboard with analytics",
          "⚡ Real-time data synchronization",
          "📱 Fully responsive design",
          "🔍 Advanced search and filtering",
          "📧 Email notifications",
          "📄 Export data (PDF/CSV)",
          "👨‍💻 Admin panel for management"
        ],
        techStack: techStackArray,
        databaseSchema: `Main collections: users (profile, roles), ${formData.interest.toLowerCase()}_items (content, metadata), transactions (activity log), sessions (analytics). Relationships: One-to-many between users and items, many-to-many for sharing.`,
        apiEndpoints: [
          "POST /api/auth/register",
          "POST /api/auth/login",
          "GET /api/dashboard/stats",
          `GET /api/${formData.interest.toLowerCase()}/list`,
          `POST /api/${formData.interest.toLowerCase()}/create`,
          `PUT /api/${formData.interest.toLowerCase()}/:id`,
          "GET /api/user/profile",
          "PUT /api/user/profile"
        ],
        implementationRoadmap: [
          `Week 1 (Days 1-7): Project setup, authentication, database models`,
          `Week 2 (Days 8-14): Core ${formData.interest} features implementation`,
          `Week 3 (Days 15-21): API integration, real-time updates, testing`,
          `Week 4 (Days 22-28): Deployment, documentation, performance optimization`
        ],
        deploymentGuidance: `Deploy using:\n• Backend: Render/Railway/AWS (₹0-500/month)\n• Frontend: Vercel/Netlify (Free tier)\n• Database: MongoDB Atlas (Free tier 512MB)\n• Environment variables for all secrets\n• Set up CI/CD with GitHub Actions`,
        futureEnhancements: [
          "🤖 AI-powered recommendations",
          "📱 Mobile app with React Native",
          "💬 Real-time chat feature",
          "📊 Advanced analytics dashboard",
          "🌍 Multi-language support",
          "💰 Payment gateway integration"
        ]
      };

      setGeneratedProject(mockProject);
      setLoading(false);
    }, 1500);
  };

  const testApiKey = async () => {
    console.log("🔧 Testing API key...");
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Say 'API is working!'");
      const response = await result.response;
      const text = response.text();
      console.log("✅ API Test Success:", text);
      alert(`✅ API Test Success! Response: ${text}`);
    } catch (err) {
      console.error("❌ API Test Failed:", err);
      alert(`❌ API Test Failed: ${err.message}\n\nYou need to enable billing for Gemini API.`);
    }
  };

  const saveToFirebase = async () => {
    if (!generatedProject) {
      setError("No project to save. Generate a project first!");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Ensure all array fields are actually arrays
      const projectToSave = {
        projectName: generatedProject.projectName || "Untitled Project",
        description: generatedProject.description || "",
        keyFeatures: Array.isArray(generatedProject.keyFeatures) ? generatedProject.keyFeatures : [],
        techStack: Array.isArray(generatedProject.techStack) ? generatedProject.techStack : [],
        databaseSchema: generatedProject.databaseSchema || "",
        apiEndpoints: Array.isArray(generatedProject.apiEndpoints) ? generatedProject.apiEndpoints : [],
        implementationRoadmap: Array.isArray(generatedProject.implementationRoadmap) ? generatedProject.implementationRoadmap : [],
        deploymentGuidance: generatedProject.deploymentGuidance || "",
        futureEnhancements: Array.isArray(generatedProject.futureEnhancements) ? generatedProject.futureEnhancements : [],
        // Form data
        techStackSelected: formData.techStack,
        interest: formData.interest,
        difficulty: formData.difficulty,
        timeline: formData.timeline,
        projectType: formData.projectType,
        // User info
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        userName: auth.currentUser?.displayName || "User",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "projects"), projectToSave);
      console.log("Project saved with ID:", docRef.id);
      alert("✅ Project saved successfully to Firebase!");
      
      // Reset form after successful save
      setGeneratedProject(null);
      
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">AI Project Generator</h1>

          {/* Form Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Project Requirements</h2>

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
                  {options.techStacks.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
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
                  {options.interests.map(interest => (
                    <option key={interest} value={interest}>{interest}</option>
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
                  {options.difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
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
                  {options.timelines.map(time => (
                    <option key={time} value={time}>{time}</option>
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
                  {options.projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={generateProject}
              disabled={loading || !formData.techStack || !formData.interest}
              className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Project Idea 🚀"
              )}
            </button>

            <button
              onClick={testApiKey}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              🧪 Test Gemini API Key
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Generated Project Display */}
          {generatedProject && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-2xl font-bold text-white">{generatedProject.projectName}</h2>
                <button
                  onClick={saveToFirebase}
                  disabled={saving}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "💾 Save Project"
                  )}
                </button>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">{generatedProject.description}</p>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">✨ Key Features</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {generatedProject.keyFeatures?.map((feature, i) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <span className="text-purple-400">•</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">🛠️ Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedProject.techStack?.map((tech, i) => (
                      <span key={i} className="bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-white font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">🗄️ Database Schema</h3>
                  <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg">{generatedProject.databaseSchema}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">🔌 API Endpoints</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {generatedProject.apiEndpoints?.map((endpoint, i) => (
                      <li key={i} className="text-gray-300 font-mono text-sm bg-gray-900/50 p-2 rounded">
                        {endpoint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">📅 Implementation Roadmap</h3>
                  <ul className="space-y-2">
                    {generatedProject.implementationRoadmap?.map((step, i) => (
                      <li key={i} className="text-gray-300 bg-gray-900/50 p-3 rounded-lg">
                        <span className="font-bold text-purple-400">Week {i + 1}:</span> {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">🚀 Deployment Guidance</h3>
                  <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg whitespace-pre-line">{generatedProject.deploymentGuidance}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">🎯 Future Enhancements</h3>
                  <ul className="list-disc list-inside text-gray-300">
                    {generatedProject.futureEnhancements?.map((enhancement, i) => (
                      <li key={i}>{enhancement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Generator;