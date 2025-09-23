import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { login as loginUser } from '../services/authService';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Yeh hai asli, powerful onSubmit function
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await loginUser(data);
      console.log("Login successful, token received:", response.token);

      // TOKEN KO JEB MEIN RAKHO (Local Storage)
      localStorage.setItem('token', response.token);

      // User ko Dashboard pe bhej do
      navigate('/dashboard');

    } catch (error) {
      console.error("Login failed:", error);
      setApiError(error.response?.data?.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Login to Collab-Verse</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          {apiError && <p className="text-red-500 text-center text-sm">{apiError}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-500 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;