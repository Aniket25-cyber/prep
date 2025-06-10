import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import { Button } from '../common/Button';
import { useInterviewData } from '../../hooks/useInterviewData';

interface NewInterviewProps {
  onStartInterview: () => void;
}

export function NewInterview({ onStartInterview }: NewInterviewProps) {
  const { stats } = useInterviewData();

  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-r from-surface/80 to-surface/60 backdrop-blur-sm border border-onyx/50 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-jade rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <motion.div
              className="inline-flex items-center space-x-2 bg-jade/20 border border-jade/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Target className="h-4 w-4 text-jade" />
              <span className="text-jade text-sm font-medium">Ready to Practice?</span>
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-bold text-ghost mb-4">
              Start Your Next{' '}
              <span className="bg-gradient-to-r from-jade to-maya bg-clip-text text-transparent">
                Mock Interview
              </span>
            </h2>

            <p className="text-lg text-bluegray mb-8 leading-relaxed">
              Practice with our AI interviewer tailored to your specific role and company. 
              Get instant feedback and improve your interview skills.
            </p>

            <Button
              onClick={onStartInterview}
              size="lg"
              icon={Play}
              className="text-lg"
            >
              Start New Interview
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Calendar,
                title: 'This Week',
                value: stats.thisWeekInterviews.toString(),
                subtitle: 'Interviews',
                color: 'from-jade to-maya',
              },
              {
                icon: Clock,
                title: 'Total Time',
                value: `${stats.totalTime}h`,
                subtitle: 'Practiced',
                color: 'from-maya to-lemon',
              },
              {
                icon: TrendingUp,
                title: 'Avg Score',
                value: `${stats.averageScore}%`,
                subtitle: 'Performance',
                color: 'from-lemon to-jade',
              },
              {
                icon: Target,
                title: 'Goal',
                value: '90%',
                subtitle: 'Target Score',
                color: 'from-jade to-salmon',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-background/50 backdrop-blur-sm border border-onyx/50 rounded-2xl p-6 hover:border-jade/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-ghost" />
                </div>
                <div className="text-2xl font-bold text-ghost mb-1">{stat.value}</div>
                <div className="text-sm text-jade font-medium mb-1">{stat.title}</div>
                <div className="text-xs text-bluegray">{stat.subtitle}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}