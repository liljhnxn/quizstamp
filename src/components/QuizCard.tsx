"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, AlertCircle } from "lucide-react";
import { QUIZ_QUESTIONS, Question } from "@/data/quizQuestions";

interface QuizCardProps {
  onQuizComplete: (score: number, userAnswers: Record<number, number>) => void;
}

export function QuizCard({ onQuizComplete }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentQuestion: Question = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentAnswer = selectedAnswers[currentQuestion.id];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
    setValidationError(null);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion.id] === undefined) {
      setValidationError("Please select an answer to continue.");
      return;
    }
    setValidationError(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Verify all questions have an answer
    for (const q of QUIZ_QUESTIONS) {
      if (selectedAnswers[q.id] === undefined) {
        setValidationError(`Please answer Question ${q.id} before submitting.`);
        // Jump to unanswered question
        const unansweredIdx = QUIZ_QUESTIONS.findIndex((item) => item.id === q.id);
        if (unansweredIdx !== -1) {
          setCurrentIndex(unansweredIdx);
        }
        return;
      }
    }

    // Calculate score
    let calculatedScore = 0;
    for (const q of QUIZ_QUESTIONS) {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        calculatedScore += 1;
      }
    }

    onQuizComplete(calculatedScore, selectedAnswers);
  };

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="bg-panel border border-borderDark rounded-xl p-6 sm:p-8 shadow-lg">
      {/* Quiz Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-borderDark">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Interactive Assessment</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-mainText">
            Computer & Technology Basics
          </h2>
          <p className="text-xs sm:text-sm text-subText mt-1">
            Test your foundational knowledge in web development and computing.
          </p>
        </div>

        {/* Question Counter Pill */}
        <div className="self-start sm:self-center px-3 py-1.5 rounded-full bg-page border border-borderDark text-accent text-xs font-semibold whitespace-nowrap">
          Question {currentIndex + 1} of {totalQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 mb-8">
        <div className="flex justify-between items-center text-xs text-subText mb-2">
          <span>Overall Progress</span>
          <span className="font-mono text-mainText">{answeredCount} of {totalQuestions} Answered</span>
        </div>
        <div className="w-full h-2 rounded-full bg-page border border-borderDark/60 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-mainText leading-relaxed">
          {currentQuestion.question}
        </h3>
      </div>

      {/* 4 Selectable Answers */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = currentAnswer === idx;
          const optionLetters = ["A", "B", "C", "D"];

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? "bg-accent/15 border-accent text-mainText shadow-sm"
                  : "bg-page/70 border-borderDark text-mainText/90 hover:bg-page hover:border-borderDark/90 hover:text-mainText"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? "bg-accent text-[#15171C]"
                      : "bg-panel border border-borderDark text-subText"
                  }`}
                >
                  {optionLetters[idx]}
                </span>
                <span className="text-sm font-medium">{option}</span>
              </div>
              {isSelected && <CheckCircle className="w-5 h-5 text-accent shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Validation Message */}
      {validationError && (
        <div className="mb-6 p-3 rounded-lg bg-incorrect/10 border border-incorrect/30 text-incorrect text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Controls: Prev / Next / Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-borderDark">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-lg border border-borderDark text-mainText text-xs font-medium hover:bg-page disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-accent text-[#15171C] font-semibold text-xs tracking-wide uppercase hover:bg-accent-hover transition-colors shadow-sm flex items-center gap-2"
          >
            <span>Submit Quiz</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg bg-accent text-[#15171C] font-semibold text-xs tracking-wide uppercase hover:bg-accent-hover transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
