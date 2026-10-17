"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { Award, RotateCcw, ShieldCheck, Wallet, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { QUIZ_QUESTIONS } from "@/data/quizQuestions";
import { QUIZ_STAMP_ABI, getQuizStampAddress } from "@/config/contract";
import { botchainTestnet } from "@/config/botchain";
import { TransactionFeedback } from "./TransactionFeedback";

interface ResultsCardProps {
  score: number;
  userAnswers: Record<number, number>;
  onRetakeQuiz: () => void;
  onScoreSavedSuccess: () => void;
}

export function ResultsCard({
  score,
  userAnswers,
  onRetakeQuiz,
  onScoreSavedSuccess,
}: ResultsCardProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [hasSavedLocally, setHasSavedLocally] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);

  const contractAddress = getQuizStampAddress();
  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  // Wagmi contract write
  const {
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for transaction receipt
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // When confirmed, mark as saved and notify parent
  React.useEffect(() => {
    if (isConfirmed && !hasSavedLocally) {
      setHasSavedLocally(true);
      onScoreSavedSuccess();
    }
  }, [isConfirmed, hasSavedLocally, onScoreSavedSuccess]);

  const handleSaveScore = async () => {
    if (!contractAddress) {
      alert("Contract address is not configured. Please deploy and configure the contract address.");
      return;
    }

    if (!isConnected) {
      const injected = connectors.find((c) => c.id === "injected") || connectors[0];
      if (injected) connect({ connector: injected });
      return;
    }

    if (isWrongNetwork) {
      switchChain({ chainId: botchainTestnet.id });
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: QUIZ_STAMP_ABI,
        functionName: "saveScore",
        args: [BigInt(score)],
      });
    } catch (err) {
      console.error("Failed to initiate transaction:", err);
    }
  };

  // Result messages based on score
  const getResultMessage = (s: number) => {
    switch (s) {
      case 5:
        return "Flawless score! You possess exceptional comprehension of computing fundamentals.";
      case 4:
        return "Great job! You have a solid grasp of core technical concepts.";
      case 3:
        return "Good effort! A decent understanding with room for a quick refresher.";
      case 2:
        return "Fair start. Review the explanations below and try again to improve your score.";
      case 1:
      case 0:
      default:
        return "Keep learning! Take some time to study the fundamentals and give it another shot.";
    }
  };

  const isSaving = isWritePending || isConfirming;
  const isSaveDisabled = isSaving || hasSavedLocally || !contractAddress;

  return (
    <div className="bg-panel border border-borderDark rounded-xl p-6 sm:p-8 shadow-lg">
      {/* Score Header */}
      <div className="text-center pb-8 border-b border-borderDark">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-sm">
          <Award className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase font-semibold text-accent tracking-widest mb-1">
          Assessment Complete
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-mainText tracking-tight font-mono mb-2">
          {score} <span className="text-subText text-2xl font-normal">/ 5</span>
        </h2>
        <p className="text-sm sm:text-base text-subText max-w-md mx-auto leading-relaxed">
          {getResultMessage(score)}
        </p>
      </div>

      {/* Action Buttons: Save On-Chain & Retake */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Save Result Button */}
        {!isConnected ? (
          <button
            type="button"
            onClick={() => {
              const injected = connectors.find((c) => c.id === "injected") || connectors[0];
              if (injected) connect({ connector: injected });
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent text-[#15171C] font-semibold text-xs tracking-wide uppercase hover:bg-accent-hover transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet to Save</span>
          </button>
        ) : isWrongNetwork ? (
          <button
            type="button"
            onClick={() => switchChain({ chainId: botchainTestnet.id })}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-incorrect/15 border border-incorrect/40 text-incorrect font-semibold text-xs tracking-wide uppercase hover:bg-incorrect/25 transition-colors flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Switch to Botchain to Save</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSaveScore}
            disabled={isSaveDisabled}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
              hasSavedLocally
                ? "bg-correct/20 border border-correct/40 text-correct cursor-default"
                : isSaving
                ? "bg-accent/50 text-[#15171C] cursor-wait"
                : !contractAddress
                ? "bg-page border border-borderDark text-subText cursor-not-allowed"
                : "bg-accent text-[#15171C] hover:bg-accent-hover shadow-sm"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {hasSavedLocally
                ? "Result Stamped On-Chain"
                : isSaving
                ? "Saving to Botchain..."
                : "Save Result On-Chain"}
            </span>
          </button>
        )}

        {/* Retake Quiz Button */}
        <button
          type="button"
          onClick={() => {
            resetWrite();
            onRetakeQuiz();
          }}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-borderDark text-mainText text-xs font-semibold tracking-wide uppercase hover:bg-page transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
      </div>

      {/* Contract Warning if not deployed */}
      {!contractAddress && (
        <p className="text-center text-xs text-subText mt-3">
          (Contract address not yet configured. Deploy contract to Botchain Testnet to enable on-chain saves.)
        </p>
      )}

      {/* Transaction Feedback */}
      <TransactionFeedback
        isPending={isWritePending}
        isConfirming={isConfirming}
        isSuccess={isConfirmed}
        error={writeError || receiptError}
        hash={txHash}
      />

      {/* Review Answers Toggle */}
      <div className="mt-8 pt-6 border-t border-borderDark">
        <button
          type="button"
          onClick={() => setShowReview(!showReview)}
          className="text-xs text-accent hover:text-accent-hover font-medium underline underline-offset-4 flex items-center gap-1 mx-auto"
        >
          <span>{showReview ? "Hide Answer Review" : "Review Quiz Answers & Explanations"}</span>
        </button>

        {showReview && (
          <div className="mt-6 space-y-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedIdx = userAnswers[q.id];
              const isCorrect = selectedIdx === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-lg bg-page/80 border border-borderDark text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-mainText">
                      {idx + 1}. {q.question}
                    </p>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-correct font-semibold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-incorrect font-semibold shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="pl-2 border-l-2 border-borderDark space-y-1">
                    <p className="text-subText">
                      Your answer:{" "}
                      <span
                        className={isCorrect ? "text-correct font-medium" : "text-incorrect font-medium"}
                      >
                        {selectedIdx !== undefined ? q.options[selectedIdx] : "None"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-subText">
                        Correct answer:{" "}
                        <span className="text-correct font-medium">
                          {q.options[q.correctAnswerIndex]}
                        </span>
                      </p>
                    )}
                    <p className="text-subText/80 text-[11px] italic pt-1">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
