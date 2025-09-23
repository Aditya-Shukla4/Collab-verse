// client/src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectPage from '../pages/ProjectPage'; // <-- Naye kamre ko import kiya
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* YEH HAI NAYA DYNAMIC ADDRESS */}
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;