import React, { useState, useEffect } from 'react';
import { Step1FormData, FormErrors } from '@/types/form';
import {
  validateField,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  formatAadhaarNumber,
  cleanNumericInput,
  generateOTP,
} from '@/utils/validation';

interface Step1FormProps {
  data: Step1FormData;
  errors: FormErrors;
  onDataChange: (data: Partial<Step1FormData>) => void;
  onNext: () => void;
  onValidateField: (field: string, value: any) => void;
}

const Step1Form: React.FC<Step1FormProps> = ({
  data,
  errors,
  onDataChange,
  onNext,
  onValidateField,
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isValidatingAadhaar, setIsValidatingAadhaar] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = cleanNumericInput(e.target.value);
    if (value.length <= 12) {
      onDataChange({ aadhaarNumber: value });
      onValidateField('aadhaarNumber', value);

      // Reset OTP state when Aadhaar changes
      if (otpSent) {
        setOtpSent(false);
        setGeneratedOtp('');
        onDataChange({ otp: '' });
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onDataChange({ entrepreneurName: value });
    onValidateField('entrepreneurName', value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = cleanNumericInput(e.target.value);
    if (value.length <= 6) {
      onDataChange({ otp: value });
      onValidateField('otp', value);
    }
  };

  const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    onDataChange({ declaration: value });
    onValidateField('declaration', value);
  };

  const handleValidateAadhaar = async () => {
    // Validate Aadhaar before sending OTP
    const aadhaarError = validateField('aadhaarNumber', data.aadhaarNumber, {
      required: true,
      pattern: VALIDATION_PATTERNS.AADHAAR,
      message: VALIDATION_MESSAGES.AADHAAR_INVALID,
    });

    if (aadhaarError) {
      onValidateField('aadhaarNumber', data.aadhaarNumber);
      return;
    }

    setIsValidatingAadhaar(true);

    try {
      // Simulate API call to validate Aadhaar and send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate OTP for demo
      const otp = generateOTP();
      setGeneratedOtp(otp);
      setOtpSent(true);
      setOtpTimer(60); // 60 seconds timer

      // Auto-fill name (in real scenario, this would come from Aadhaar API)
      if (!data.entrepreneurName) {
        onDataChange({ entrepreneurName: 'Sample Name from Aadhaar' });
      }

      console.log('Demo OTP:', otp); // For testing purposes
      alert(`Demo OTP sent: ${otp}`); // For testing purposes
    } catch (error) {
      console.error('Error validating Aadhaar:', error);
      alert('Error validating Aadhaar. Please try again.');
    } finally {
      setIsValidatingAadhaar(false);
    }
  };

  const handleResendOtp = () => {
    if (otpTimer === 0) {
      const otp = generateOTP();
      setGeneratedOtp(otp);
      setOtpTimer(60);
      console.log('Demo OTP resent:', otp);
      alert(`Demo OTP resent: ${otp}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const requiredFields = [
      'aadhaarNumber',
      'entrepreneurName',
      'otp',
      'declaration',
    ];
    let hasErrors = false;

    requiredFields.forEach((field) => {
      let validation;
      switch (field) {
        case 'aadhaarNumber':
          validation = {
            required: true,
            pattern: VALIDATION_PATTERNS.AADHAAR,
            message: VALIDATION_MESSAGES.AADHAAR_INVALID,
          };
          break;
        case 'entrepreneurName':
          validation = {
            required: true,
            minLength: 2,
            maxLength: 100,
            message: 'Please enter a valid name (2-100 characters)',
          };
          break;
        case 'otp':
          validation = {
            required: true,
            pattern: /^\d{6}$/,
            message: 'Please enter a valid 6-digit OTP',
          };
          break;
        case 'declaration':
          validation = {
            required: true,
            message: 'Please accept the declaration',
          };
          break;
        default:
          validation = { required: true, message: 'This field is required' };
      }

      const error = validateField(
        field,
        data[field as keyof Step1FormData],
        validation
      );
      if (error) {
        onValidateField(field, data[field as keyof Step1FormData]);
        hasErrors = true;
      }
    });

    // Validate OTP matches
    if (data.otp && generatedOtp && data.otp !== generatedOtp) {
      onValidateField('otp', data.otp);
      alert('Invalid OTP. Please check and try again.');
      hasErrors = true;
    }

    if (!hasErrors) {
      onNext();
    }
  };

  const isFormValid = () => {
    return (
      data.aadhaarNumber &&
      data.entrepreneurName &&
      data.otp &&
      data.declaration &&
      !Object.values(errors).some((error) => error !== '')
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 1: Aadhaar Verification
          </h2>
          <p className="text-gray-600 hindi-text">चरण 1: आधार सत्यापन</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aadhaar Number */}
          <div>
            <label className="form-label">
              1. Aadhaar Number / आधार संख्या *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={formatAadhaarNumber(data.aadhaarNumber)}
                onChange={handleAadhaarChange}
                placeholder="Enter your 12-digit Aadhaar number"
                className={`form-input flex-1 ${
                  errors.aadhaarNumber ? 'border-red-500' : ''
                }`}
                disabled={otpSent}
              />
              <button
                type="button"
                onClick={handleValidateAadhaar}
                disabled={
                  !data.aadhaarNumber ||
                  errors.aadhaarNumber ||
                  isValidatingAadhaar ||
                  otpSent
                }
                className="btn-primary whitespace-nowrap"
              >
                {isValidatingAadhaar ? 'Validating...' : 'Validate & Send OTP'}
              </button>
            </div>
            {errors.aadhaarNumber && (
              <p className="form-error">{errors.aadhaarNumber}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="form-label">
              2. Name of Entrepreneur / उद्यमी का नाम *
            </label>
            <input
              type="text"
              value={data.entrepreneurName}
              onChange={handleNameChange}
              placeholder="Name as per Aadhaar"
              className={`form-input ${
                errors.entrepreneurName ? 'border-red-500' : ''
              }`}
              maxLength={100}
            />
            {errors.entrepreneurName && (
              <p className="form-error">{errors.entrepreneurName}</p>
            )}
          </div>

          {/* OTP Field */}
          {otpSent && (
            <div>
              <label className="form-label">
                3. Enter OTP / ओटीपी दर्ज करें *
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={data.otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  className={`form-input flex-1 ${
                    errors.otp ? 'border-red-500' : ''
                  }`}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpTimer > 0}
                  className="btn-secondary whitespace-nowrap text-sm"
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                </button>
              </div>
              {errors.otp && <p className="form-error">{errors.otp}</p>}
              <p className="text-sm text-gray-500 mt-1">
                OTP has been sent to your registered mobile number
              </p>
            </div>
          )}

          {/* Declaration */}
          <div>
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={data.declaration}
                onChange={handleDeclarationChange}
                className="mt-1 h-4 w-4 text-udyam-blue focus:ring-udyam-blue border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                I hereby declare that the information provided above is correct
                and complete to the best of my knowledge and belief.
                <br />
                <span className="hindi-text text-gray-600">
                  मैं घोषणा करता/करती हूं कि ऊपर दी गई जानकारी मेरी जानकारी और
                  विश्वास के अनुसार सही और पूर्ण है।
                </span>
              </span>
            </label>
            {errors.declaration && (
              <p className="form-error ml-7">{errors.declaration}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className="btn-primary min-w-[120px]"
            >
              Next Step →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1Form;
