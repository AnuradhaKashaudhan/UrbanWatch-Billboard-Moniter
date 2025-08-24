import React from 'react';
import { Shield, Settings, Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  userRole: 'citizen' | 'admin';
  setUserRole: (role: 'citizen' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole }) => {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
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
            
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value as 'citizen' | 'admin')}
              className="text-sm border rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
            </select>
            
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