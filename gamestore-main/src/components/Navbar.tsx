import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User, Gamepad2, Home, Gift, Sparkles, Tag } from 'lucide-react';
import logo from '../assets/logo.svg';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'text-primary-600 bg-primary-50/50 font-medium' 
          : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50/50'
      }`}
    >
      {icon}
      <span className="text-sm">{children}</span>
    </Link>
  );
};

const SearchBar = () => (
  <div className="relative flex-1 max-w-xl">
    <input
      type="text"
      placeholder="Buscar items..."
      className="w-full px-4 py-2.5 pl-11 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200"
    />
    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  const navLinks = [
    { to: "/", icon: <Home className="w-5 h-5" />, label: "Inicio" },
    { to: "/fortnite-shop", icon: <Gamepad2 className="w-5 h-5" />, label: "Fortnite" },
  ];

  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center gap-1.5"
          >
            <img src={logo} alt="GameStore" className="h-8 w-auto" />
          </Link>

          {/* Search Bar - Centered */}
          <div className="hidden lg:flex flex-1 justify-center mx-6">
            <SearchBar />
          </div>

          {/* Desktop Navigation and Actions - Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.label}
                </NavLink>
              ))}
            </div>
            
            {/* User Menu */}
            <button className="p-2 hover:bg-gray-50/50 rounded-lg transition-all duration-300">
              <User className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Cart */}
            <button className="p-2 hover:bg-gray-50/50 rounded-lg transition-all duration-300 relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              <div className="px-2 pb-4">
                <SearchBar />
              </div>
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.label}
                </NavLink>
              ))}
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                <Link 
                  to="/perfil" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                  <span>Mi Perfil</span>
                </Link>
                <Link 
                  to="/carrito" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Carrito</span>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;