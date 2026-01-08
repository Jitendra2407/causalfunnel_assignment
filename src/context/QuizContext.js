'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  // User Data
  const [email, setEmail] = useState('');

  // Quiz Data & Status
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [visited, setVisited] = useState(new Set([0]));
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer State (30 mins = 1800 seconds)
  const [timeRemaining, setTimeRemaining] = useState(1800);

  // Initialize from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('quiz_user_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
       setVisited(prev => new Set(prev).add(currentQuestionIndex));
    }
  }, [currentQuestionIndex, questions.length]);

  // Helper to decode HTML entities from API
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=15');
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const formattedQuestions = data.results.map((q, index) => {
          // Combine and shuffle options
          const allOptions = [...q.incorrect_answers, q.correct_answer];
          // Simple shuffle
          const shuffledOptions = allOptions
             .map(value => ({ value, sort: Math.random() }))
             .sort((a, b) => a.sort - b.sort)
             .map(({ value }) => decodeHTML(value));

          return {
            id: index, // OpenTDB doesn't usually return IDs, so using index
            question: decodeHTML(q.question),
            options: shuffledOptions,
            answer: decodeHTML(q.correct_answer),
            type: q.type,
            difficulty: q.difficulty,
            category: q.category
          };
        });
        setQuestions(formattedQuestions);
        // Ensure state is ready for start
        setCurrentQuestionIndex(0);
        setAnswers({});
        setVisited(new Set([0]));
        setIsFinished(false);
        setTimeRemaining(1800); 
      } else {
        throw new Error('No questions returned from API');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (userEmail) => {
    setEmail(userEmail);
    localStorage.setItem('quiz_user_email', userEmail);
    await fetchQuestions();
  };

  const submitAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const jumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const value = {
    questions,
    loading,
    error,
    email,
    currentQuestionIndex,
    answers,
    visited,
    isFinished,
    timeRemaining,
    setTimeRemaining,
    startQuiz,
    submitAnswer,
    jumpToQuestion,
    finishQuiz,
    fetchQuestions // exported purely for retry capability if needed
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}
