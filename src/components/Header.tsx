import React from 'react';
import { Shield, Settings, Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  userRole: 'citizen' | 'admin';
  setUserRole: (role: 'citizen' | 'admin') => void;
  user: User | null;
  userProfile: any;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole, user, userProfile }) => {
  const handleLogout = async () => {
    await authService.signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UrbanWatch</h1>
              <p className="text-xs text-gray-500">Billboard Monitor</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            {userProfile && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{userProfile.full_name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {userProfile.rank}
                </span>
              </div>
            )}
            
            <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Settings className="h-5 w-5" />
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;