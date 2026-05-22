import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import Loader from "../components/common/Loader";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
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
      console.log("Fetched projects:", projectsList.length);
      setProjects(projectsList);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
      // If index error, show helpful message
      if (err.message.includes("index")) {
        setError("Please create the required index. Click the link in console.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const stats = {
    total: projects.length,
    beginner: projects.filter(p => p.difficulty === "Beginner").length,
    intermediate: projects.filter(p => p.difficulty === "Intermediate").length,
    advanced: projects.filter(p => p.difficulty === "Advanced").length,
  };

  return (
    <DashboardLayout title="Dashboard">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Projects" value={stats.total} icon="📊" color="purple" />
        <StatsCard title="Beginner" value={stats.beginner} icon="🌱" color="green" />
        <StatsCard title="Intermediate" value={stats.intermediate} icon="⚡" color="blue" />
        <StatsCard title="Advanced" value={stats.advanced} icon="🚀" color="orange" />
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <RecentProjects projects={projects} loading={loading} />
        <DashboardCharts projects={projects} />
      </div>
      
      {projects.length === 0 && !error && (
        <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-400 mb-6">Generate your first AI-powered project idea!</p>
          <Link to="/generator" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition inline-block">
            Generate Project →
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;