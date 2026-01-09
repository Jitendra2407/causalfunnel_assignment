'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import Button from '@/components/ui/Button';

/**
 * The Finish Line! 🏆
 * Displays the user's score and a detailed breakdown of their answers.
 */
export default function ReportPage() {
  const { questions, answers, email, isFinished, startQuiz } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    // Security Check 🔒
    // If the user hasn't actually finished the quiz (or refreshing the page),
    // kick them back to the start so they don't cheat or see empty data!
    if (!isFinished && !Object.keys(answers).length) {
      router.replace('/');
    }
  }, [isFinished, answers, router]);

  // Tally up the score! 💯
  let score = 0;
  questions.forEach(q => {
    if (answers[q.id] === q.answer) {
      score++;
    }
  });

  const handlePlayAgain = () => {
    startQuiz(email || localStorage.getItem('quiz_user_email'));
    router.replace('/quiz');
  };

  const handleLogout = () => {
    localStorage.removeItem('quiz_user_email');
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 md:p-10 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Quiz Completed!</h1>
          <p className="text-blue-100 text-base md:text-lg">Here is your performance report</p>
          
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
             <div className="text-center">
                <span className="block text-4xl md:text-5xl font-bold">{score}</span>
                <span className="text-blue-200 text-sm md:text-base">Correct</span>
             </div>
             <div className="text-center">
                <span className="block text-4xl md:text-5xl font-bold">{questions.length - score}</span>
                <span className="text-blue-200 text-sm md:text-base">Incorrect</span>
             </div>
          </div>
          <div className="mt-6 text-xl md:text-2xl font-semibold">
             Total Score: {score} / {questions.length}
          </div>
        </div>

        <div className="p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Detailed Review</h2>
          <div className="space-y-4 md:space-y-6">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.answer;
              const isSkipped = !userAnswer;

              return (
                <div key={q.id} className="border-b border-gray-100 pb-4 md:pb-6 last:border-0">
                  <div className="flex gap-3 md:gap-4">
                    <span className="font-mono text-gray-400 font-bold text-lg md:text-xl pt-1">
                        {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="text-base md:text-lg text-gray-800 font-medium mb-2 md:mb-3 leading-snug">{q.question}</p>
                      
                      <div className="flex flex-col gap-1 md:gap-2 text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                           <span className="w-24 text-gray-500 text-xs md:text-sm">Your Answer:</span>
                           <span className={`font-semibold ${
                             isCorrect ? 'text-green-600' : isSkipped ? 'text-gray-400' : 'text-red-600'
                           }`}>
                             {userAnswer || '(Skipped)'}
                           </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="w-24 text-gray-500 text-xs md:text-sm">Correct:</span>
                            <span className="font-semibold text-green-600">{q.answer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-1">
                         {isCorrect ? (
                             <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm font-bold">
                                 +1
                             </span>
                         ) : (
                            <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold">
                                 0
                             </span>
                         )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto justify-center">
              Exit
            </Button>
            <Button onClick={handlePlayAgain} className="w-full sm:w-auto justify-center">
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
