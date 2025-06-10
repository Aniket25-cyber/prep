import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Mic, 
  BarChart3, 
  Clock, 
  Target, 
  Zap,
  Video,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Interviews',
    description: 'Practice with intelligent AI interviewers that adapt to your responses and provide realistic interview scenarios.',
    color: 'from-jade to-maya',
  },
  {
    icon: Video,
    title: 'Video & Voice Practice',
    description: 'Full video interviews with voice recognition to practice your communication skills and body language.',
    color: 'from-maya to-jade',
  },
  {
    icon: Target,
    title: 'Role-Specific Questions',
    description: 'Tailored questions based on your target role, company, and industry for relevant practice.',
    color: 'from-jade to-lemon',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Detailed feedback and scoring on your answers, communication skills, and overall performance.',
    color: 'from-lemon to-maya',
  },
  {
    icon: Clock,
    title: 'Flexible Duration',
    description: 'Choose interview lengths from quick 15-minute sessions to full 2-hour comprehensive interviews.',
    color: 'from-maya to-salmon',
  },
  {
    icon: FileText,
    title: 'Resume Integration',
    description: 'Upload your resume and job descriptions for personalized questions and targeted practice.',
    color: 'from-salmon to-jade',
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-jade/20 border border-jade/30 rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="h-4 w-4 text-jade" />
            <span className="text-jade text-sm font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-ghost mb-6">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-jade to-maya bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
          <p className="text-xl text-bluegray max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need 
            to prepare for any interview scenario.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative bg-surface/50 backdrop-blur-sm border border-onyx/50 rounded-2xl p-8 h-full hover:border-jade/30 transition-all duration-500 group-hover:transform group-hover:scale-105">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 relative`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <feature.icon className="h-8 w-8 text-ghost" />
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-ghost mb-4 group-hover:text-jade transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-bluegray leading-relaxed group-hover:text-ghost/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-jade to-maya rounded-b-2xl origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { number: '10K+', label: 'Interviews Conducted', icon: Award },
            { number: '95%', label: 'Success Rate', icon: TrendingUp },
            { number: '50+', label: 'Companies Covered', icon: Target },
            { number: '24/7', label: 'Available Practice', icon: Clock },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-jade/20 rounded-xl mb-4 group-hover:bg-jade/30 transition-colors">
                <stat.icon className="h-6 w-6 text-jade" />
              </div>
              <div className="text-3xl font-bold text-ghost mb-2">{stat.number}</div>
              <div className="text-bluegray">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}