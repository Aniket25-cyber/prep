import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Examples } from '../components/landing/Examples';

interface LandingProps {
  onNavigate: (page: string) => void;
  onGetStarted: () => void;
}

export function Landing({ onNavigate, onGetStarted }: LandingProps) {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header currentPage="home" onNavigate={onNavigate} />
      <main>
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <Examples />
      </main>
      <Footer />
    </motion.div>
  );
}