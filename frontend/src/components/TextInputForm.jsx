import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BiasAnalysisResult } from './BiasAnalysisResult';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useToast, ToastContainer } from './Toast';
import { FiUpload, FiClipboard, FiCheck, FiAlertCircle, FiClock, FiDownload, FiTrendingUp } from 'react-icons/fi';

const SAMPLE_TEXTS = {
  GENERAL: "We're looking for young, energetic team members who can handle the fast pace. Must be able to work long hours without complaining.",
  'JOB POSTING': "We seek an able-bodied male professional with 10+ years of experience. Preference given to those from wealthy backgrounds who can work 60+ hour weeks.",
  ARTICLE: "The elderly residents struggled with the new technology, as expected. Being blind, he had to rely on his wife to read the documents.",
  'SOCIAL MEDIA': "Girls are naturally better at organizing events! All you guys out there, time to step up your game. Only the disabled need accommodations.",
  MARKETING: "Experience the luxury lifestyle our exclusive membership offers. Not for everyone - designed for successful businessmen aged 25-45.",
  EDUCATION: "The immigrant students may struggle with this advanced material. Women typically perform better in humanities than in STEM subjects."
};

export const TextInputForm = ({ onAnalysisComplete }) => {
  const [text, setText] = useState('');
  const [contentType, setContentType] = useState('GENERAL');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const { toasts, addToast, removeToast } = useToast();

  const handleAnalyze = async () => {
    if (text.trim().length === 0) {
      addToast('Please enter some text to analyze', 'warning');
      return;
    }

    if (text.length > 5000) {
      addToast('Text must be less than 5000 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/bias-analysis/analyze`, {
        text: text.trim(),
        contentType
      });

      setAnalysisResult(response.data);
      setHistory(prev => [
        { id: Date.now(), ...response.data, timestamp: new Date().toLocaleString() },
        ...prev
      ].slice(0, 10));
      onAnalysisComplete?.(response.data);
      addToast('Analysis complete! Great insights below.', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to analyze. Check backend is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      addToast('Text pasted!', 'success');
    } catch (err) {
      addToast('Failed to read clipboard. Please paste manually.', 'error');
    }
  };

  const handleSampleText = (type) => {
    setText(SAMPLE_TEXTS[type] || SAMPLE_TEXTS.GENERAL);
    setContentType(type);
    addToast(`Sample ${type.toLowerCase()} loaded! Click "Analyze" to see bias detection.`, 'info');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target?.result || '');
      addToast('File uploaded!', 'success');
    };
    reader.readAsText(file);
  };

  const handleExportResult = () => {
    if (!analysisResult) return;
    const json = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bias-analysis-${Date.now()}.json`;
    a.click();
    addToast('Results exported!', 'success');
  };

  if (analysisResult) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <BiasAnalysisResult 
          result={analysisResult} 
          originalText={text}
          onNewAnalysis={() => {
            setAnalysisResult(null);
            setText('');
          }}
        />
      </>
    );
  }

  const contentTypes = ['GENERAL', 'JOB POSTING', 'ARTICLE', 'SOCIAL MEDIA', 'MARKETING', 'EDUCATION'];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <motion.div
        className="bg-gradient-to-br from-white from-5% via-purple-50 to-blue-50 backdrop-blur-xl border border-white border-opacity-40 rounded-3xl p-10 max-w-3xl mx-auto shadow-2xl shadow-purple-500/20"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Content Type Section with Quick Demo */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-gray-900 font-bold text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              Content Type
            </label>
            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-semibold text-sm"
            >
              <FiClock size={18} /> History ({history.length})
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {contentTypes.map((type) => (
              <motion.button
                key={type}
                onClick={() => setContentType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
                  contentType === type
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
                }`}
              >
                {type.split(' ')[0]}
              </motion.button>
            ))}
          </div>

          {/* Quick Demo Samples */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.1 }}
            className="mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
          >
            <p className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <FiTrendingUp size={16} /> ⚡ Quick Demo - Click to load sample biased text:
            </p>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => handleSampleText(type)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-3 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-bold"
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Text Input Section */}
        <div className="mb-6">
          <label className="block text-gray-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
            Your Content
          </label>
          <motion.div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste job posting, article, social media post, or any text to analyze..."
              className="w-full h-44 bg-white text-gray-900 placeholder-gray-400 border-2 border-gray-300 rounded-2xl p-5 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none font-medium text-base"
            />
            <AnimatePresence>
              {text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-3 right-4 flex items-center gap-2 text-sm font-semibold text-gray-600"
                >
                  <FiCheck className="text-green-500" /> {text.length}/5000
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            onClick={handlePaste}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30"
          >
            <FiClipboard size={20} /> Paste
          </motion.button>
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
          >
            <FiUpload size={20} /> Upload
          </motion.button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
          />
        </div>

        {/* Main Analyze Button */}
        <motion.button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold text-lg rounded-xl transition-all shadow-xl shadow-purple-500/40"
        >
          {loading ? (
            <motion.div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Analyzing...
            </motion.div>
          ) : (
            '✨ Analyze for Bias'
          )}
        </motion.button>

        {/* Info Text */}
        <p className="text-center text-gray-600 text-sm font-medium mt-4">
          Max 5000 characters • Analysis takes 3-5 seconds • 100% private
        </p>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t-2 border-gray-200"
            >
              <h3 className="font-bold text-gray-900 mb-3">Recent Analyses</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setAnalysisResult(item);
                      setText(item.originalText);
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                  >
                    <p className="text-sm font-bold text-gray-800">
                      {item.contentType} • Score: {item.overallBiasScore}
                    </p>
                    <p className="text-xs text-gray-600">{item.timestamp}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
