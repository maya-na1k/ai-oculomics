import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import Dashboard from './pages/Dashboard';
import BillDetail from './pages/BillDetail';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return showSignup ? (
      <SignupForm onToggleForm={() => setShowSignup(false)} />
    ) : (
      <LoginForm onToggleForm={() => setShowSignup(true)} />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/bill/:billId" element={<BillDetail user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;