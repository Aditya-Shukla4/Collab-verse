import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Bouncer jeb check kar raha hai (Local Storage)
  const token = localStorage.getItem('token');

  // 2. Agar VVIP Pass (token) hai, toh party ke andar jaane do (Outlet)
  // 'Outlet' ka matlab hai "jo bhi page iske andar hai, use dikha do"
  // 3. Agar Pass nahi hai, toh use aukaat dikhao aur wapas Login gate pe bhej do
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
