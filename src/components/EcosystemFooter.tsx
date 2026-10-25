"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, ShieldCheck, Globe, Search } from "lucide-react";
import { getQuizStampAddress } from "@/config/contract";

export function EcosystemFooter() {
  const contractExplorerUrl = "https://scan.botchain.ai/address/0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100#code";

  return (
    <footer className="w-full mt-16 border-t border-borderDark/80 bg-panel/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Ecosystem Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-borderDark/60 gap-4">
          <div className="flex items-center gap-3.5">
            {/* BOT Chain Official Image Logo */}
            <div className="w-12 h-12 rounded-xl bg-page border border-borderDark p-1.5 flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-mainText">BOT Chain</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-accent/15 text-accent border border-accent/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  Mainnet Live
                </span>
              </div>
              <p className="text-xs text-subText">
                High-performance Layer-1 blockchain for autonomous AI &amp; decentralized micro-applications
              </p>
            </div>
          </div>

          {/* Network Parameters */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-subText">
            <span className="px-2.5 py-1 rounded bg-page border border-borderDark">
              Chain ID: <strong className="text-mainText">677</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-page border border-borderDark">
              Native Token: <strong className="text-accent">BOT</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-page border border-borderDark">
              Total Supply: <strong className="text-mainText">150M</strong>
            </span>
          </div>
        </div>

        {/* Links Grid with BOT Chain Logo at the front */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-borderDark/60">
          {/* Card 1: BOT Chain Official Website */}
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-xl bg-page/70 border border-borderDark hover:border-accent/60 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-page border border-borderDark p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src="/botchain-logo.png"
                      alt="BOT Chain Logo"
                      width={28}
                      height={28}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-subText group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-semibold text-mainText group-hover:text-accent transition-colors">
                BOT Chain Website
              </h3>
              <p className="text-xs text-subText mt-1.5 leading-relaxed">
                Explore the official BOT Chain portal, ecosystem announcements, network whitepaper, and technical documentation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-borderDark/50 text-[11px] font-mono text-accent flex items-center gap-1.5">
              <span>https://botchain.ai</span>
            </div>
          </a>

          {/* Card 2: BOT Chain Explorer */}
          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-xl bg-page/70 border border-borderDark hover:border-accent/60 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-page border border-borderDark p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src="/botchain-logo.png"
                      alt="BOT Chain Logo"
                      width={28}
                      height={28}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-subText group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-semibold text-mainText group-hover:text-accent transition-colors">
                BOT Chain Explorer
              </h3>
              <p className="text-xs text-subText mt-1.5 leading-relaxed">
                Real-time block explorer inspecting transactions, token transfers, gas fees, and verified smart contracts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-borderDark/50 text-[11px] font-mono text-accent flex items-center gap-1.5">
              <span>https://scan.botchain.ai</span>
            </div>
          </a>

          {/* Card 3: Verified On-Chain Stamping */}
          <a
            href={contractExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-xl bg-page/70 border border-borderDark hover:border-accent/60 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-correct/10 border border-correct/30 flex items-center justify-center text-correct group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-subText group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-semibold text-mainText group-hover:text-accent transition-colors">
                Verified Smart Contract
              </h3>
              <p className="text-xs text-subText mt-1.5 leading-relaxed">
                QuizStamp scores are permanently attested on-chain. Inspect the verified open-source contract on BotchainScan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-borderDark/50 text-[11px] font-medium text-correct flex items-center gap-1.5">
              <span>Verified &amp; Active on Mainnet</span>
            </div>
          </a>
        </div>

        {/* Bottom Disclaimer & Attribution with Logo */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subText">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded overflow-hidden relative shrink-0">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="w-full h-full object-contain"
              />
            </div>
            <p>
              &copy; {new Date().getFullYear()} <strong className="text-mainText">QuizStamp</strong>. Built natively on{" "}
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
              >
                BOT Chain
              </a>.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors flex items-center gap-1.5 group"
            >
              <div className="w-3.5 h-3.5 rounded overflow-hidden relative shrink-0">
                <Image
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  width={14}
                  height={14}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>botchain.ai</span>
              <ExternalLink className="w-3 h-3 text-subText group-hover:text-accent" />
            </a>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors flex items-center gap-1.5 group"
            >
              <div className="w-3.5 h-3.5 rounded overflow-hidden relative shrink-0">
                <Image
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  width={14}
                  height={14}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>scan.botchain.ai</span>
              <ExternalLink className="w-3 h-3 text-subText group-hover:text-accent" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
