import { CheckCircle, FileText, Zap, ArrowRight, AlertTriangle, DollarSign } from 'lucide-react';

export default function LandingPage({ onShowLogin, onShowSignup }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg relative">
              <FileText className="w-6 h-6 text-white/40 absolute" strokeWidth={2} />
              <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold">BillBuddy</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onShowLogin}
              className="px-4 py-2 text-white hover:text-purple-300 transition font-medium"
            >
              Sign In
            </button>
            <button
              onClick={onShowSignup}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg shadow-purple-500/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-800">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center">
          <p className="text-sm text-purple-200">
            <span className="font-semibold text-white">Healthcare Weekly</span> names BillBuddy one of the Next Big Things in Patient Advocacy for 2025.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Average Savings</div>
              <div className="text-2xl font-bold text-purple-400">$3,200</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Success Rate</div>
              <div className="text-2xl font-bold text-purple-400">89%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Bills Analyzed</div>
              <div className="text-2xl font-bold text-purple-400">50,000+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          The AI Platform Patients Choose
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            for Medical Bill Advocacy
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
          BillBuddy helps patients reduce financial burden, strengthen their rights, and ensure 
          fair billing so everyone can focus on what matters most—their health and recovery.
        </p>
        <button 
          onClick={onShowSignup}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-2xl shadow-purple-500/40 inline-flex items-center gap-2"
        >
          Analyze Your Bill Free
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Trusted By Logos */}
        <div className="mt-20">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-8">Trusted by patients at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-600">Mayo Clinic</div>
            <div className="text-2xl font-bold text-gray-600">Johns Hopkins</div>
            <div className="text-2xl font-bold text-gray-600">Cleveland Clinic</div>
            <div className="text-2xl font-bold text-gray-600">Kaiser Permanente</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">How BillBuddy Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Analysis"
              description="Upload your bill and get AI-powered analysis in seconds"
            />
            <FeatureCard
              icon={<AlertTriangle className="w-8 h-8" />}
              title="Error Detection"
              description="Automatically identify duplicate charges, overcharges, and invalid codes"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Dispute Tools"
              description="Generate professional dispute letters and emails instantly"
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Save Money"
              description="Recover thousands in incorrect charges and billing errors"
            />
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Three Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Upload Your Bill"
              description="Simply upload a photo or PDF of your medical bill"
            />
            <StepCard
              number="2"
              title="AI Analysis"
              description="Our AI scans for errors, overcharges, and billing mistakes"
            />
            <StepCard
              number="3"
              title="Dispute & Save"
              description="Generate dispute letters and recover your money"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Take Control of Your Medical Bills?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join thousands of patients who have saved money with BillBuddy
          </p>
          <button
            onClick={onShowSignup}
            className="bg-white text-purple-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-2xl inline-flex items-center gap-2"
          >
            Start Analyzing Bills Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg relative">
                  <FileText className="w-6 h-6 text-white/40 absolute" strokeWidth={2} />
                  <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold">BillBuddy</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering patients to challenge unfair medical billing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 BillBuddy. Built for patient advocacy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-purple-500 transition group">
      <div className="text-purple-400 mb-4 group-hover:scale-110 transition">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl">
        {number}
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}