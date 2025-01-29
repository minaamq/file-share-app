"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FiUser, FiLock, FiArrowRight, FiMail, FiAlertCircle } from "react-icons/fi";


export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [displayText, setDisplayText] = useState(isLogin ? "Welcome Back" : "Create Account");
  const [currentText, setCurrentText] = useState(isLogin ? "Welcome Back" : "Create Account");
  const [error, setError] = useState("");
  const router = useRouter();
  const indexRef = useRef(0);

  // Typewriter effect
  // useEffect(() => {
  //   indexRef.current = 0;
  //   setDisplayText("");

  //   const interval = setInterval(() => {
  //     if (indexRef.current < currentText.length) {
  //       setDisplayText((prev) => prev + currentText.charAt(indexRef.current));
  //       indexRef.current++;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [currentText]);

  useEffect(() => {
    setDisplayText(isLogin ? "Welcome Back" : "Create Account");
    setError(""); // Clear errors when switching forms
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (isLogin) {
      try {
        const res = await signIn("credentials", {
          email: formData.email, 
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid Credentials");
          return;
        }
        const usernamer = await fetch('api/user', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email: formData.email})
        });
        await usernamer.json();
        router.replace("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        setError("An error occurred. Please try again.");
      }
    } else {
   
    try {
      const resUserExists = await fetch('api/userExists', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: formData.email})
      });
      
      const { user } = await resUserExists.json();
     
      if (user) {
        console.log(formData.email)
        console.log("User exists:", user);
        setError("User already exists.");
        return;
      }
       const res= await fetch('api/register',{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name:formData.name,
                email:formData.email,
                password:formData.password,
            })
        });


        if(res.ok){
            const form =e.target;
            const usernamer = await fetch('api/user', {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({email: formData.email})
            });
            await usernamer.json();
            form.reset();
            router.push("/")
        }else{
            console.log("User registration failed.");
        }
    } catch (error) {
        console.log("Error during registration: ", error)
    }
    }}

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 animate-pulse"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl w-full max-w-md space-y-6 relative z-10 p-8 shadow-2xl shadow-purple-500/10"
      >
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          <AnimatePresence mode="wait">
            <motion.span
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {displayText}
              <span className="ml-1 animate-blink">|</span>
            </motion.span>
          </AnimatePresence>
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center bg-red-900/50 border border-red-800 text-red-400 px-4 py-2 rounded-lg"
          >
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 mb-2 focus-within:border-purple-400 transition-colors">
                    <FiUser className="text-purple-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required={!isLogin}
                      className="w-full bg-transparent text-white outline-none placeholder-gray-400"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key="username-field"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus-within:border-blue-400 transition-colors">
                <FiMail className="text-blue-400 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full bg-transparent text-white outline-none placeholder-gray-400"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </motion.div>

            <motion.div
              key="password-field"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus-within:border-purple-400 transition-colors">
                <FiLock className="text-purple-400 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full bg-transparent text-white outline-none placeholder-gray-400"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg transition-all flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            {isLogin ? "Login" : "Sign Up"}
            <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-400"
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            {isLogin ? "Sign Up" : "Login"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
