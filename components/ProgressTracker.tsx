import React from 'react';
import { FormStep } from '@/types/form';

interface ProgressTrackerProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  completedSteps,
}) => {
  const steps = [
    {
      step: 1,
      title: 'Aadhaar Verification',
      titleHindi: 'आधार सत्यापन',
      description: 'Aadhaar + OTP validation',
    },
    {
      step: 2,
      title: 'PAN Validation',
      titleHindi: 'पैन सत्यापन',
      description: 'Business details',
    },
  ];

  const getStepStatus = (stepNumber: FormStep) => {
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (currentStep === stepNumber) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const status = getStepStatus(step.step as FormStep);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.step}>
              {/* Step Circle and Content */}
              <div className="flex flex-col items-center relative z-10 bg-white px-4">
                <div className={`progress-step ${status} mb-2 sm:mb-3`}>
                  {status === 'completed' ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{step.step}</span>
                  )}
                </div>

                <div className="text-center">
                  <div
                    className={`text-xs sm:text-sm font-medium ${
                      status === 'active'
                        ? 'text-udyam-blue'
                        : status === 'completed'
                        ? 'text-udyam-green'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`text-xs hindi-text ${
                      status === 'active'
                        ? 'text-udyam-blue'
                        : status === 'completed'
                        ? 'text-udyam-green'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.titleHindi}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Progress Line */}
              {!isLast && (
                <div
                  className={`progress-line ${
                    completedSteps.includes(step.step as FormStep)
                      ? 'completed'
                      : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
