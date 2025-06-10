import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-jade/10 via-maya/5 to-background"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-jade/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-jade/20 border border-jade/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-jade" />
              <span className="text-jade text-sm font-medium">AI-Powered Interview Practice</span>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-ghost mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Ace your next{' '}
              <span className="bg-gradient-to-r from-jade to-maya bg-clip-text text-transparent">
                interview
              </span>{' '}
              with Prepify
            </motion.h1>

            <motion.p
              className="text-xl text-bluegray mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Practice with AI-powered mock interviews that adapt to your role, 
              provide real-time feedback, and help you build confidence for the real thing.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                icon={Play}
                className="text-lg"
              >
                Get Started
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="text-lg"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: Zap, text: 'Real-time AI feedback' },
                { icon: Target, text: 'Role-specific practice' },
                { icon: Sparkles, text: 'Adaptive difficulty' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-bluegray">
                  <feature.icon className="h-5 w-5 text-jade" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* AI Avatar */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-jade/20 to-maya/20 rounded-full border border-jade/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              
              <motion.div
                className="absolute inset-4 bg-gradient-to-br from-surface to-background rounded-full border border-onyx/50 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-center">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-jade to-maya rounded-full mb-4 mx-auto flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-20 h-20 bg-ghost rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-jade rounded-full animate-pulse"></div>
                    </div>
                  </motion.div>
                  <p className="text-ghost font-semibold text-lg">AI Interviewer</p>
                  <p className="text-bluegray">Ready when you are</p>
                </div>
              </motion.div>

              {/* Floating elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-jade/50 rounded-full"
                  style={{
                    left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 120}px`,
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 120}px`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}