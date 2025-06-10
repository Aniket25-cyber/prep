import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Menu, X, LogOut, Home, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  currentPage?: 'home' | 'dashboard';
  onNavigate?: (page: string) => void;
}

export function Header({ currentPage = 'home', onNavigate }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate?.('home');
  };

  return (
    <>
      <motion.header 
        className="bg-surface/80 backdrop-blur-md border-b border-onyx/50 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onNavigate?.('home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Bot className="h-8 w-8 text-jade" />
                <motion.div
                  className="absolute inset-0 bg-jade/20 rounded-full blur-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold text-ghost">Prepify</span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <motion.button
                onClick={() => onNavigate?.('home')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === 'home'
                    ? 'bg-jade/20 text-jade border border-jade/30'
                    : 'text-bluegray hover:text-ghost hover:bg-surface/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </motion.button>

              {user && (
                <motion.button
                  onClick={() => onNavigate?.('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === 'dashboard'
                      ? 'bg-jade/20 text-jade border border-jade/30'
                      : 'text-bluegray hover:text-ghost hover:bg-surface/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </motion.button>
              )}

              {user ? (
                <motion.button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-6 py-2 bg-salmon/20 text-salmon border border-salmon/30 rounded-lg hover:bg-salmon/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2 bg-gradient-to-r from-jade to-maya text-ghost font-semibold rounded-lg hover:shadow-lg hover:shadow-jade/25 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-ghost hover:text-jade transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-onyx/50 py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    onNavigate?.('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentPage === 'home'
                      ? 'bg-jade/20 text-jade'
                      : 'text-bluegray hover:text-ghost'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>

                {user && (
                  <button
                    onClick={() => {
                      onNavigate?.('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      currentPage === 'dashboard'
                        ? 'bg-jade/20 text-jade'
                        : 'text-bluegray hover:text-ghost'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                )}

                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-salmon hover:bg-salmon/20 rounded-lg transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-jade to-maya text-ghost font-semibold rounded-lg"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          onNavigate?.('dashboard');
        }}
      />
    </>
  );
}