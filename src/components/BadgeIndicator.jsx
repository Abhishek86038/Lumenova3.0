import { Shield, Award, Crown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function BadgeIndicator({ tier, isLoading, error, onRetry }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 bg-slate-900/40 rounded-xl py-1 px-3 border border-slate-700/50">
        <Loader2 className="animate-spin text-cyan-400" size={14} />
        <span className="text-xs text-slate-400">Loading Badge...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-red-950/40 rounded-xl py-1 px-3 border border-red-500/20">
        <AlertCircle className="text-red-400" size={14} />
        <span className="text-xs text-red-400">Failed to load</span>
        <button 
          onClick={onRetry}
          className="text-xs text-red-300 hover:text-white underline flex items-center gap-0.5 cursor-pointer ml-1"
        >
          <RefreshCw size={10} /> Retry
        </button>
      </div>
    );
  }

  switch (tier) {
    case 1:
      return (
        <div className="flex items-center gap-1.5 bg-amber-900/20 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 text-xs font-bold shadow-lg shadow-amber-500/5 animate-pulse">
          <Shield size={14} />
          <span>BRONZE SPONSOR</span>
        </div>
      );
    case 2:
      return (
        <div className="flex items-center gap-1.5 bg-slate-400/10 text-slate-300 border border-slate-400/30 rounded-full px-3 py-1 text-xs font-bold shadow-lg shadow-slate-400/5 animate-pulse">
          <Award size={14} />
          <span>SILVER SPONSOR</span>
        </div>
      );
    case 3:
      return (
        <div className="flex items-center gap-1.5 bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 rounded-full px-3 py-1 text-xs font-bold shadow-lg shadow-yellow-500/10 animate-pulse">
          <Crown size={14} />
          <span>GOLD SPONSOR</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 bg-slate-800/60 text-slate-400 border border-slate-700/50 rounded-full px-3 py-1 text-xs font-medium">
          <Shield size={14} className="opacity-40" />
          <span>NO BADGE</span>
        </div>
      );
  }
}
