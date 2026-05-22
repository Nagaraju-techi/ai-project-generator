export const formatProjectResponse = (data) => {
  return {
    projectName: data.projectName || "Untitled Project",
    description: data.description || "No description provided",
    keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : [],
    techStack: Array.isArray(data.techStack) ? data.techStack : [],
    databaseSchema: data.databaseSchema || "Not specified",
    apiEndpoints: Array.isArray(data.apiEndpoints) ? data.apiEndpoints : [],
    implementationRoadmap: Array.isArray(data.implementationRoadmap) ? data.implementationRoadmap : [],
    deploymentGuidance: data.deploymentGuidance || "Deploy using standard cloud services",
    futureEnhancements: Array.isArray(data.futureEnhancements) ? data.futureEnhancements : [],
  };
};

export const extractJSONFromText = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      return null;
    }
  }
  return null;
};