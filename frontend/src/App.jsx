import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import WriteEntry from './components/WriteEntry';
import Timeline from './components/Timeline';
import Insights from './components/Insights';
import Settings from './components/Settings';
import GlobalLoader from './components/GlobalLoader';
import { supabase } from './lib/supabaseClient';
import { motion } from 'framer-motion';

function App() {
  const [session, setSession] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  // Tracks which pages have been visited — once visited, a page stays mounted forever
  const [visitedViews, setVisitedViews] = useState(new Set());
  // Triggers a refetch in mounted components when a new entry is saved
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const handleEntrySaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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

  // Derive current view from routing directly for AppShell active states
  const validPaths = ['/dashboard', '/write', '/timeline', '/insights', '/settings'];
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

  // Redirect to /dashboard if on root or unknown path (only when logged in)
  useEffect(() => {
    if (session && !validPaths.includes(location.pathname) && location.pathname !== '/login') {
      navigate('/dashboard', { replace: true });
    }
  }, [session, location.pathname]);

  // Mark the current view as visited so it gets mounted (only once)
  useEffect(() => {
    if (session) {
      setVisitedViews((prev) => {
        if (prev.has(currentView)) return prev;
        return new Set(prev).add(currentView);
      });
    }
  }, [currentView, session]);

  if (loadingInitial) {
    return <GlobalLoader message="Waking up your journal..." />;
  }

  // If not logged in, show login
  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Pages mount lazily on first visit and stay alive (hidden via CSS).
  // APIs only fire when you first navigate to a page — revisiting won't re-fetch.
  return (
    <AppShell currentView={currentView} onNavigate={navigateToView} onLogout={handleLogout} user={session?.user}>
      {visitedViews.has('DASHBOARD') && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={currentView === 'DASHBOARD' ? { opacity: 1, y: 0, display: 'block' } : { opacity: 0, y: 15, transitionEnd: { display: 'none' } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Dashboard onNavigate={navigateToView} refreshTrigger={refreshTrigger} user={session?.user} />
        </motion.div>
      )}
      {visitedViews.has('WRITE') && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={currentView === 'WRITE' ? { opacity: 1, y: 0, display: 'block' } : { opacity: 0, y: 15, transitionEnd: { display: 'none' } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <WriteEntry onEntrySaved={handleEntrySaved} />
        </motion.div>
      )}
      {visitedViews.has('TIMELINE') && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={currentView === 'TIMELINE' ? { opacity: 1, y: 0, display: 'block' } : { opacity: 0, y: 15, transitionEnd: { display: 'none' } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Timeline refreshTrigger={refreshTrigger} />
        </motion.div>
      )}
      {visitedViews.has('INSIGHTS') && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={currentView === 'INSIGHTS' ? { opacity: 1, y: 0, display: 'block' } : { opacity: 0, y: 15, transitionEnd: { display: 'none' } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Insights />
        </motion.div>
      )}
      {visitedViews.has('SETTINGS') && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={currentView === 'SETTINGS' ? { opacity: 1, y: 0, display: 'block' } : { opacity: 0, y: 15, transitionEnd: { display: 'none' } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Settings user={session?.user} />
        </motion.div>
      )}
    </AppShell>
  );
}

export default App;
