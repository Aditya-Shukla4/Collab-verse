// client/src/pages/RegisterPage.jsx

import React, { useState } from 'react'; // <-- useState ko import kiya
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'; // <-- useNavigate ko import kiya
import Input from '../components/Input';
import Button from '../components/Button';
import { register as registerUser } from '../services/authService'; // <-- Apne service function ko import kiya

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // <-- useNavigate ko initialize kiya

  // Error aur loading ke liye state banayi
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Yeh hai hamara naya, powerful onSubmit function
  const onSubmit = async (data) => {
    try {
      setIsLoading(true); // 1. Loading shuru
      setApiError(null); // Purana error saaf karo

      // 2. API call karo aur backend se response ka wait karo
      const response = await registerUser(data);
      console.log("Registration successful:", response);

      // 3. Agar sab sahi raha, toh user ko login page pe bhej do
      navigate('/login');

    } catch (error) {
      // 4. Agar backend se error aaya, toh use screen pe dikhao
      console.error("Registration failed:", error);
      setApiError(error.response?.data?.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false); // 5. Loading khatam (chahe success ho ya fail)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Create a New Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ... Baaki ka form bilkul same hai ... */}
          <Input
            label="Username"
            type="text"
            placeholder="Choose a username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

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
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          
          {/* API se aaya hua error yahan dikhega */}
          {apiError && <p className="text-red-500 text-center text-sm">{apiError}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;