import React from "react";
import Navbar from "./Navbar";
import AuthLayout from "./AuthLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AuthLayout isPrivate>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-6 mt-[73px] min-h-[calc(100vh-73px)]">
        {children}
      </main>
    </AuthLayout>
  );
};

export default MainLayout;
