'use client';

import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';

export default function Timer() {
  const { timeRemaining, setTimeRemaining, finishQuiz, isFinished } = useQuiz();

  useEffect(() => {
    if (isFinished) return;
    
    // Prevent multiple intervals if mounting/unmounting
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, finishQuiz, setTimeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-xl font-mono font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={timeRemaining < 300 ? 'text-red-500' : ''}>
            {formatTime(timeRemaining)}
        </span>
    </div>
  );
}
