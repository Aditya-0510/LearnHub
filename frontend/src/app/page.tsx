import React from 'react';
import {Footer} from './components/Footer';
import Link from 'next/link';

export default function CourseLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Future
            <span className="block text-blue-600 mt-2">One Course at a Time</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of learners mastering new skills with expert-led courses. 
            Start your learning journey today and unlock your potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/signin">
              <button 
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold transform hover:scale-105">
                Sign In 
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all text-lg font-semibold transform hover:scale-105">
                Register Now
              </button>
            </Link>
          </div>

         
        </div>
      </main>

      <Footer />
    </div>
  );
}