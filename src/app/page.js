'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * The Starting Line! 🏁
 * This is the first page users see. It captures their email to start the session.
 */
export default function StartPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Simple email validation regex. 
  // We want to make sure the user inputs a proper email before starting!
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    
    if (val && !validateEmail(val)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  const handleStart = () => {
    if (validateEmail(email)) {
      // Save to localStorage as per requirement
      localStorage.setItem('quiz_user_email', email);
      router.push('/quiz');
    }
  };

  const isValid = email.length > 0 && !error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to the Quiz</h1>
        <p className="text-gray-500 mb-8">Enter your email to get started</p>
        
        <div className="space-y-6">
          <Input 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={handleEmailChange}
            error={error}
          />
          
          <Button 
            onClick={handleStart} 
            disabled={!isValid}
            className="w-full"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
