'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import Button from '@/components/ui/Button';

export default function ReportPage() {
  const { questions, answers, email, isFinished, startQuiz } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    // If trying to access report without finishing (or fresh load), redirect home
    if (!isFinished && !Object.keys(answers).length) {
      router.replace('/');
    }
  }, [isFinished, answers, router]);

  // Calculate Score
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
        <div className="bg-blue-600 text-white p-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-blue-100 text-lg">Here is your performance report</p>
          
          <div className="mt-8 flex justify-center gap-12">
             <div className="text-center">
                <span className="block text-5xl font-bold">{score}</span>
                <span className="text-blue-200">Correct</span>
             </div>
             <div className="text-center">
                <span className="block text-5xl font-bold">{questions.length - score}</span>
                <span className="text-blue-200">Incorrect</span>
             </div>
          </div>
          <div className="mt-6 text-2xl font-semibold">
             Total Score: {score} / {questions.length}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Review</h2>
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.answer;
              const isSkipped = !userAnswer;

              return (
                <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex gap-4">
                    <span className="font-mono text-gray-400 font-bold text-xl">
                        {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="text-lg text-gray-800 font-medium mb-3">{q.question}</p>
                      
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                           <span className="w-24 text-gray-500">Your Answer:</span>
                           <span className={`font-semibold ${
                             isCorrect ? 'text-green-600' : isSkipped ? 'text-gray-400' : 'text-red-600'
                           }`}>
                             {userAnswer || '(Skipped)'}
                           </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="w-24 text-gray-500">Correct:</span>
                            <span className="font-semibold text-green-600">{q.answer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                         {isCorrect ? (
                             <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                 +1
                             </span>
                         ) : (
                            <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-bold">
                                 0
                             </span>
                         )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center gap-6">
            <Button onClick={handleLogout} variant="outline">
              Exit
            </Button>
            <Button onClick={handlePlayAgain}>
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
