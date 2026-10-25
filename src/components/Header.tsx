"use client";

import React from "react";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { GraduationCap, Wallet, LogOut, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { botchain } from "@/config/botchain";

export function Header() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== botchain.id;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="w-full border-b border-borderDark bg-panel/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-mainText flex items-center gap-2">
              QuizStamp
            </h1>
            <p className="text-xs text-subText font-medium">
              Learn. Test yourself. Save your score.
            </p>
          </div>
        </div>

        {/* Ecosystem Links & Wallet Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* BOT Chain Website Link with Logo in Front */}
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-page border border-borderDark text-mainText hover:text-accent hover:border-accent text-xs font-medium flex items-center gap-2 transition-colors shadow-sm group"
            title="BOT Chain Official Website"
          >
            <div className="w-4 h-4 rounded overflow-hidden relative shrink-0">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <span>BOT Chain</span>
            <ExternalLink className="w-3 h-3 text-subText group-hover:text-accent" />
          </a>

          {/* BOT Chain Explorer Link with Logo in Front */}
          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-page border border-borderDark text-mainText hover:text-accent hover:border-accent text-xs font-medium flex items-center gap-2 transition-colors shadow-sm group"
            title="BOT Chain Explorer"
          >
            <div className="w-4 h-4 rounded overflow-hidden relative shrink-0">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-subText group-hover:text-accent" />
          </a>

          {/* Network Indicator */}
          {mounted && isConnected && (
            <div className="flex items-center gap-2">
              {isWrongNetwork ? (
                <button
                  onClick={() => switchChain({ chainId: botchain.id })}
                  disabled={isSwitching}
                  className="px-3 py-1.5 rounded-md bg-incorrect/15 border border-incorrect/40 text-incorrect text-xs font-medium flex items-center gap-1.5 hover:bg-incorrect/25 transition-colors"
                  title="Click to switch to Botchain Mainnet"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isSwitching ? "Switching..." : "Switch to Mainnet"}</span>
                </button>
              ) : (
                <div className="px-3 py-1.5 rounded-md bg-correct/10 border border-correct/30 text-correct text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mainnet</span>
                </div>
              )}
            </div>
          )}

          {/* Connect / Account Button */}
          {mounted && isConnected && address ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-page border border-borderDark text-mainText text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-correct inline-block"></span>
                <span>{formatAddress(address)}</span>
              </div>
              <button
                onClick={() => disconnect()}
                className="p-1.5 rounded-lg bg-page border border-borderDark text-subText hover:text-mainText hover:border-incorrect/50 hover:bg-incorrect/10 transition-colors"
                title="Disconnect Wallet"
                aria-label="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 rounded-lg bg-accent text-[#15171C] font-semibold text-xs tracking-wide uppercase hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
