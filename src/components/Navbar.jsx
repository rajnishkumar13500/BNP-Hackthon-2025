import React, { useState } from "react";
import { Menu, X, BarChart3, Upload as UploadIcon, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  const navItems = [
    { path: "/", label: "DASHBOARD", icon: BarChart3 },
    { path: "/upload", label: "UPLOAD", icon: UploadIcon },
    { path: "/result", label: "RESULT", icon: Target },
  ];

  const handleNavClick = (path) => {
    setActiveItem(path);
    setShowMenu(false);
    navigate(path);
  };

  return (
    <nav className="relative">
  
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 shadow-sm">
       
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => handleNavClick("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl hidden sm:block bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
            Analytics Pro
          </span>
        </div>

        
        <ul className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 font-medium text-sm group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                      : "text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105"
                  }`}
                >
                  <IconComponent
                    size={18}
                    className={`transition-transform duration-300 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="relative">
                    {item.label}
                    {!isActive && (
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

      
        <div className="hidden md:block w-10"></div>

       
        <button
          onClick={() => setShowMenu(true)}
          className="md:hidden p-2.5 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-gray-300" />
        </button>
      </div>

     
      {showMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setShowMenu(false)}
        />
      )}

    
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-gray-900 z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
      
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              Analytics Pro
            </span>
          </div>
          <button
            onClick={() => setShowMenu(false)}
            className="p-2.5 rounded-xl hover:bg-gray-800 transition-all duration-300"
            aria-label="Close menu"
          >
            <X size={24} className="text-gray-300" />
          </button>
        </div>

       
        <div className="p-6">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105"
                    }`}
                  >
                    <IconComponent size={22} />
                    <span className="text-lg">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
