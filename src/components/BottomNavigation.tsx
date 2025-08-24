import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, FileText, BarChart3, User } from 'lucide-react';

interface BottomNavigationProps {
  userRole: 'citizen' | 'admin';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ userRole = 'citizen' }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Camera, label: 'Scan', path: '/camera' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    ...(userRole === 'admin' ? [{ icon: BarChart3, label: 'Dashboard', path: '/dashboard' }] : []),
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              isActive(path) 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Icon className={`h-6 w-6 ${isActive(path) ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;