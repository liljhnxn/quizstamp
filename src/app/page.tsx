"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { QuizCard } from "@/components/QuizCard";
import { ResultsCard } from "@/components/ResultsCard";
import { StatsCard } from "@/components/StatsCard";

export default function Home() {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [statsRefreshKey, setStatsRefreshKey] = useState<number>(0);

  const handleQuizComplete = (score: number, answers: Record<number, number>) => {
    setCurrentScore(score);
    setUserAnswers(answers);
    setIsCompleted(true);
  };

  const handleRetakeQuiz = () => {
    setIsCompleted(false);
    setCurrentScore(0);
    setUserAnswers({});
  };

  const handleScoreSavedSuccess = () => {
    // Trigger statistics reload
    setStatsRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-page flex flex-col text-mainText selection:bg-accent selection:text-[#15171C]">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Main Quiz / Results Container */}
        <section aria-label="Quiz Content">
          {!isCompleted ? (
            <QuizCard onQuizComplete={handleQuizComplete} />
          ) : (
            <ResultsCard
              score={currentScore}
              userAnswers={userAnswers}
              onRetakeQuiz={handleRetakeQuiz}
              onScoreSavedSuccess={handleScoreSavedSuccess}
            />
          )}
        </section>

        {/* Blockchain Statistics Card */}
        <section aria-label="On-Chain Statistics">
          <StatsCard onRefreshTrigger={statsRefreshKey} />
        </section>

        {/* Educational / Academic Footer Notice */}
        <footer className="text-center text-xs text-subText py-6 border-t border-borderDark/40">
          <p>
            QuizStamp is an educational decentralized application running on{" "}
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              Botchain Testnet
            </a>{" "}
            (Chain ID: 968).
          </p>
          <p className="mt-1 text-subText/80">
            Scores are evaluated in the browser and permanently recorded on-chain via smart contract.
          </p>
        </footer>
      </main>
    </div>
  );
}
