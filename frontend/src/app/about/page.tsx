"use client"
import React from 'react';
import { BookOpen, Users, Award, Video, MessageSquare, TrendingUp, CheckCircle, Star, Target, Zap, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className=" text-black">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h1 className="text-5xl font-bold mb-6">About LearnHub</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Empowering learners and educators worldwide through innovative online education. 
            Join thousands of students and instructors creating, learning, and growing together.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            To democratize education by connecting expert instructors with eager learners, 
            making quality education accessible to everyone, everywhere.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Expert Instructors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
            <div className="text-gray-600">Courses Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every course, ensuring high-quality content and learning experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                Building a supportive community where learners and instructors connect and grow together.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
              <p className="text-gray-600">
                Maintaining transparency and trust in all our interactions and educational content.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Platform Features</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Everything you need for a complete online learning experience
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Instructors */}
            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-8 h-8" />
                For Instructors
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Create Courses</div>
                    <div className="text-blue-100 text-sm">Build comprehensive courses with video lessons, quizzes, and assignments</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Course Management</div>
                    <div className="text-blue-100 text-sm">Easy-to-use dashboard to manage students, content, and analytics</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Earn Revenue</div>
                    <div className="text-blue-100 text-sm">Monetize your expertise and reach a global audience</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Student Interaction</div>
                    <div className="text-blue-100 text-sm">Engage with students through Q&A, forums, and direct messaging</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Students */}
            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                For Students
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Browse & Join Courses</div>
                    <div className="text-purple-100 text-sm">Discover thousands of courses across various categories</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Access Lessons Anytime</div>
                    <div className="text-purple-100 text-sm">Learn at your own pace with lifetime access to course materials</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Track Progress</div>
                    <div className="text-purple-100 text-sm">Monitor your learning journey with detailed progress tracking</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Review & Rate</div>
                    <div className="text-purple-100 text-sm">Share your experience and help others choose the right courses</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl p-12 text-center text-black">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you want to learn new skills or share your expertise, LearnHub is the perfect platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">        
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-lg font-semibold border-2 border-white">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}