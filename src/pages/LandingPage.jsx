import { Zap, FileText, DollarSign, ArrowRight, Shield, Lock, Brain } from 'lucide-react';

// Custom Logo Component
const BillBuddyIcon = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Document outline */}
    <path
      d="M20 10 C20 7 22 5 25 5 L65 5 L80 20 L80 90 C80 93 78 95 75 95 L25 95 C22 95 20 93 20 90 Z"
      stroke="#7C3AED"
      strokeWidth="4"
      fill="white"
    />
    
    {/* Folded corner */}
    <path
      d="M65 5 L65 20 L80 20"
      stroke="#7C3AED"
      strokeWidth="4"
      fill="#E9D5FF"
    />
    
    {/* Human icon in upper portion */}
    <circle cx="42" cy="32" r="8" fill="#7C3AED" />
    <path 
      d="M42 42c-6 0-10 3-10 7v4c0 1 1 2 2 2h16c1 0 2-1 2-2v-4c0-4-4-7-10-7z" 
      fill="#7C3AED"
    />
    
    {/* Lines on document */}
    <line x1="30" y1="62" x2="60" y2="62" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
    <line x1="30" y1="70" x2="60" y2="70" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
    <line x1="30" y1="78" x2="50" y2="78" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
    
    {/* Dollar sign circle */}
    <circle cx="65" cy="72" r="16" fill="white" stroke="#7C3AED" strokeWidth="3" />
    <text x="65" y="81" fontSize="22" fill="#7C3AED" fontWeight="bold" textAnchor="middle">$</text>
  </svg>
);

export default function LandingPage({ onShowLogin, onShowSignup }) {

  // Utility components for reusability
  const StatItem = ({ label, value }) => (
    <div className="text-center">
      <p className="text-xl font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-purple-700">{value}</p>
    </div>
  );

  const ScrollingItem = ({ icon, text }) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
        {icon}
      </div>
      <span className="text-xl font-bold text-white">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation - Top Bar with Custom Logo */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BillBuddyIcon className="w-10 h-10" />
            <h1 className="text-2xl font-extrabold text-gray-900">
              Bill<span className="text-purple-600">Buddy</span>
            </h1>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={onShowLogin}
              className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors text-lg"
            >
              Sign In
            </button>
            <button
              onClick={onShowSignup}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Maximum Horizontal Space */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Statistics Bar */}
        <div className="flex justify-center gap-12 mb-16 p-4 rounded-xl">
          <StatItem label="AVERAGE SAVINGS" value="$3,200" />
          <StatItem label="SUCCESS RATE" value="89%" />
          <StatItem label="BILLS ANALYZED" value="50,000+" />
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight"> 
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">AI Platform</span> Patients Choose
          for <span className="text-purple-700">Medical Bill Advocacy</span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-6xl mx-auto leading-relaxed"> 
          BillBuddy helps patients reduce financial burden, strengthen their rights, and ensure fair billing so
          everyone can focus on what matters most—their health and recovery.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onShowSignup}
          className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all shadow-lg"
        >
          Analyze Your Bill Free <ArrowRight className="w-5 h-5 ml-2" />
        </button>

        {/* Trusted By Section */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">Trusted by patients at</p>
          <div className="flex justify-center items-center gap-10 sm:gap-16 flex-wrap">
            {['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'Kaiser Permanente'].map((clinic) => (
              <span key={clinic} className="text-xl md:text-2xl font-bold text-gray-800 opacity-80 hover:opacity-100 transition-opacity">
                {clinic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling Features Banner */}
      <div className="py-12 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 overflow-hidden relative">
        <div className="flex animate-scroll">
          {/* First set */}
          <div className="flex gap-16 items-center whitespace-nowrap px-8">
            <ScrollingItem icon={<Zap className="w-6 h-6" />} text="Instant Analysis" />
            <ScrollingItem icon={<FileText className="w-6 h-6" />} text="Error Detection" />
            <ScrollingItem icon={<Shield className="w-6 h-6" />} text="Dispute Tools" />
            <ScrollingItem icon={<DollarSign className="w-6 h-6" />} text="Save Money" />
            <ScrollingItem icon={<Brain className="w-6 h-6" />} text="AI-Powered" />
            <ScrollingItem icon={<Lock className="w-6 h-6" />} text="Secure & Private" />
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex gap-16 items-center whitespace-nowrap px-8">
            <ScrollingItem icon={<Zap className="w-6 h-6" />} text="Instant Analysis" />
            <ScrollingItem icon={<FileText className="w-6 h-6" />} text="Error Detection" />
            <ScrollingItem icon={<Shield className="w-6 h-6" />} text="Dispute Tools" />
            <ScrollingItem icon={<DollarSign className="w-6 h-6" />} text="Save Money" />
            <ScrollingItem icon={<Brain className="w-6 h-6" />} text="AI-Powered" />
            <ScrollingItem icon={<Lock className="w-6 h-6" />} text="Secure & Private" />
          </div>
        </div>
        
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      {/* Three Simple Steps Section - Flowchart */}
      <div className="py-20 bg-white/70">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-16 text-center">Three Simple Steps</h2>
          
          <div className="flex items-center justify-between gap-8">
            {/* Step 1 */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Upload Your Bill</h3>
                <p className="text-gray-600 leading-relaxed text-center">Simply upload a photo or PDF of your medical bill</p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex-shrink-0">
              <ArrowRight className="w-12 h-12 text-purple-400" strokeWidth={3} />
            </div>

            {/* Step 2 */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">AI Analysis</h3>
                <p className="text-gray-600 leading-relaxed text-center">Our AI scans for errors, overcharges, and billing mistakes</p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex-shrink-0">
              <ArrowRight className="w-12 h-12 text-pink-400" strokeWidth={3} />
            </div>

            {/* Step 3 */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-green-200 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Dispute & Save</h3>
                <p className="text-gray-600 leading-relaxed text-center">Generate dispute letters and recover your money</p>
              </div>
            </div>
          </div>

          {/* Mobile View - Vertical Stack */}
          <div className="md:hidden space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Upload Your Bill</h3>
              <p className="text-gray-600 leading-relaxed text-center">Simply upload a photo or PDF of your medical bill</p>
            </div>

            <div className="flex justify-center">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed text-center">Our AI scans for errors, overcharges, and billing mistakes</p>
            </div>

            <div className="flex justify-center">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-green-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Dispute & Save</h3>
              <p className="text-gray-600 leading-relaxed text-center">Generate dispute letters and recover your money</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary CTA Section */}
      <div className="relative py-20 bg-gradient-to-r from-purple-500 to-pink-500 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Take Control of Your Medical Bills?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join thousands of patients who have saved money with BillBuddy
          </p>
          <button
            onClick={onShowSignup}
            className="inline-flex items-center bg-white text-purple-600 px-10 py-3 rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Start Analyzing Bills Now <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BillBuddyIcon className="w-6 h-6" />
            <span className="font-bold text-gray-900">
              Bill<span className="text-purple-600">Buddy</span>
            </span>
          </div>
          <p className="text-gray-600 mb-1">© 2025 BillBuddy. All rights reserved.</p>
          <p className="text-sm text-gray-500">Empowering patients to challenge unfair medical billing.</p>
        </div>
      </footer>
    </div>
  );
}