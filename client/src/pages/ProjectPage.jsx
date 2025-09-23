import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  // useParams() hook URL se dynamic part (projectId) ko nikalta hai
  const { projectId } = useParams();

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold">Project Workspace</h1>
      <p className="mt-4 text-xl">
        You are inside project with ID: <span className="font-mono text-green-400">{projectId}</span>
      </p>
      {/* Yahan baad mein hum asli project ka content fetch karke dikhayenge */}
    </div>
  );
};

export default ProjectPage;