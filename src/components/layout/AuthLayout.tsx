
import React from "react";
import { Navigate } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  isPrivate?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, isPrivate = false }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (isPrivate) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
