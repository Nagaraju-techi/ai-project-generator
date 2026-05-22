import { useState, useEffect } from "react";
import { getUserProjects, saveProject, deleteProject } from "../firebase/firestoreService";
import { useAuth } from "./useAuth";

export const useFirestore = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    const result = await getUserProjects(user.uid);
    if (result.success) {
      setProjects(result.projects);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const addProject = async (projectData) => {
    if (!user) return { success: false, error: "User not logged in" };
    const result = await saveProject(user.uid, projectData);
    if (result.success) {
      await fetchProjects();
    }
    return result;
  };

  const removeProject = async (projectId) => {
    const result = await deleteProject(projectId);
    if (result.success) {
      await fetchProjects();
    }
    return result;
  };

  return {
    projects,
    loading,
    error,
    addProject,
    removeProject,
    refreshProjects: fetchProjects,
  };
};