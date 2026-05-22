import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && user) {
      fetchProject();
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check if project belongs to current user
        if (data.userId !== user?.uid) {
          setError("You don't have permission to view this project");
          setTimeout(() => navigate("/dashboard"), 2000);
          return;
        }
        
        // SAFELY HANDLE techStack - convert string to array if needed
        let techStackArray = data.techStack;
        if (typeof techStackArray === 'string') {
          techStackArray = [techStackArray];
        } else if (!Array.isArray(techStackArray)) {
          techStackArray = [];
        }
        
        // SAFELY HANDLE keyFeatures
        let keyFeaturesArray = data.keyFeatures;
        if (typeof keyFeaturesArray === 'string') {
          keyFeaturesArray = [keyFeaturesArray];
        } else if (!Array.isArray(keyFeaturesArray)) {
          keyFeaturesArray = [];
        }
        
        // SAFELY HANDLE implementationRoadmap
        let roadmapArray = data.implementationRoadmap;
        if (typeof roadmapArray === 'string') {
          roadmapArray = [roadmapArray];
        } else if (!Array.isArray(roadmapArray)) {
          roadmapArray = [];
        }
        
        // SAFELY HANDLE apiEndpoints
        let apiEndpointsArray = data.apiEndpoints;
        if (typeof apiEndpointsArray === 'string') {
          apiEndpointsArray = [apiEndpointsArray];
        } else if (!Array.isArray(apiEndpointsArray)) {
          apiEndpointsArray = [];
        }
        
        // SAFELY HANDLE futureEnhancements
        let enhancementsArray = data.futureEnhancements;
        if (typeof enhancementsArray === 'string') {
          enhancementsArray = [enhancementsArray];
        } else if (!Array.isArray(enhancementsArray)) {
          enhancementsArray = [];
        }
        
        setProject({ 
          ...data, 
          techStack: techStackArray,
          keyFeatures: keyFeaturesArray,
          implementationRoadmap: roadmapArray,
          apiEndpoints: apiEndpointsArray,
          futureEnhancements: enhancementsArray
        });
      } else {
        setError("Project not found");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "projects", id));
      navigate("/saved-projects");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const exportToPDF = () => {
    if (!project) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${project.projectName || "Project"}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
          h2 { color: #6b21a5; margin-top: 20px; }
          .badge { background: #f3e8ff; padding: 4px 12px; border-radius: 20px; display: inline-block; margin: 5px 5px 0 0; font-size: 12px; }
          .meta { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; }
          ul, ol { padding-left: 20px; }
          li { margin: 5px 0; }
          hr { margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>${project.projectName || "Project"}</h1>
        <div class="meta">
          <span class="badge">📚 ${project.techStackSelected || project.techStack?.[0] || "N/A"}</span>
          <span class="badge">🎯 ${project.difficulty || "N/A"}</span>
          <span class="badge">⏱️ ${project.timeline || "N/A"}</span>
        </div>
        <h2>📖 Description</h2>
        <p>${project.description || "No description"}</p>
        <h2>✨ Key Features</h2>
        <ul>${project.keyFeatures?.map(f => `<li>${f}</li>`).join("") || "<li>No features listed</li>"}</ul>
        <h2>🛠️ Tech Stack</h2>
        <ul>${project.techStack?.map(t => `<li>${t}</li>`).join("") || "<li>No tech stack</li>"}</ul>
        <h2>📅 Implementation Roadmap</h2>
        <ol>${project.implementationRoadmap?.map(r => `<li>${r}</li>`).join("") || "<li>No roadmap</li>"}</ol>
        <h2>🚀 Deployment Guidance</h2>
        <p>${project.deploymentGuidance || "Not specified"}</p>
        <hr />
        <p style="text-align: center; color: #9ca3af;">Generated by AI Project Generator</p>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <Loader fullScreen />;
  
  if (error) {
    return (
      <DashboardLayout title="Error">
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-xl p-6 text-center">
          <p>{error}</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) return null;

  return (
    <DashboardLayout title={project.projectName || "Project Details"}>
      <div className="space-y-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{project.projectName}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                  {project.techStackSelected || project.techStack?.[0] || "N/A"}
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                  {project.difficulty || "N/A"}
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                  {project.timeline || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToPDF} variant="secondary" size="sm">
                📄 Export PDF
              </Button>
              <Button onClick={handleDelete} variant="danger" size="sm" loading={deleting}>
                🗑️ Delete
              </Button>
            </div>
          </div>
          
          <p className="text-gray-300 leading-relaxed">{project.description}</p>
        </div>

        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">✨ Key Features</h2>
            <ul className="grid md:grid-cols-2 gap-2">
              {project.keyFeatures.map((feature, i) => (
                <li key={i} className="text-gray-300 flex items-start gap-2">
                  <span className="text-purple-400">•</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">🛠️ Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm text-white">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.databaseSchema && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">🗄️ Database Schema</h2>
            <p className="text-gray-300">{project.databaseSchema}</p>
          </div>
        )}

        {project.apiEndpoints && project.apiEndpoints.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">🔌 API Endpoints</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {project.apiEndpoints.map((endpoint, i) => (
                <code key={i} className="bg-gray-900/50 p-2 rounded text-gray-300 text-sm">
                  {endpoint}
                </code>
              ))}
            </div>
          </div>
        )}

        {project.implementationRoadmap && project.implementationRoadmap.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">📅 Implementation Roadmap</h2>
            <div className="space-y-3">
              {project.implementationRoadmap.map((step, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                  <span className="font-bold text-purple-400">Week {i+1}:</span>
                  <span className="text-gray-300 ml-2">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.deploymentGuidance && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">🚀 Deployment Guidance</h2>
            <p className="text-gray-300">{project.deploymentGuidance}</p>
          </div>
        )}

        {project.futureEnhancements && project.futureEnhancements.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">🔮 Future Enhancements</h2>
            <ul className="list-disc list-inside text-gray-300">
              {project.futureEnhancements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProjectDetails;