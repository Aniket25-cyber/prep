import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Upload, 
  FileText, 
  User, 
  Building, 
  Clock, 
  Target,
  Zap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { InterviewSetup } from '../../types';

interface InterviewFormProps {
  onSubmit: (data: InterviewSetup) => void;
  onBack: () => void;
}

export function InterviewForm({ onSubmit, onBack }: InterviewFormProps) {
  const [resumeType, setResumeType] = useState<'file' | 'text'>('text');
  const [jobDescType, setJobDescType] = useState<'file' | 'text'>('text');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<InterviewSetup>();

  const watchedValues = watch();

  const handleFormSubmit = (data: InterviewSetup) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center space-x-2 bg-jade/20 border border-jade/30 rounded-full px-4 py-2 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Zap className="h-4 w-4 text-jade" />
          <span className="text-jade text-sm font-medium">Interview Setup</span>
        </motion.div>

        <h1 className="text-3xl lg:text-4xl font-bold text-ghost mb-4">
          Customize Your{' '}
          <span className="bg-gradient-to-r from-jade to-maya bg-clip-text text-transparent">
            Mock Interview
          </span>
        </h1>
        <p className="text-lg text-bluegray max-w-2xl mx-auto">
          Provide details about your target role to get the most relevant interview experience
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-surface/50 backdrop-blur-sm border border-onyx/50 rounded-3xl p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-ghost flex items-center space-x-2">
                <User className="h-5 w-5 text-jade" />
                <span>Basic Information</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-ghost mb-2">
                  Position/Role *
                </label>
                <input
                  {...register('position', { required: 'Position is required' })}
                  className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost placeholder-bluegray focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
                  placeholder="e.g., Senior Software Engineer"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-salmon flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.position.message}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ghost mb-2">
                  Company *
                </label>
                <input
                  {...register('company', { required: 'Company is required' })}
                  className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost placeholder-bluegray focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
                  placeholder="e.g., Google"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-salmon flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.company.message}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ghost mb-2">
                    Difficulty *
                  </label>
                  <select
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
                  >
                    <option value="">Select...</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <p className="mt-1 text-sm text-salmon flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.difficulty.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ghost mb-2">
                    Interview Type *
                  </label>
                  <select
                    {...register('type', { required: 'Interview type is required' })}
                    className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
                  >
                    <option value="">Select...</option>
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="System Design">System Design</option>
                    <option value="HR">HR</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-salmon flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.type.message}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ghost mb-2">
                  Duration (minutes) *
                </label>
                <select
                  {...register('duration', { required: 'Duration is required' })}
                  className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
                >
                  <option value="">Select...</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
                {errors.duration && (
                  <p className="mt-1 text-sm text-salmon flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.duration.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-ghost flex items-center space-x-2">
                <FileText className="h-5 w-5 text-maya" />
                <span>Documents</span>
              </h3>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-ghost mb-2">
                  Job Description *
                </label>
                <div className="flex space-x-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setJobDescType('text')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      jobDescType === 'text'
                        ? 'bg-jade/20 text-jade border border-jade/30'
                        : 'bg-background text-bluegray border border-onyx'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setJobDescType('file')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      jobDescType === 'file'
                        ? 'bg-jade/20 text-jade border border-jade/30'
                        : 'bg-background text-bluegray border border-onyx'
                    }`}
                  >
                    Upload PDF
                  </button>
                </div>

                {jobDescType === 'text' ? (
                  <textarea
                    {...register('jobDescription', { required: 'Job description is required' })}
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost placeholder-bluegray focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all resize-none"
                    placeholder="Paste the job description here..."
                  />
                ) : (
                  <div className="border-2 border-dashed border-onyx/50 rounded-lg p-6 text-center hover:border-jade/50 transition-colors">
                    <Upload className="h-8 w-8 text-bluegray mx-auto mb-2" />
                    <p className="text-bluegray text-sm">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      {...register('jobDescription', { required: 'Job description is required' })}
                    />
                  </div>
                )}
                {errors.jobDescription && (
                  <p className="mt-1 text-sm text-salmon flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.jobDescription.message}</span>
                  </p>
                )}
              </div>

              {/* Resume */}
              <div>
                <label className="block text-sm font-medium text-ghost mb-2">
                  Resume *
                </label>
                <div className="flex space-x-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setResumeType('text')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      resumeType === 'text'
                        ? 'bg-maya/20 text-maya border border-maya/30'
                        : 'bg-background text-bluegray border border-onyx'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeType('file')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      resumeType === 'file'
                        ? 'bg-maya/20 text-maya border border-maya/30'
                        : 'bg-background text-bluegray border border-onyx'
                    }`}
                  >
                    Upload PDF
                  </button>
                </div>

                {resumeType === 'text' ? (
                  <textarea
                    {...register('resume', { required: 'Resume is required' })}
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost placeholder-bluegray focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all resize-none"
                    placeholder="Paste your resume content here..."
                  />
                ) : (
                  <div className="border-2 border-dashed border-onyx/50 rounded-lg p-6 text-center hover:border-maya/50 transition-colors">
                    <Upload className="h-8 w-8 text-bluegray mx-auto mb-2" />
                    <p className="text-bluegray text-sm">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      {...register('resume', { required: 'Resume is required' })}
                    />
                  </div>
                )}
                {errors.resume && (
                  <p className="mt-1 text-sm text-salmon flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.resume.message}</span>
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-ghost mb-2">
                  Additional Information
                </label>
                <textarea
                  {...register('additionalInfo')}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-onyx rounded-lg text-ghost placeholder-bluegray focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all resize-none"
                  placeholder="Any specific areas you'd like to focus on or additional context..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {watchedValues.position && watchedValues.company && (
          <motion.div
            className="bg-jade/10 border border-jade/30 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-ghost mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-jade" />
              <span>Interview Preview</span>
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-bluegray">Position:</span>
                <p className="text-ghost font-medium">{watchedValues.position}</p>
              </div>
              <div>
                <span className="text-bluegray">Company:</span>
                <p className="text-ghost font-medium">{watchedValues.company}</p>
              </div>
              <div>
                <span className="text-bluegray">Type:</span>
                <p className="text-ghost font-medium">{watchedValues.type || 'Not selected'}</p>
              </div>
              <div>
                <span className="text-bluegray">Duration:</span>
                <p className="text-ghost font-medium">
                  {watchedValues.duration ? `${watchedValues.duration} min` : 'Not selected'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            onClick={onBack}
            variant="ghost"
            size="lg"
          >
            Back to Dashboard
          </Button>

          <Button
            type="submit"
            size="lg"
            icon={ArrowRight}
            className="sm:ml-auto"
          >
            Start Interview
          </Button>
        </div>
      </motion.form>
    </div>
  );
}