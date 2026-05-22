import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import { Link } from "react-router-dom";

function SavedProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, "projects"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    setDeletingId(projectId);
    try {
      await deleteDoc(doc(db, "projects", projectId));
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete project: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout title="Saved Projects">
      {projects.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700 text-center">
          <div className="text-6xl mb-4">💾</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Saved Projects</h3>
          <p className="text-gray-400 mb-6">Generate and save projects to see them here!</p>
          <Link to="/generator" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition inline-block">
            Generate Project →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition">
              <div className="flex justify-between items-start">
                <Link to={`/project/${project.id}`} className="flex-1">
                  <h3 className="text-white font-semibold hover:text-purple-400 transition">
                    {project.projectName || "Untitled Project"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {project.techStackSelected || project.techStack?.[0] || "No stack"} • 
                    {project.difficulty || "Intermediate"} • 
                    {project.timeline || "4 weeks"}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {project.createdAt?.toDate?.() 
                      ? new Date(project.createdAt.toDate()).toLocaleDateString() 
                      : "Recently saved"}
                  </p>
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                  className="text-red-500 hover:text-red-400 transition p-2 disabled:opacity-50"
                >
                  {deletingId === project.id ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default SavedProjects;