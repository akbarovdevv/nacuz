import React, { useState } from 'react';
import { Menu, X, Phone, Globe, Shield, User, LogOut } from 'lucide-react';
import { Student } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser?: Student | null;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About NAC' },
    // Register item is handled conditionally
    { id: 'samples', label: 'Sample Papers' },
    { id: 'results', label: 'Results' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {/* Top Bar */}
      <div className="bg-nac-navy text-nac-light text-xs py-2 px-4 md:px-8 flex justify-between items-center z-50 relative">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1"><Phone size={12} /> +998 90 123 45 67</span>
          <span className="hidden md:flex items-center gap-1"><Globe size={12} /> www.nac.uz</span>
        </div>
        <div className="flex items-center space-x-3">
          {!currentUser ? (
             <button onClick={() => handleNav('student-login')} className="hover:text-nac-gold transition-colors font-semibold">Kirish (Login)</button>
          ) : (
             <span className="text-nac-gold font-bold">ID: {currentUser.id}</span>
          )}
          <span>|</span>
          <button onClick={() => handleNav('admin')} className="hover:text-nac-gold transition-colors">Admin</button>
          <span className="hidden md:inline">|</span>
          <span className="text-nac-gold font-bold hidden md:inline">UZ / RU / EN</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 w-full bg-white shadow-md z-40 border-b-2 border-nac-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNav('home')}>
              <div className="w-12 h-12 bg-nac-navy rounded-full flex items-center justify-center border-2 border-nac-gold mr-3">
                <span className="text-nac-gold font-serif font-bold text-xl">NAC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-nac-navy leading-none">National</span>
                <span className="font-serif text-lg font-bold text-nac-navy leading-none">Academic Challenge</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                    currentPage === item.id ? 'text-nac-navy font-bold border-b-2 border-nac-gold' : 'text-gray-600 hover:text-nac-navy'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {!currentUser ? (
                <button 
                  onClick={() => handleNav('register')}
                  className="bg-nac-gold hover:bg-yellow-400 text-nac-navy font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-all"
                >
                  Register Now
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleNav('dashboard')}
                    className="bg-nac-navy text-white hover:bg-blue-900 font-bold py-2 px-4 rounded shadow flex items-center gap-2"
                  >
                    <User size={16} /> Mening Kabinetim
                  </button>
                  <button 
                    onClick={onLogout}
                    className="text-gray-500 hover:text-red-500 p-2"
                    title="Chiqish"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-nac-navy focus:outline-none">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 absolute w-full shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${
                    currentPage === item.id ? 'bg-nac-light text-nac-navy font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-nac-navy'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {!currentUser ? (
                <button 
                  onClick={() => handleNav('register')}
                  className="w-full text-center mt-4 bg-nac-gold text-nac-navy font-bold py-3 rounded-md shadow"
                >
                  Register Now
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleNav('dashboard')}
                    className="w-full text-center mt-4 bg-nac-navy text-white font-bold py-3 rounded-md shadow flex items-center justify-center gap-2"
                  >
                    <User size={16} /> Mening Kabinetim
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full text-center mt-2 text-red-500 font-medium py-2"
                  >
                    Chiqish (Logout)
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-nac-navy text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-nac-gold font-serif font-bold text-lg mb-4">NAC.uz</h3>
            <p className="text-gray-300 text-sm">Where Thinking Becomes Excellence. Milliy akademik olimpiada.</p>
            <div className="mt-4 flex space-x-2 text-nac-gold">
               <Shield size={20} />
               <span className="text-xs text-white">Rasmiy Nizom asosida ishlaydi</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Menyu</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => handleNav('about')} className="hover:text-nac-gold">About NAC</button></li>
              {!currentUser && <li><button onClick={() => handleNav('register')} className="hover:text-nac-gold">Registration</button></li>}
              <li><button onClick={() => handleNav('results')} className="hover:text-nac-gold">Check Results</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>info@nac.uz</li>
              <li>+998 90 123 45 67</li>
              <li>Toshkent sh, Yunusobod tumani</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Follow Us</h4>
            <div className="flex space-x-4">
               {/* Social placeholders */}
               <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-nac-gold hover:text-nac-navy cursor-pointer transition">Tg</div>
               <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-nac-gold hover:text-nac-navy cursor-pointer transition">In</div>
               <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-nac-gold hover:text-nac-navy cursor-pointer transition">Fb</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} National Academic Challenge. All rights reserved. Developed by Senior Full-Stack Dev.
        </div>
      </footer>
    </div>
  );
};

export default Layout;