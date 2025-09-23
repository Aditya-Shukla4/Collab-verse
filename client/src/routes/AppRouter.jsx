import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute'; // <-- Bouncer ko import kiya

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes (Yahan koi bhi aa sakta hai) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes (Bouncer ke peeche) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Kal ko aur VVIP pages banenge (e.g., /profile) toh woh bhi yahin aayenge */}
        </Route>
      </Routes>
    </Router>
      );
};

export default AppRouter;