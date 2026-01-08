'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import Button from '@/components/ui/Button';

export default function NavPanel() {
  const { questions, currentQuestionIndex, jumpToQuestion, answers, visited } = useQuiz();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-fit max-w-xs w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Questions</h3>
      <div className="grid grid-cols-4 gap-3">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentQuestionIndex;
          const isAnswered = answers[q.id] !== undefined;
          const isVisited = visited.has(idx);

          // Determine styling
          let variant = 'outline'; // Default unvisited
          let className = "w-10 h-10 p-0 flex items-center justify-center font-semibold text-sm";
          
          if (isCurrent) {
            className += " border-2 border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-300 ring-offset-1";
          } else if (isAnswered) {
             className += " bg-blue-600 text-white border-blue-600 hover:bg-blue-700";
          } else if (isVisited) {
             className += " bg-gray-200 text-gray-700 border-gray-200 hover:bg-gray-300";
          } else {
             className += " text-gray-500 border-gray-300 hover:bg-gray-100";
          }

          return (
            <button
              key={q.id}
              onClick={() => jumpToQuestion(idx)}
              className={`rounded-lg transition-all duration-200 ${className}`}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-col gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span> Answered
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-200 rounded-full border border-gray-300"></span> Visited
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-blue-600 rounded-full"></span> Current
        </div>
      </div>
    </div>
  );
}
