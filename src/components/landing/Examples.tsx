import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, User, MessageSquare, BarChart3 } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: 'Setup Your Interview',
    description: 'Choose your role, company, and interview type. Upload your resume and job description for personalized questions.',
    icon: User,
    color: 'from-jade to-maya',
  },
  {
    step: 2,
    title: 'Practice with AI',
    description: 'Engage in a realistic interview with our AI interviewer. Answer questions via video and receive real-time feedback.',
    icon: MessageSquare,
    color: 'from-maya to-lemon',
  },
  {
    step: 3,
    title: 'Review & Improve',
    description: 'Get detailed performance analytics, scores, and actionable feedback to improve for your next interview.',
    icon: BarChart3,
    color: 'from-lemon to-jade',
  },
];

export function Examples() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-jade/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-maya/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-maya/20 border border-maya/30 rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Play className="h-4 w-4 text-maya" />
            <span className="text-maya text-sm font-medium">How It Works</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-ghost mb-6">
            Your path to{' '}
            <span className="bg-gradient-to-r from-maya to-jade bg-clip-text text-transparent">
              interview success
            </span>
          </h2>
          <p className="text-xl text-bluegray max-w-3xl mx-auto">
            Follow our simple three-step process to transform your interview skills 
            and boost your confidence.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <motion.div
                    className="flex items-center space-x-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl text-ghost font-bold text-lg`}>
                      {step.step}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-ghost">
                      {step.title}
                    </h3>
                  </motion.div>

                  <motion.p
                    className="text-lg text-bluegray leading-relaxed mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                  >
                    {step.description}
                  </motion.p>

                  {/* Arrow (except for last step) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="flex items-center space-x-2 text-jade"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      <span className="text-sm font-medium">Next Step</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>

                {/* Visual */}
                <motion.div
                  className={`flex justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                >
                  <div className="relative">
                    <motion.div
                      className={`w-64 h-64 bg-gradient-to-br ${step.color} rounded-3xl p-8 flex items-center justify-center relative overflow-hidden`}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full"
                            style={{
                              left: `${(i % 4) * 25 + 10}%`,
                              top: `${Math.floor(i / 4) * 25 + 10}%`,
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>

                      {/* Icon */}
                      <motion.div
                        className="relative z-10"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <step.icon className="h-24 w-24 text-ghost" />
                      </motion.div>
                    </motion.div>

                    {/* Floating elements */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-jade/50 rounded-full"
                        style={{
                          left: `${20 + Math.cos(i * 120 * Math.PI / 180) * 100}px`,
                          top: `${20 + Math.sin(i * 120 * Math.PI / 180) * 100}px`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center space-x-4 bg-surface/50 backdrop-blur-sm border border-onyx/50 rounded-2xl p-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold text-ghost mb-2">Ready to start?</h3>
              <p className="text-bluegray">Join thousands of successful candidates</p>
            </div>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-jade to-maya text-ghost font-semibold rounded-xl hover:shadow-lg hover:shadow-jade/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}