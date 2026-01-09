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
  // Add initializing state to block UI/logic until restore is done
  const [initializing, setInitializing] = useState(true);

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
    // 1. Restore User Session
    const savedEmail = localStorage.getItem('quiz_user_email');
    if (savedEmail) setEmail(savedEmail);

    // 2. Restore Quiz State (Anti-Cheat / Persistence) 🛡️
    const savedState = localStorage.getItem('quiz_state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setQuestions(parsedState.questions || []);
        setCurrentQuestionIndex(parsedState.currentQuestionIndex || 0);
        setAnswers(parsedState.answers || {});
        // Convert array back to Set for 'visited'
        setVisited(new Set(parsedState.visited || [0]));
        setTimeRemaining(parsedState.timeRemaining || 1800);
        setIsFinished(parsedState.isFinished || false);
      } catch (e) {
        console.error("Failed to parse saved quiz state", e);
        // If state is corrupt, maybe clear it? For now, just log.
      }
    }
    // Done initializing! 🚀
    setInitializing(false);
  }, []);

  // Save Quiz State to localStorage whenever it changes 💾
  useEffect(() => {
    // Only save if we actually have questions (i.e., quiz has started)
    if (questions.length > 0) {
      const stateToSave = {
        questions,
        currentQuestionIndex,
        answers,
        visited: Array.from(visited), // Sets aren't JSON-serializable by default!
        timeRemaining,
        isFinished
      };
      localStorage.setItem('quiz_state', JSON.stringify(stateToSave));
    }
  }, [questions, currentQuestionIndex, answers, visited, timeRemaining, isFinished]);

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
    localStorage.removeItem('quiz_state'); // Clear any old session data!
    
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
    initializing, // Expose this!
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
