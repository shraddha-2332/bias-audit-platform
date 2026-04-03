import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Skeleton */}
      <motion.div 
        className="bg-gradient-to-br from-white from-5% via-purple-50 to-blue-50 backdrop-blur-xl border border-white border-opacity-40 rounded-3xl p-10 mb-8 shadow-2xl shadow-purple-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-300 rounded-2xl w-1/3"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
          </div>

          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </motion.div>

      {/* Charts Skeleton */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-white from-5% via-purple-50 to-blue-50 backdrop-blur-xl border border-white border-opacity-40 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded-lg w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white from-5% via-purple-50 to-blue-50 backdrop-blur-xl border border-white border-opacity-40 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded-lg w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </motion.div>

      {/* Details Skeleton */}
      <motion.div 
        className="bg-gradient-to-br from-white from-5% via-purple-50 to-blue-50 backdrop-blur-xl border border-white border-opacity-40 rounded-3xl p-10 shadow-2xl shadow-purple-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-300 rounded-lg w-1/3 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
