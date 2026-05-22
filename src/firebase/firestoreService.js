import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Projects Collection
export const saveProject = async (userId, projectData) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProjects = async (userId) => {
  try {
    const q = query(
      collection(db, "projects"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, projects };
  } catch (error) {
    return { success: false, error: error.message, projects: [] };
  }
};

export const getProjectById = async (projectId) => {
  try {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, project: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: "Project not found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateProject = async (projectId, updateData) => {
  try {
    const docRef = doc(db, "projects", projectId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteProject = async (projectId) => {
  try {
    const docRef = doc(db, "projects", projectId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User Profile Collection
export const saveUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, profileData, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() };
    }
    return { success: true, profile: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};