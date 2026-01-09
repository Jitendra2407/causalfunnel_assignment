'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();


/**
 * QuizContext
 * 
 * This is the central brain of our application! 🧠
 * It manages the entire global state so we don't have to pass props down a million levels.
 * 
 * What it handles:
 * - 👤 User Session: Keeps track of who's taking the quiz (email).
 * - ❓ Questions: Fetches and stores the trivia questions from the API.
 * - 📝 Progress: Tracks which question the user is on, their answers, and which ones they've visited.
 * - ⏳ Timer: Manages the countdown so the user knows how much time is left.
 */
export function QuizProvider({ children }) {
  // User Data
  const [email, setEmail] = useState('');

  // Quiz Data & Status
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Stores the user's selected answers. Map: { questionId: selectedOption }
  // We use a map for O(1) lookups when checking if a question is answered.
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set([0])); // Set: { questionIndex }
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer State (30 mins = 1800 seconds)
  const [timeRemaining, setTimeRemaining] = useState(1800);

  // Initialize from localStorage for session persistence
  useEffect(() => {
    const savedEmail = localStorage.getItem('quiz_user_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // Track visited questions to update UI
  useEffect(() => {
    if (questions.length > 0) {
       setVisited(prev => new Set(prev).add(currentQuestionIndex));
    }
  }, [currentQuestionIndex, questions.length]);

  // Helper to decode HTML entities from API response (e.g. &quot; -> ")
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  /**
   * Fetches 15 questions from OpenTDB API.
   * Transforms raw data:
   * 1. Decodes HTML entities
   * 2. Combines Correct + Incorrect answers
   * 3. Shuffles options for randomness
   */
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
          // Shuffle options so the correct answer isn't always in the same spot!
          // We assign a random sort value to each option and then sort based on that.
          const shuffledOptions = allOptions
             .map(value => ({ value, sort: Math.random() }))
             .sort((a, b) => a.sort - b.sort)
             .map(({ value }) => decodeHTML(value));

          return {
            id: index, // Use index as ID since API returns dynamic questions
            question: decodeHTML(q.question),
            options: shuffledOptions,
            answer: decodeHTML(q.correct_answer),
            type: q.type,
            difficulty: q.difficulty,
            category: q.category
          };
        });
        setQuestions(formattedQuestions);
        // Reset/Initialize Quiz State
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
    
    // Reset everything! New user = fresh start.
    // We do this immediately to ensure the UI is clean before we start fetching.
    setIsFinished(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setVisited(new Set([0]));
    
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
    fetchQuestions
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
