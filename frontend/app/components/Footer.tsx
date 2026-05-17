'use client';

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">TradeConnect</span>
            <p className="text-sm text-gray-400 mt-1">
              © 2024 TradeConnect Inc. Reliable. Transparent. Efficient.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}