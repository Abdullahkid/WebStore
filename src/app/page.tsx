import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className="min-h-screen gradient-surface">
      {/* Navigation Bar */}
      <nav className="glass-card sticky top-0 z-50 border-0 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-brand">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Downxtown</h1>
                <p className="text-xs text-slate-500">Web Store</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#stores" className="text-slate-600 hover:text-slate-900 font-medium">Stores</a>
              <a href="#categories" className="text-slate-600 hover:text-slate-900 font-medium">Categories</a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 font-medium">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            {/* Icon */}
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 mx-auto gradient-primary rounded-3xl flex items-center justify-center shadow-premium hover-lift">
                <span className="text-4xl">🏪</span>
              </div>
              <div className="absolute -inset-1 gradient-primary rounded-3xl opacity-20 blur-lg animate-pulse"></div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Welcome to
              <span className="block gradient-primary bg-clip-text text-transparent mt-2">
                Downxtown Webstore
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover amazing products from verified local stores.
              Connect directly with sellers and find unique items in your community.
            </p>

            {/* CTA Section */}
            <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto mb-12">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🔗</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Visit a Store</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Enter a store URL to start exploring:
              </p>
              <div className="bg-slate-100 rounded-lg p-4 font-mono text-sm text-slate-700 mb-4 border">
                /store/[store-id]
              </div>
              <p className="text-xs text-slate-500">
                Replace <code className="bg-slate-200 px-1 rounded">[store-id]</code> with an actual store ID from your database
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-card rounded-xl p-6 hover-lift">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-xl">✨</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Verified Stores</h3>
                <p className="text-sm text-slate-600">All stores are verified for authenticity and quality assurance</p>
              </div>

              <div className="glass-card rounded-xl p-6 hover-lift">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Fast & Secure</h3>
                <p className="text-sm text-slate-600">Lightning-fast browsing with enterprise-grade security</p>
              </div>

              <div className="glass-card rounded-xl p-6 hover-lift">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-xl">🤝</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Direct Contact</h3>
                <p className="text-sm text-slate-600">Connect directly with store owners via WhatsApp and phone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-semibold text-slate-900">Downxtown</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Connecting communities through local commerce
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <span>© 2024 Downxtown</span>
              <span>•</span>
              <a href="#privacy" className="hover:text-slate-700">Privacy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-slate-700">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
