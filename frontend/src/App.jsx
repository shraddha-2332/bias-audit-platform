import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TextInputForm } from './components/TextInputForm';
import { EducationalPanel } from './components/EducationalPanel';
import './index.css';

function App() {
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const handleAnalysisComplete = (result) => {
    setAnalysisHistory(prev => [
      { id: Date.now(), ...result },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        className="relative bg-black bg-opacity-30 backdrop-blur-xl border-b border-purple-500 border-opacity-20 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-bold text-xl">✓</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">BiasAudit</h1>
              <p className="text-purple-300 text-sm font-medium">AI-Powered Bias Detection</p>
            </div>
          </motion.div>
          <motion.div className="hidden md:flex gap-6">
            <a href="#features" className="text-purple-200 hover:text-white transition-colors">Features</a>
            <a href="#learn" className="text-purple-200 hover:text-white transition-colors">Learn</a>
            <a href="https://github.com/shraddha-2332/bias-audit-platform" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">GitHub</a>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative max-w-7xl mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Detect Hidden Bias
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              in Seconds
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-purple-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            AI-powered platform that identifies gender, age, racial, disability, and socioeconomic biases in any text. Promote fairness and inclusive communication.
          </motion.p>
        </div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <TextInputForm onAnalysisComplete={handleAnalysisComplete} />
        </motion.div>

        {/* Educational Panel */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <EducationalPanel />
        </motion.div>

        {/* Features Section */}
        <motion.section 
          id="features"
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            {
              icon: '🎯',
              title: 'Multi-Type Detection',
              description: 'Detects 6 types of bias: gender, age, racial, disability, socioeconomic, and ability bias'
            },
            {
              icon: '💡',
              title: 'Actionable Suggestions',
              description: 'Get alternative, bias-free rewrites with one-click copy for immediate use'
            },
            {
              icon: '📊',
              title: 'Visual Analytics',
              description: 'Beautiful dashboards showing bias breakdown by category and severity'
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              className="group"
              whileHover={{ translateY: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="bg-white bg-opacity-5 backdrop-blur border border-purple-400 border-opacity-30 rounded-2xl p-8 hover:border-opacity-100 hover:bg-opacity-10 transition-all duration-300 h-full">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-purple-200 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {[
            { label: 'Bias Types', value: '6' },
            { label: 'Analysis Speed', value: '<5s' },
            { label: 'Accuracy', value: '90%+' },
            { label: 'Languages', value: 'English' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10 backdrop-blur border border-purple-400 border-opacity-30 rounded-xl p-6 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-purple-200 text-sm font-semibold mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.section>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative max-w-4xl mx-auto px-4 py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-opacity-20 backdrop-blur border border-purple-400 border-opacity-50 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-3">Ready to Promote Fair Communication?</h3>
          <p className="text-purple-200 mb-6">Start analyzing your content for hidden biases today</p>
          <motion.a 
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            Get Started Now ✨
          </motion.a>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative bg-black bg-opacity-40 border-t border-purple-500 border-opacity-20 mt-24">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-purple-200">
          <p className="font-semibold">BiasAudit Platform</p>
          <p className="text-sm mt-2">Built for Frontend Development using AI 2026 Hackathon</p>
          <p className="text-sm mt-2">Promoting fair and inclusive digital content • SDG 5, 10, 16</p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="https://github.com/shraddha-2332/bias-audit-platform" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-purple-300 hover:text-white transition-colors">Docs</a>
            <a href="#" className="text-purple-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
