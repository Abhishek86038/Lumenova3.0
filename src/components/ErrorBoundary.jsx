import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center p-6 font-[Inter]">
          <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-8 shadow-2xl shadow-red-500/10 text-center relative overflow-hidden">
            <div className="absolute w-[200px] h-[200px] bg-red-500/10 blur-[50px] -top-20 -left-20 rounded-full pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20">
              <AlertTriangle size={32} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3 font-[Space_Grotesk]">Something went wrong</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected error occurred in the application. Please try reloading the page or reset the app state.
            </p>
            
            {this.state.error && (
              <div className="text-left bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-6 overflow-x-auto max-h-32 text-xs font-mono text-red-400 custom-scrollbar">
                {this.state.error.toString()}
              </div>
            )}
            
            <button
              onClick={this.handleReset}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:shadow-lg hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              Reset Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
