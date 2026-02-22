import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import WriteEntry from './components/WriteEntry';
import Timeline from './components/Timeline';
import Insights from './components/Insights';
import Settings from './components/Settings';
import { supabase } from './lib/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingInitial(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loadingInitial) {
    return <div className="h-screen w-screen flex items-center justify-center bg-lumina-bg"><p className="text-gray-500">Loading your journal...</p></div>;
  }

  // Derive current view from routing directly for AppShell active states
  const currentViewMap = {
    '/dashboard': 'DASHBOARD',
    '/write': 'WRITE',
    '/timeline': 'TIMELINE',
    '/insights': 'INSIGHTS',
    '/settings': 'SETTINGS',
  };
  const currentView = currentViewMap[location.pathname] || 'DASHBOARD';

  const navigateToView = (view) => {
    const routeMap = {
      'DASHBOARD': '/dashboard',
      'WRITE': '/write',
      'TIMELINE': '/timeline',
      'INSIGHTS': '/insights',
      'SETTINGS': '/settings',
    };
    navigate(routeMap[view] || '/dashboard');
  };

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" replace />} />

      {/* Protected Routes directly inside AppShell */}
      <Route path="/*" element={
        session ? (
          <AppShell currentView={currentView} onNavigate={navigateToView} onLogout={handleLogout} user={session?.user}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard onNavigate={navigateToView} />} />
              <Route path="/write" element={<WriteEntry />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/settings" element={<Settings user={session?.user} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppShell>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

export default App;
