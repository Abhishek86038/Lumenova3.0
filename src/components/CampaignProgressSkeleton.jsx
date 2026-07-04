export default function CampaignProgressSkeleton() {
  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-7 h-[260px] flex flex-col justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
        <div className="h-6 w-32 bg-slate-800 rounded-md"></div>
      </div>
      
      <div className="mb-2 space-y-2">
        <div className="flex justify-between items-baseline">
          <div className="h-4 w-12 bg-slate-800 rounded-md"></div>
          <div className="h-8 w-16 bg-slate-800 rounded-md"></div>
        </div>
        <div className="h-2 bg-slate-800 rounded-full w-full"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 h-16"></div>
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 h-16"></div>
      </div>
    </div>
  );
}
