import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  const username = JSON.parse(localStorage.getItem("user") || "{}")?.username || "User";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground transition-all duration-200 ${
      isScrolled ? 'shadow-md' : ''
    }`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              <Link to="/dashboard">BERWA SHOP</Link>
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden sm:block">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link to="/dashboard" className="hover:underline transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/stock-in" className="hover:underline transition-colors">Stock In</Link>
              </li>
              <li>
                <Link to="/stock-out" className="hover:underline transition-colors">Stock Out</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:underline transition-colors">Reports</Link>
              </li>
            </ul>
          </nav>
          
          <div className="hidden sm:flex items-center gap-4">
            <span className="whitespace-nowrap">Hello, {username}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="whitespace-nowrap">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-primary-foreground/20">
            <nav className="py-4 px-4">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link to="/dashboard" className="block hover:underline transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/products" className="block hover:underline transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                </li>
                <li>
                  <Link to="/stock-in" className="block hover:underline transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Stock In</Link>
                </li>
                <li>
                  <Link to="/stock-out" className="block hover:underline transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Stock Out</Link>
                </li>
                <li>
                  <Link to="/reports" className="block hover:underline transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Reports</Link>
                </li>
                <li className="pt-4 border-t border-primary-foreground/20">
                  <div className="flex items-center justify-between">
                    <span className="whitespace-nowrap">Hello, {username}</span>
                    <Button variant="secondary" size="sm" onClick={handleLogout} className="whitespace-nowrap">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
