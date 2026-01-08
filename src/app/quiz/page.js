'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import Timer from '@/components/quiz/Timer';
import NavPanel from '@/components/quiz/NavPanel';
import QuestionCard from '@/components/quiz/QuestionCard';
import Button from '@/components/ui/Button';

export default function QuizPage() {
  const { email, isFinished, finishQuiz, loading, error, questions, fetchQuestions } = useQuiz();
  const router = useRouter();

  // Redirect to start if no email
  useEffect(() => {
    const savedEmail = localStorage.getItem('quiz_user_email');
    if (!savedEmail) {
      router.replace('/');
    } else if (questions.length === 0 && !loading && !error) {
      // Trigger fetch if we have email but no questions (page refresh)
      fetchQuestions();
    }
  }, [router, questions.length, loading, error, fetchQuestions]);

  // Redirect to report if finished
  useEffect(() => {
    if (isFinished) {
      router.replace('/report');
    }
  }, [isFinished, router]);

  // Initial check for localStorage to avoid flash
  if (typeof window !== 'undefined' && !localStorage.getItem('quiz_user_email')) {
    return null; 
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading Quiz...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
                <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={fetchQuestions}>Try Again</Button>
            </div>
      </div>
    );
  }

  // Guard clause against empty questions if not loading/error
  if (!questions || questions.length === 0) {
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
            <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wide">Candidate</span>
            <span className="font-semibold text-gray-800 text-sm md:text-base truncate max-w-[200px]">
                {email || localStorage.getItem('quiz_user_email')}
            </span>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
             <Timer />
             <Button onClick={finishQuiz} variant="primary" className="bg-red-600 hover:bg-red-700 text-sm md:text-base px-3 md:px-6 whitespace-nowrap">
                Submit Quiz
             </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <QuestionCard />
          <NavPanel />
        </div>
      </div>
    </div>
  );
}
