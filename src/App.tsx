import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import type { User } from '@supabase/supabase-js';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import Camera from './pages/Camera';
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  const [userRole, setUserRole] = useState<'citizen' | 'admin'>('citizen');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const { profile } = await authService.getUserProfile(currentUser.id);
        setUserProfile(profile);
        setUserRole(profile?.user_type === 'official' ? 'admin' : 'citizen');
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        const { profile } = await authService.getUserProfile(user.id);
        setUserProfile(profile);
        setUserRole(profile?.user_type === 'official' ? 'admin' : 'citizen');
      } else {
        setUserProfile(null);
        setUserRole('citizen');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading UrbanWatch...</p>
        </div>
      </div>
    );
  }

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return user ? <>{children}</> : <Navigate to="/login" replace />;
  };

  // Auth routes (login/signup)
  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login onAuthSuccess={() => {}} />} />
            <Route path="/signup" element={<Signup onAuthSuccess={() => {}} />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // Main app routes (authenticated)
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          userRole={userRole} 
          setUserRole={setUserRole}
          user={user}
          userProfile={userProfile}
        />
        
        <main className="pb-20">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/camera" element={
              <ProtectedRoute>
                <Camera />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile user={user} userProfile={userProfile} />
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <BottomNavigation userRole={userRole} />
      </div>
    </Router>
  );
}

export default App;