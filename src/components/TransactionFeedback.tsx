"use client";

import React from "react";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

interface TransactionFeedbackProps {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error?: Error | null;
  hash?: `0x${string}` | string;
}

export function TransactionFeedback({
  isPending,
  isConfirming,
  isSuccess,
  error,
  hash,
}: TransactionFeedbackProps) {
  if (!isPending && !isConfirming && !isSuccess && !error) {
    return null;
  }

  const explorerUrl = hash ? `https://scan.botchain.ai/tx/${hash}` : null;

  return (
    <div className="mt-6 p-4 rounded-xl border transition-all duration-300">
      {/* 1. Wallet approval pending */}
      {isPending && (
        <div className="flex items-center gap-3 text-accent">
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-mainText">Awaiting Wallet Signature</p>
            <p className="text-subText">Please confirm the transaction in your Web3 wallet...</p>
          </div>
        </div>
      )}

      {/* 2. On-chain confirmation pending */}
      {isConfirming && (
        <div className="flex items-center justify-between gap-3 text-accent">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-mainText">Saving Score On-Chain</p>
              <p className="text-subText">Waiting for Botchain Mainnet block confirmation...</p>
            </div>
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-page border border-borderDark text-[11px] text-accent hover:border-accent flex items-center gap-1.5 transition-colors"
            >
              <span>View Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* 3. Transaction Succeeded */}
      {isSuccess && (
        <div className="flex flex-col sm:flex-row items-start sm:center justify-between gap-3 text-correct bg-correct/5 border-correct/30 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-correct shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-correct">Score Successfully Stamped On-Chain!</p>
              <p className="text-subText">Your result has been permanently recorded on Botchain Mainnet.</p>
            </div>
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-panel border border-correct/40 text-xs text-correct hover:bg-correct/10 flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Verify on Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* 4. Transaction Failed */}
      {error && !isSuccess && (
        <div className="flex items-start gap-3 text-incorrect bg-incorrect/5 border-incorrect/30 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5 text-incorrect shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-incorrect">Transaction Failed or Rejected</p>
            <p className="text-subText mt-1 break-words">
              {error.message.includes("User rejected")
                ? "The transaction request was rejected in your wallet."
                : error.message.length > 150
                ? `${error.message.substring(0, 150)}...`
                : error.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
