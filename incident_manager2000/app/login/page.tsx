'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isLoading, user } = useAuth();

  // If already authenticated, redirect to dashboard
  if (user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
          <p className="text-gray-600 mb-6">You are already logged in as {user.name}</p>
          <Link href="/">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Incident Manager</h1>
          <p className="text-gray-600">Sign in to manage incidents</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => login('microsoft')}
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M0 0h9v9H0V0zm11 0h9v9h-9V0zM0 11h9v9H0v-9zm11 0h9v9h-9v-9z" />
              </svg>
              Sign in with Microsoft
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure authentication powered by OAuth 2.0 and OpenID Connect</p>
        </div>
      </div>
    </div>
  );
}
