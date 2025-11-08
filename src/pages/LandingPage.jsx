import { CheckCircle, Shield, FileText, Zap, Lock, Brain, TrendingUp } from 'lucide-react';

export default function LandingPage({ onShowLogin, onShowSignup }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">BillBuddy</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onShowLogin}
              className="px-5 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onShowSignup}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Control Your 💰 Bills,<br />
          Unlock 🔓 Your Savings!
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Stop overpaying for healthcare. AI-powered analysis detects errors, disputes charges, 
          and helps you save—all in one simple tool built just for you.
        </p>
        <button
          onClick={onShowSignup}
          className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
        >
          Get Started
        </button>
        
        {/* Mock Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Total Saved</p>
                <p className="text-3xl font-bold text-gray-900">$12,847</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-left">
                <FileText className="w-8 h-8 text-purple-600 mb-3" />
                <p className="text-sm text-gray-600 mb-1">Bills Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-left">
                <CheckCircle className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-sm text-gray-600 mb-1">Errors Found</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 text-left">
                <TrendingUp className="w-8 h-8 text-pink-600 mb-3" />
                <p className="text-sm text-gray-600 mb-1">Disputes Won</p>
                <p className="text-2xl font-bold text-gray-900">19</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Smart, Secure & Effortless
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">Bill Management</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Instant AI Analysis"
              description="Upload your bill and get comprehensive analysis in seconds with our advanced AI technology"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Lock className="w-10 h-10" />}
              title="Secure & Private Encryption"
              description="Bank-level encryption keeps your medical and financial data safe and completely private"
              gradient="from-blue-500 to-purple-500"
            />
            <FeatureCard
              icon={<Brain className="w-10 h-10" />}
              title="Financial Health Score"
              description="Track your healthcare spending and get AI-powered insights to optimize your costs"
              gradient="from-pink-500 to-purple-500"
            />
            <FeatureCard
              icon={<FileText className="w-10 h-10" />}
              title="Error Detection"
              description="Automatically identify duplicate charges, overcharges, and invalid billing codes"
              gradient="from-purple-500 to-blue-500"
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="One-Click Disputes"
              description="Generate professional dispute letters and emails instantly with AI assistance"
              gradient="from-blue-500 to-pink-500"
            />
            <FeatureCard
              icon={<CheckCircle className="w-10 h-10" />}
              title="Save Thousands"
              description="Join users who've recovered an average of $3,200 in incorrect charges"
              gradient="from-pink-500 to-purple-500"
            />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Step
              number="1"
              title="Upload Your Bill"
              description="Simply snap a photo or upload a PDF of your medical bill securely"
            />
            <Step
              number="2"
              title="AI Analysis"
              description="Our AI scans every line for errors, overcharges, and billing mistakes"
            />
            <Step
              number="3"
              title="Dispute & Save"
              description="Generate dispute letters instantly and recover your hard-earned money"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 transform -skew-y-2"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your Smart<br />Budgeting Journey Today!
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join thousands of patients taking control of their healthcare costs. Analyze your first bill free!
          </p>
          <button
            onClick={onShowSignup}
            className="bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Download on App Store
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Still Unsure? Here's What<br />You Need to Know
          </h2>
          <div className="mt-12 space-y-4">
            <FAQItem question="How is this different from hiring a medical billing advocate?" />
            <FAQItem question="Is my medical information secure and private?" />
            <FAQItem question="How soon will I see results?" />
            <FAQItem question="What if my dispute doesn't work?" />
          </div>
          <p className="text-center mt-8 text-purple-600 font-semibold cursor-pointer hover:underline">
            Still have questions?
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">BillBuddy</span>
          </div>
          <p className="text-gray-600 mb-2">© 2024 BillBuddy. Built for patient advocacy.</p>
          <p className="text-sm text-gray-500">Empowering patients to challenge unfair medical billing.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FAQItem({ question }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 flex justify-between items-center hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
      <span className="font-semibold text-gray-900">{question}</span>
      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}