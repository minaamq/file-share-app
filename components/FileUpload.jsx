'use client';
import { useState, useEffect } from 'react';
import { FiUploadCloud, FiDownload, FiCheckCircle, FiCopy } from 'react-icons/fi';
import { motion } from 'framer-motion';
  export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [downloadLink, setDownloadLink] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
  
    // Keep existing handlers the same, add animations where needed

  const handleUpload = async () => {
    if (!file) return;
  
    setIsLoading(true);
    setError(null);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    });

    xhr.open('POST', '/api/upload');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        setDownloadLink(response.url);
      } else {
        setError(xhr.statusText || 'Failed to upload file');
      }
      setIsLoading(false);
    };

    xhr.onerror = () => {
      setError('Network error');
      setIsLoading(false);
    };

    xhr.send(formData);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(downloadLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy link');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setDownloadLink(null);
    }
  };
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-cyan-900/90 rounded-2xl p-4 md:p-8 text-center shadow-2xl transition-all duration-300 mx-4 md:mx-0 ${
          isDragging ? 'border-2 border-cyan-400 shadow-glow' : 'border-2 border-cyan-400/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-6 relative">
        <motion.div
      className="bg-gray-900/60 backdrop-blur-sm rounded-xl border-2 border-cyan-400/20 
               p-6 shadow-neon transition-all duration-300"
    >
               <FiUploadCloud
            className={`text-4xl mx-auto transition-all duration-300 ${
              isLoading ? 'text-cyan-400 animate-bounce' : 'text-cyan-400/80'
            } ${isDragging ? 'animate-pulse scale-110' : ''}`}
          />
    </motion.div>

        </div>
  
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setDownloadLink(null);
          }}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
  
        <motion.label
          htmlFor="file-upload"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-block px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm md:text-base ${
            isLoading
              ? 'bg-cyan-900/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500/40 to-purple-500/40 hover:from-cyan-400/60 hover:to-purple-400/60 cursor-pointer'
          } border-2 border-cyan-400/40 hover:border-cyan-300/60 shadow-lg`}
        >
          {file ? (
            <span className="font-mono text-cyan-300">{file.name}</span>
          ) : (
            <span className="text-cyan-100">CHOOSE FILE</span>
          )}
        </motion.label>
  
        {!file && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-cyan-300/80 text-xs md:text-sm font-mono"
          >
            DRAG AND DROP OR CLICK TO UPLOAD
          </motion.p>
        )}
  
        {file && !isLoading && (
          <motion.button
            onClick={handleUpload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 hover:from-cyan-400/60 hover:to-purple-400/60 rounded-xl font-medium transition-all duration-300 border-2 border-cyan-400/40 hover:border-cyan-300/60 shadow-lg"
          >
            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              INITIATE UPLOAD
            </span>
          </motion.button>
        )}
  
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-4"
          >
            <div className="w-full bg-cyan-900/30 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-3 rounded-full transition-all duration-300 shadow-glow"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-cyan-300 font-mono">
              UPLOADING... {progress}%
            </p>
          </motion.div>
        )}
  
        {downloadLink && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mt-6 p-4 bg-cyan-900/20 rounded-lg border-2 border-cyan-400/30"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400">
              <FiCheckCircle className="text-xl animate-pulse" />
              <span className="font-medium font-mono">UPLOAD COMPLETE</span>
            </div>
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-cyan-300 break-all text-xs md:text-sm font-mono">
                {downloadLink}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleCopyLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 hover:from-cyan-400/60 hover:to-purple-400/60 rounded-lg font-medium transition-all duration-300 border-2 border-cyan-400/40 hover:border-cyan-300/60 flex items-center justify-center gap-2"
              >
                {isCopied ? (
                  <FiCheckCircle className="text-lg animate-pulse text-cyan-300" />
                ) : (
                  <FiCopy className="text-lg text-cyan-300" />
                )}
                <span className="text-cyan-300 text-sm font-mono">
                  {isCopied ? 'COPIED!' : 'COPY LINK'}
                </span>
              </motion.button>
              <motion.a
                href={downloadLink}
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 hover:from-cyan-400/60 hover:to-purple-400/60 rounded-lg font-medium transition-all duration-300 border-2 border-cyan-400/40 hover:border-cyan-300/60 flex items-center justify-center gap-2"
              >
                <FiDownload className="text-lg text-cyan-300" />
                <span className="text-cyan-300 text-sm font-mono">DOWNLOAD</span>
              </motion.a>
            </div>
          </motion.div>
        )}
  
        {error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 px-4 py-2 bg-red-900/30 text-red-400 rounded-lg border-2 border-red-400/30 animate-shake font-mono text-sm"
          >
            {error}
          </motion.div>
        )}
  

      </motion.div>
    );
  }