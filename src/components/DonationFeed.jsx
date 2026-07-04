import { formatDistanceToNow } from 'date-fns';
import BigNumber from 'bignumber.js';
import { Heart, Shield, Award, Crown, Zap } from 'lucide-react';

export default function DonationFeed({ donations, badges }) {
  const getBadgeDetail = (tier) => {
    switch (tier) {
      case 1:
        return { label: 'Bronze Sponsor', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: <Shield size={12} className="text-amber-400" /> };
      case 2:
        return { label: 'Silver Sponsor', color: 'text-slate-300 border-slate-400/20 bg-slate-400/5', icon: <Award size={12} className="text-slate-300" /> };
      case 3:
        return { label: 'Gold Sponsor', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5', icon: <Crown size={12} className="text-yellow-400" /> };
      default:
        return { label: 'Sponsor', color: 'text-slate-400 border-slate-700/50 bg-slate-800/30', icon: <Shield size={12} className="text-slate-400" /> };
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-cyan-500/10 min-h-[500px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[20px] font-bold text-white font-[Space_Grotesk]">Live Activity</h2>
        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-visible">
        
        {/* Left Column: Recent Donations */}
        <div className="flex flex-col h-[400px]">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Heart size={14} className="text-rose-500" /> Recent Donations
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {donations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm text-slate-500">No donations yet.</p>
              </div>
            ) : (
              donations.map((donation) => {
                const amountXlm = new BigNumber(donation.amount).dividedBy(10000000).toNumber();
                
                return (
                  <div 
                    key={donation.id} 
                    className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50 hover:border-cyan-400/50 hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
                          {donation.donor.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-mono text-gray-300 font-medium">
                            {donation.donor.substring(0, 4)}...{donation.donor.substring(donation.donor.length - 4)}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {formatDistanceToNow(new Date(donation.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-cyan-400 text-sm">
                          +{amountXlm.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-[10px] text-gray-500 font-medium">XLM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Badges Earned */}
        <div className="flex flex-col h-[400px]">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Crown size={14} className="text-yellow-500" /> Badges Earned
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {badges.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm text-slate-500">No badges minted yet.</p>
              </div>
            ) : (
              badges.map((badge) => {
                const detail = getBadgeDetail(badge.tier);
                
                return (
                  <div 
                    key={badge.id} 
                    className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50 hover:border-yellow-400/50 hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300 font-bold text-xs">
                          {badge.donor.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-mono text-gray-300 font-medium">
                            {badge.donor.substring(0, 4)}...{badge.donor.substring(badge.donor.length - 4)}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {formatDistanceToNow(new Date(badge.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${detail.color}`}>
                          {detail.icon}
                          <span>{detail.label.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
