import React from 'react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer 
      className="bg-surface/50 border-t border-onyx/50 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-bluegray">
            © 2025 - Prepify (Built with{' '}
            <motion.span 
              className="text-jade hover:text-maya transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              bolt.new
            </motion.span>
            )
          </p>
        </div>
      </div>
    </motion.footer>
  );
}