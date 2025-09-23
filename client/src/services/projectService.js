import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

// ===== YEH HAI HAMARA NAYA HELPER FUNCTION =====
// Yeh function har request ke saath VVIP Pass (token) laga dega.
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { "x-auth-token": token };
  }
  return {};
};

// Function 1: User ke saare projects laane ke liye
export const getProjects = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(), // <-- Dekha? Bouncer ko pass dikha diya.
  });
  return response.data;
};

// Function 2: Naya project banane ke liye
export const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData, {
    headers: getAuthHeaders(), // <-- Yahan bhi pass dikha diya.
  });
  return response.data;
};
