'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import FileUpload from '@/components/FileUpload';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <motion.main
        className="flex-1 p-4 md:p-8 ml-0 md:ml-[200px] transition-all duration-300"
        style={{ filter: isSidebarOpen ? 'none' : 'none' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-0 bg-grid-small-cyan-500/20" />
          </div>

          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            File Share 
          </motion.h1>
          
          <div className="relative z-10">
            <FileUpload />
          </div>
        </motion.div>
      </motion.main>

    </div>
  );
}