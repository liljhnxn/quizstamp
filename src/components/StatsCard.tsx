"use client";

import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { Award, Layers, Globe2, RefreshCw, AlertCircle, Wallet } from "lucide-react";
import { QUIZ_STAMP_ABI, getQuizStampAddress } from "@/config/contract";

interface StatsCardProps {
  onRefreshTrigger?: number;
}

export function StatsCard({ onRefreshTrigger }: StatsCardProps) {
  const { address, isConnected } = useAccount();
  const contractAddress = getQuizStampAddress();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Read Global Total Submissions
  const {
    data: totalSubmissionsData,
    isLoading: isLoadingTotal,
    refetch: refetchTotal,
  } = useReadContract({
    address: contractAddress,
    abi: QUIZ_STAMP_ABI,
    functionName: "getTotalSubmissions",
    query: {
      enabled: !!contractAddress,
    },
  });

  // Read User Personal Best Score
  const {
    data: bestScoreData,
    isLoading: isLoadingBest,
    refetch: refetchBest,
  } = useReadContract({
    address: contractAddress,
    abi: QUIZ_STAMP_ABI,
    functionName: "getMyBestScore",
    account: address,
    query: {
      enabled: !!contractAddress && isConnected && !!address,
    },
  });

  // Read User Total Submissions
  const {
    data: mySubmissionsData,
    isLoading: isLoadingSubmissions,
    refetch: refetchSubmissions,
  } = useReadContract({
    address: contractAddress,
    abi: QUIZ_STAMP_ABI,
    functionName: "getMySubmissions",
    account: address,
    query: {
      enabled: !!contractAddress && isConnected && !!address,
    },
  });

  // Re-fetch when trigger changes
  React.useEffect(() => {
    if (contractAddress) {
      refetchTotal();
      if (isConnected && address) {
        refetchBest();
        refetchSubmissions();
      }
    }
  }, [onRefreshTrigger, contractAddress, isConnected, address, refetchTotal, refetchBest, refetchSubmissions]);

  const handleRefreshAll = () => {
    refetchTotal();
    if (isConnected && address) {
      refetchBest();
      refetchSubmissions();
    }
  };

  const totalSubmissions = totalSubmissionsData !== undefined ? Number(totalSubmissionsData) : 0;
  const personalBest = bestScoreData !== undefined ? Number(bestScoreData) : 0;
  const personalSubmissions = mySubmissionsData !== undefined ? Number(mySubmissionsData) : 0;

  return (
    <div className="bg-panel border border-borderDark rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-borderDark mb-6">
        <div>
          <h2 className="text-lg font-semibold text-mainText flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <span>On-Chain Statistics</span>
          </h2>
          <p className="text-xs text-subText">
            Verified data fetched directly from Botchain Testnet
          </p>
        </div>
        {contractAddress && (
          <button
            onClick={handleRefreshAll}
            className="p-1.5 rounded-md hover:bg-page border border-transparent hover:border-borderDark text-subText hover:text-mainText transition-colors"
            title="Refresh On-Chain Stats"
            aria-label="Refresh On-Chain Stats"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {!contractAddress && (
        <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/30 text-xs text-subText flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-mainText mb-1">Contract Deployment Pending</p>
            <p>
              Smart contract is not yet deployed or configured. After deploying to Botchain Testnet, add the address to{" "}
              <code className="text-accent bg-page/70 px-1 py-0.5 rounded">contractInfo.json</code> or{" "}
              <code className="text-accent bg-page/70 px-1 py-0.5 rounded">NEXT_PUBLIC_CONTRACT_ADDRESS</code>.
            </p>
          </div>
        </div>
      )}

      {/* Grid of metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Global Submissions */}
        <div className="bg-page/80 rounded-lg p-4 border border-borderDark flex flex-col justify-between">
          <div className="flex items-center justify-between text-subText text-xs font-medium mb-2">
            <span>Global Submissions</span>
            <Globe2 className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-mainText">
            {isLoadingTotal ? (
              <span className="text-subText animate-pulse text-base">Loading...</span>
            ) : contractAddress ? (
              totalSubmissions.toLocaleString()
            ) : (
              "0"
            )}
          </div>
          <span className="text-[11px] text-subText mt-1">Across all users</span>
        </div>

        {/* Metric 2: Personal Best */}
        <div className="bg-page/80 rounded-lg p-4 border border-borderDark flex flex-col justify-between">
          <div className="flex items-center justify-between text-subText text-xs font-medium mb-2">
            <span>Personal Best</span>
            <Award className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-mainText">
            {!mounted || !isConnected ? (
              <span className="text-subText text-sm font-sans font-normal">Connect Wallet</span>
            ) : isLoadingBest ? (
              <span className="text-subText animate-pulse text-base">Loading...</span>
            ) : contractAddress ? (
              `${personalBest} / 5`
            ) : (
              "— / 5"
            )}
          </div>
          <span className="text-[11px] text-subText mt-1">Your highest verified score</span>
        </div>

        {/* Metric 3: Your Submissions */}
        <div className="bg-page/80 rounded-lg p-4 border border-borderDark flex flex-col justify-between">
          <div className="flex items-center justify-between text-subText text-xs font-medium mb-2">
            <span>Your Submissions</span>
            <Layers className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-mainText">
            {!mounted || !isConnected ? (
              <span className="text-subText text-sm font-sans font-normal">Connect Wallet</span>
            ) : isLoadingSubmissions ? (
              <span className="text-subText animate-pulse text-base">Loading...</span>
            ) : contractAddress ? (
              personalSubmissions.toLocaleString()
            ) : (
              "0"
            )}
          </div>
          <span className="text-[11px] text-subText mt-1">Attempts stamped on-chain</span>
        </div>
      </div>

      {/* Disconnected note */}
      {(!mounted || !isConnected) && (
        <div className="mt-4 pt-3 border-t border-borderDark/60 flex items-center justify-center gap-2 text-xs text-subText text-center">
          <Wallet className="w-3.5 h-3.5 text-accent" />
          <span>Connect your Web3 wallet to inspect your personal score history.</span>
        </div>
      )}
    </div>
  );
}
