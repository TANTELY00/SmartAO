import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple, FaMicrosoft } from "react-icons/fa";
import { motion } from "framer-motion";
import logos from '/src/assets/logo.png';

const LoginPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const password = e.target.password.value;
    
    const userData = {
      name: "Utilisateur",
      email: email,
      avatar: "US",
      provider: "email"
    };
    
    setTimeout(() => {
      onLogin(userData);
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    const userData = {
      name: `User ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
      avatar: provider.charAt(0),
      provider: provider
    };
    
    setTimeout(() => {
      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative w-full max-w-sm mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
          {/* Header avec logo IFB */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="flex justify-center mb-4">
              <img 
                src={logos} 
                alt="IFB" 
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Content de vous revoir
            </h1>
            <p className="text-white/60 text-sm">
              Connectez-vous à votre compte
            </p>
          </motion.div>

          {/* Formulaire Email */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Adresse email
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                placeholder="Entrez votre mot de passe"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-white/60">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 bg-white/5 border-white/10 rounded focus:ring-cyan-500 text-cyan-500"
                />
                <span className="ml-2">Se souvenir de moi</span>
              </label>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Mot de passe oublié ?
              </motion.a>
            </div>

            {/* Bouton de connexion principal */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden text-sm"
            >
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion...
                </motion.div>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Se connecter
                </motion.span>
              )}
              
              {/* Effet brillant */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>
          </motion.form>

          {/* Section connexion sociale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/40 text-xs">
                  OU CONTINUER AVEC
                </span>
              </div>
            </div>

            {/* Boutons de connexion sociale - Style logo */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { provider: "Google", icon: FcGoogle, color: "hover:bg-white/10" },
                { provider: "GitHub", icon: FaGithub, color: "hover:bg-white/10" },
                { provider: "Apple", icon: FaApple, color: "hover:bg-white/10" },
                { provider: "Microsoft", icon: FaMicrosoft, color: "hover:bg-white/10" },
              ].map((social, index) => (
                <motion.button
                  key={social.provider}
                  type="button"
                  onClick={() => handleSocialLogin(social.provider)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 transition-all duration-300 ${social.color} group relative overflow-hidden`}
                >
                  <social.icon className="w-4 h-4 mx-auto" />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {social.provider}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Pied de page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-white/40 text-xs">
              Pas de compte ?{" "}
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                S'inscrire
              </motion.a>
            </p>
          </motion.div>
        </div>

        {/* Éléments flottants */}
        <motion.div
          className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-400 rounded-full blur-sm opacity-60"
          animate={{
            y: [0, -8, 0],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-3 -left-3 w-5 h-5 bg-purple-400 rounded-full blur-sm opacity-60"
          animate={{
            y: [0, 8, 0],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoginPage;