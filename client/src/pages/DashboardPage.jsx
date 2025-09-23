import React, { useState, useEffect } from "react";
import { getProjects, createProject } from "../services/projectService";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  // State variables:
  const [projects, setProjects] = useState([]); // User ke projects ki list
  const [newProjectTitle, setNewProjectTitle] = useState(""); // Naye project ke title ke liye
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Yeh function server se saare projects laayega
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const userProjects = await getProjects();
      setProjects(userProjects);
    } catch (err) {
      setError("Failed to fetch projects. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect: Jaise hi page load ho, yeh apne aap projects fetch kar lega.
  useEffect(() => {
    fetchProjects();
  }, []); // [] ka matlab hai ki yeh sirf ek baar chalega.

  // Yeh function naya project create karega
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return; // Khaali title allowed nahi hai

    try {
      await createProject({ title: newProjectTitle });
      setNewProjectTitle(""); // Input field ko saaf karo
      fetchProjects(); // Naya project banane ke baad list ko refresh karo
    } catch (err) {
      setError("Failed to create project.");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Your Dashboard
        </h1>

        {/* Naya Project Banane ka Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Create a New Project
          </h2>
          <form
            onSubmit={handleCreateProject}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Input
              type="text"
              placeholder="Enter your new project title..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Create Project</Button>
          </form>
        </div>

        {/* Projects ki List */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your Projects
          </h2>
          {isLoading && (
            <p className="text-gray-400">Loading your projects...</p>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {!isLoading && !error && projects.length === 0 && (
            <p className="text-gray-400">
              You haven't created any projects yet. Let's create one!
            </p>
          )}

          {!isLoading && !error && projects.length > 0 && (
            <ul className="space-y-4">
              {projects.map((project) => (
                <Link to={`/project/${project._id}`} key={project._id}>
                  <li className="bg-gray-700 p-4 rounded-md flex justify-between items-center hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
                    <p className="text-lg font-medium text-white">
                      {project.title}
                    </p>
                    <p className="text-sm text-gray-400">
                      Created on:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
