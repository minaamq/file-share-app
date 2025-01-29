import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiUser, FiUploadCloud } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

export default function Sidebar({ isOpen, toggle }) {
  const [name, setName] = useState('GUEST_USER');
  const [isHovered, setIsHovered] = useState(false);
  const [signoutProgress, setSignoutProgress] = useState(0);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error('Failed to fetch user name:', error);
        setName('Error fetching name');
      }
    };

    fetchName();
  }, []);

  const handleSignOut = async () => {
    try {
      // Start signout progress animation
      setSignoutProgress(0);
      const interval = setInterval(() => {
        setSignoutProgress(prev => Math.min(prev + 10, 100));
      }, 50);

      // Perform actual signout
      await signOut({ 
        callbackUrl: '/', 
        redirect: true 
      });

      clearInterval(interval);
    } catch (error) {
      console.error('Signout failed:', error);
      clearInterval(interval);
      setSignoutProgress(0);
    }
  };

  const sidebarVariants = {
    open: { 
      width: 240,
      skewX: isOpen ? [-2, 0] : 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    closed: { 
      width: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  
  return (
    <div className="relative">
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-6 left-6 z-10 text-cyan-400 hover:text-cyan-300 p-2 rounded-full 
                 backdrop-blur-sm border-2 border-cyan-400/40 transition-all duration-300 
                 bg-gray-900/80 shadow-neon"
      >
        {isOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </motion.button>

      <motion.aside
        animate={{ width: isOpen ? 200 : 0 }}
        className="bg-gray-900/80 h-screen overflow-hidden border-r-2 border-cyan-400/20 
                 backdrop-blur-lg shadow-2xl"
      >
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 h-full flex flex-col"
          >
            <div className="mb-8 flex items-center gap-3 mt-20">
              <FiUser className="text-cyan-400 text-xl" />
              <span className=" text-cyan-300 font-mono text-sm truncate">{name}</span>
            </div>

            <nav className="space-y-4">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-cyan-300/80 hover:text-cyan-400 
                         cursor-pointer transition-all"
              >
                <FiUploadCloud className="text-lg" />
                <span className="font-mono text-sm">UPLOADS</span>
              </motion.div>
            </nav>

            <motion.button
              onClick={handleSignOut}
              className="mt-auto mb-6 px-4 py-2 bg-cyan-900/30 hover:bg-cyan-800/40 
                       rounded-lg border-2 border-cyan-400/30 hover:border-cyan-300/40
                       flex items-center gap-2 group transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <FiLogOut className="text-cyan-400 group-hover:text-cyan-300" />
              <span className="font-mono text-sm text-cyan-300">LOGOUT</span>
            </motion.button>
          </motion.div>
        )}
      </motion.aside>
    </div>
  );
}
