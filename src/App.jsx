import { useState, useEffect, useRef } from 'react';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';
import { Networks } from '@creit.tech/stellar-wallets-kit/types';
import { fetchContractState, fetchUserBadge, submitDonation, checkTransactionStatus, server, CONTRACT_ID, BADGE_CONTRACT_ID } from './services/contract';
import WalletModal from './components/WalletModal';
import CampaignProgress from './components/CampaignProgress';
import CampaignProgressSkeleton from './components/CampaignProgressSkeleton';
import BadgeIndicator from './components/BadgeIndicator';
import ErrorBoundary from './components/ErrorBoundary';
import DonateForm from './components/DonateForm';
import DonationFeed from './components/DonationFeed';
import { Wallet, LogOut, RefreshCw, AlertCircle } from 'lucide-react';

import { xdr, scValToNative } from '@stellar/stellar-sdk';

// Initialize the static StellarWalletsKit class
StellarWalletsKit.init({
  modules: defaultModules(),
  network: Networks.TESTNET,
});

function AppContent() {
  const [pubKey, setPubKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Campaign stats
  const [campaign, setCampaign] = useState({ goal: 0, raised: 0 });
  const [isCampaignLoading, setIsCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState(null);

  // User badge
  const [badgeTier, setBadgeTier] = useState(0);
  const [isBadgeLoading, setIsBadgeLoading] = useState(false);
  const [badgeError, setBadgeError] = useState(null);

  // Activity Feeds
  const [donations, setDonations] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startLedgerRef = useRef(null);

  const fetchEvents = async () => {
    try {
      if (!startLedgerRef.current) {
        const latest = await server.getLatestLedger();
        // Go back 25,000 ledgers to capture older donations and mints
        startLedgerRef.current = Math.max(1, latest.sequence - 25000);
      }

      const eventsRes = await server.getEvents({
        startLedger: startLedgerRef.current,
        filters: [
          {
            type: 'contract',
            contractIds: [CONTRACT_ID, BADGE_CONTRACT_ID],
          }
        ],
        pagination: { limit: 1000 }
      });

      if (eventsRes && eventsRes.events) {
        const newDonations = [];
        const newBadges = [];
        for (let evt of eventsRes.events) {
          let parsedTopic0 = '';
          let addressArg = '';
          let valueArg = 0;
          try {
            if (evt.topic && evt.topic[0]) {
              parsedTopic0 = scValToNative(evt.topic[0]);
            }
            if (evt.topic && evt.topic[1]) {
              addressArg = scValToNative(evt.topic[1]);
            }
            if (evt.value) {
              const val = scValToNative(evt.value);
              if (Array.isArray(val)) {
                valueArg = Number(val[0]);
              } else if (val && typeof val === 'object') {
                valueArg = val.amount ? Number(val.amount) : 0;
              } else {
                valueArg = Number(val);
              }
            }
          } catch (err) {
            console.error("Error decoding event:", err);
          }

          if (parsedTopic0 === 'donate' && addressArg) {
            newDonations.push({
              id: evt.id,
              donor: addressArg,
              amount: valueArg,
              timestamp: evt.ledgerClosedAt || new Date().toISOString()
            });
          } else if (parsedTopic0 === 'mint' && addressArg) {
            newBadges.push({
              id: evt.id,
              donor: addressArg,
              tier: valueArg,
              timestamp: evt.ledgerClosedAt || new Date().toISOString()
            });
          }
        }

        // Update donations list
        if (newDonations.length > 0) {
          const sortedD = newDonations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setDonations(sortedD);
        }
        
        // Update badges list
        if (newBadges.length > 0) {
          const sortedB = newBadges.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setBadges(sortedB);
        }
      }
    } catch (e) {
      console.error("Event fetch error:", e);
    }
  };

  const loadCampaignState = async () => {
    setIsCampaignLoading(true);
    setCampaignError(null);
    try {
      const state = await fetchContractState();
      setCampaign(state);
    } catch (err) {
      setCampaignError("Failed to fetch campaign stats.");
    } finally {
      setIsCampaignLoading(false);
    }
  };

  const loadBadgeState = async (address) => {
    if (!address) return;
    setIsBadgeLoading(true);
    setBadgeError(null);
    try {
      const tier = await fetchUserBadge(address);
      setBadgeTier(tier);
    } catch (err) {
      setBadgeError("Failed to load badge tier.");
    } finally {
      setIsBadgeLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignState();
    fetchEvents();

    const interval = setInterval(fetchEvents, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync user badge when wallet connects/changes
  useEffect(() => {
    if (pubKey) {
      loadBadgeState(pubKey);
    } else {
      setBadgeTier(0);
      setBadgeError(null);
    }
  }, [pubKey]);

  const handleDonationSuccess = async () => {
    // Refresh campaign stats
    setIsRefreshing(true);
    try {
      const state = await fetchContractState();
      setCampaign(state);
      if (pubKey) {
        await loadBadgeState(pubKey);
      }
    } catch (e) {
      console.error("Refresh error:", e);
    } finally {
      setIsRefreshing(false);
    }

    // Refresh events immediately & scheduled later
    await fetchEvents();
    setTimeout(async () => {
      await fetchEvents();
    }, 1500);
  };

  const handleConnect = async (walletId) => {
    try {
      StellarWalletsKit.setWallet(walletId);
      const { address } = await StellarWalletsKit.fetchAddress();
      setPubKey(address);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to connect wallet: " + (e.message || JSON.stringify(e)));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] p-4 sm:p-8 relative overflow-hidden font-[Inter]">
      {/* Glow Orbs */}
      <div className="absolute w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-cyan-500/10 blur-[150px] sm:blur-[200px] -top-20 sm:-top-40 -left-20 sm:-left-40 rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-500/10 blur-[150px] sm:blur-[200px] -bottom-20 sm:-bottom-40 -right-20 sm:-right-40 rounded-full animate-pulse pointer-events-none"></div>

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 xmlns=http://www.w3.org/2000/svg%3E%3Cfilter id=n%3E%3CfeTurbulence type=fractalNoise baseFrequency=0.8 numOctaves=4/%3E%3C/filter%3E%3Crect width=100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E')] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 sm:mb-12">
          <h1 className="text-[28px] sm:text-[34px] font-bold font-[Space_Grotesk] bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent tracking-tight">
            Lumenova-L3
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pubKey && (
              <BadgeIndicator 
                tier={badgeTier} 
                isLoading={isBadgeLoading} 
                error={badgeError}
                onRetry={() => loadBadgeState(pubKey)}
              />
            )}

            {pubKey ? (
              <div className="flex items-center gap-4 bg-slate-900/80 rounded-2xl py-2 px-4 border border-cyan-500/20 backdrop-blur-md shadow-lg shadow-cyan-500/5">
                <span className="text-xs sm:text-sm font-mono text-cyan-300">
                  {pubKey.substring(0, 4)}...{pubKey.substring(pubKey.length - 4)}
                </span>
                <button 
                  onClick={() => setPubKey('')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Disconnect"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-[2px] transition-all cursor-pointer text-sm"
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Responsive for mobile, tablet, and desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Progress & Form */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {isCampaignLoading ? (
              <CampaignProgressSkeleton />
            ) : campaignError ? (
              <div className="bg-slate-900/60 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-7 flex flex-col items-center justify-center text-center h-[260px]">
                <AlertCircle className="text-red-400 mb-3" size={32} />
                <h3 className="text-white font-bold mb-2">Failed to load campaign</h3>
                <button 
                  onClick={loadCampaignState}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 font-semibold hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            ) : (
              <CampaignProgress 
                goal={campaign.goal} 
                raised={campaign.raised} 
                isRefreshing={isRefreshing}
              />
            )}
            
            <DonateForm 
              pubKey={pubKey} 
              onDonationSuccess={handleDonationSuccess} 
              onConnectClick={() => setIsModalOpen(true)}
            />
          </div>

          {/* Right Column: Feeds */}
          <div className="lg:col-span-2">
            <DonationFeed donations={donations} badges={badges} />
          </div>
        </div>

        <WalletModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onConnect={handleConnect} 
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
