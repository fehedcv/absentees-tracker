import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!isHome && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ArrowLeft size={20} className="text-blue-600" />
                </button>
              )}
              <div className="flex items-center space-x-2">
                <GraduationCap size={28} className="text-blue-600" />
                <h1 className="text-xl font-bold text-gray-800">Polyfy</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
