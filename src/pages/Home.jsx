import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navbar */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
              <span className="text-white font-bold text-xl">AI Project Generator</span>
            </div>
            <div className="space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Generate Personalized
            <span className="text-purple-500"> Project Ideas</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Stop searching for project ideas. Get AI-generated, tailored project suggestions 
            based on your skills, interests, and timeline.
          </p>
          <Link to="/register" className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition inline-block">
            Start Building Your Portfolio →
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            { title: "AI-Powered Generation", desc: "Get intelligent project ideas tailored to your skills", icon: "🤖" },
            { title: "Save & Organize", desc: "Keep all your project ideas in one place", icon: "💾" },
            { title: "Detailed Roadmaps", desc: "Step-by-step guidance for each project", icon: "📋" }
          ].map((feature, i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;