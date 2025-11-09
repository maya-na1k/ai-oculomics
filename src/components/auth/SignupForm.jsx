import { useState } from 'react';
import { supabase } from '../../services/supabase';
import { Shield, Mail, CheckCircle } from 'lucide-react';

// --- BillBuddy Logo Component ---
const BillBuddyLogo = () => {
  return (
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg p-3">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Document outline */}
        <path
          d="M20 10 C20 7 22 5 25 5 L65 5 L80 20 L80 90 C80 93 78 95 75 95 L25 95 C22 95 20 93 20 90 Z"
          stroke="white"
          strokeWidth="6"
          fill="rgba(255,255,255,0.2)"
        />
        
        {/* Folded corner */}
        <path
          d="M65 5 L65 20 L80 20"
          stroke="white"
          strokeWidth="6"
          fill="rgba(255,255,255,0.3)"
        />
        
        {/* Human icon in upper portion */}
        <circle cx="42" cy="32" r="8" fill="white" />
        <path 
          d="M42 42c-6 0-10 3-10 7v4c0 1 1 2 2 2h16c1 0 2-1 2-2v-4c0-4-4-7-10-7z" 
          fill="white"
        />
        
        {/* Lines on document */}
        <line x1="30" y1="62" x2="60" y2="62" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="70" x2="60" y2="70" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="78" x2="50" y2="78" stroke="white" strokeWidth="3" strokeLinecap="round" />
        
        {/* Dollar sign circle */}
        <circle cx="65" cy="72" r="16" fill="white" />
        <text x="65" y="81" fontSize="22" fill="#7C3AED" fontWeight="bold" textAnchor="middle">$</text>
      </svg>
    </div>
  );
};
// -----------------------------------------------------

export default function SignupForm({ onToggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email,
              full_name: fullName,
            },
          ]);

        if (profileError) throw profileError;
      }

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Check your email!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We've sent you a confirmation link to <span className="font-semibold text-purple-600">{email}</span>. Please check your email and click the link to verify your account.
            </p>
            <button
              onClick={onToggleForm}
              className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          {/* LOGO IMPLEMENTATION */}
          <BillBuddyLogo />
          
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Start analyzing your medical bills today
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="••••••••"
                  minLength="6"
                />
                <p className="mt-2 text-xs text-gray-500">Must be at least 6 characters</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Already have an account? <span className="font-semibold">Sign in</span>
            </button>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}