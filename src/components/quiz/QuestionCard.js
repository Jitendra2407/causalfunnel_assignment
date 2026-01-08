'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import Button from '@/components/ui/Button';

export default function QuestionCard() {
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    submitAnswer, 
    jumpToQuestion 
  } = useQuiz();

  const question = questions[currentQuestionIndex];
  const selectedOption = answers[question.id];

  const handleOptionClick = (option) => {
    submitAnswer(question.id, option);
  };

  const handleNext = () => jumpToQuestion(currentQuestionIndex + 1);
  const handlePrev = () => jumpToQuestion(currentQuestionIndex - 1);

  return (
    <div key={currentQuestionIndex} className="bg-white p-4 md:p-8 rounded-2xl shadow-lg flex-1 animate-fade-in">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <span className="text-gray-500 font-medium text-sm md:text-base">Question {currentQuestionIndex + 1} of {questions.length}</span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 leading-tight">{question.question}</h2>

      <div className="space-y-3 md:space-y-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <div 
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 md:gap-4 group active:scale-[0.98] ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-600 rounded-full"></div>}
              </div>
              <span className={`text-base md:text-lg ${isSelected ? 'text-blue-900 font-semibold' : 'text-gray-700'}`}>
                {option}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-6 md:mt-8 pt-6 border-t border-gray-100">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
          className="text-sm md:text-base px-4 md:px-6"
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={currentQuestionIndex === questions.length - 1}
          className="text-sm md:text-base px-4 md:px-6"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
