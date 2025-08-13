import React, { useState } from 'react';
import Head from 'next/head';
import {
  Step1FormData,
  Step2FormData,
  FormErrors,
  FormStep,
} from '@/types/form';
import { validateField } from '@/utils/validation';
import ProgressTracker from '@/components/ProgressTracker';
import Step1Form from '@/components/Step1Form';
import Step2Form from '@/components/Step2Form';
import SuccessModal from '@/components/SuccessModal';

const UdyamRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  // Form data state
  const [step1Data, setStep1Data] = useState<Step1FormData>({
    aadhaarNumber: '',
    entrepreneurName: '',
    otp: '',
    declaration: false,
  });

  const [step2Data, setStep2Data] = useState<Step2FormData>({
    panNumber: '',
    businessName: '',
    businessType: '',
    address: '',
    pinCode: '',
    city: '',
    state: '',
    mobileNumber: '',
    emailId: '',
    bankAccountNumber: '',
    ifscCode: '',
    dateOfCommencement: '',
  });

  // Form errors state
  const [step1Errors, setStep1Errors] = useState<FormErrors>({});
  const [step2Errors, setStep2Errors] = useState<FormErrors>({});

  const handleStep1DataChange = (data: Partial<Step1FormData>) => {
    setStep1Data((prev) => ({ ...prev, ...data }));
  };

  const handleStep2DataChange = (data: Partial<Step2FormData>) => {
    setStep2Data((prev) => ({ ...prev, ...data }));
  };

  const handleStep1FieldValidation = (field: string, value: any) => {
    let validation;
    switch (field) {
      case 'aadhaarNumber':
        validation = {
          required: true,
          pattern: /^\d{12}$/,
          message: 'Please enter a valid 12-digit Aadhaar number',
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

    const error = validateField(field, value, validation);
    setStep1Errors((prev) => ({ ...prev, [field]: error }));
  };

  const handleStep2FieldValidation = (field: string, value: any) => {
    let validation;
    switch (field) {
      case 'panNumber':
        validation = {
          required: true,
          pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          message: 'Please enter a valid PAN number (e.g., ABCDE1234F)',
        };
        break;
      case 'businessName':
        validation = {
          required: true,
          minLength: 2,
          maxLength: 100,
          message: 'Please enter a valid business name (2-100 characters)',
        };
        break;
      case 'businessType':
        validation = {
          required: true,
          message: 'Please select a business type',
        };
        break;
      case 'address':
        validation = {
          required: true,
          minLength: 10,
          maxLength: 200,
          message: 'Please enter a valid address (10-200 characters)',
        };
        break;
      case 'pinCode':
        validation = {
          required: true,
          pattern: /^\d{6}$/,
          message: 'Please enter a valid 6-digit PIN code',
        };
        break;
      case 'city':
        validation = {
          required: true,
          message: 'Please enter city name',
        };
        break;
      case 'state':
        validation = {
          required: true,
          message: 'Please select state',
        };
        break;
      case 'mobileNumber':
        validation = {
          required: true,
          pattern: /^[6-9]\d{9}$/,
          message: 'Please enter a valid 10-digit mobile number',
        };
        break;
      case 'emailId':
        validation = {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Please enter a valid email address',
        };
        break;
      case 'bankAccountNumber':
        validation = {
          required: true,
          pattern: /^\d{9,18}$/,
          message: 'Please enter a valid bank account number (9-18 digits)',
        };
        break;
      case 'ifscCode':
        validation = {
          required: true,
          pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
          message: 'Please enter a valid IFSC code',
        };
        break;
      case 'dateOfCommencement':
        validation = {
          required: true,
          message: 'Please select date of commencement',
        };
        break;
      default:
        validation = { required: true, message: 'This field is required' };
    }

    const error = validateField(field, value, validation);
    setStep2Errors((prev) => ({ ...prev, [field]: error }));
  };

  const handleStep1Next = () => {
    setCompletedSteps((prev) => [...prev, 1]);
    setCurrentStep(2);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep2Submit = async () => {
    try {
      const response = await fetch('/api/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step1Data,
          step2Data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Mark step 2 as completed
        setCompletedSteps((prev) => [...prev, 2]);

        // Set registration ID and show success modal
        setRegistrationId(result.registrationId);
        setShowSuccessModal(true);

        console.log('Registration Data:', {
          registrationId: result.registrationId,
          step1Data,
          step2Data,
        });
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, error]) => {
            if (field in step1Data) {
              handleStep1FieldValidation(
                field,
                step1Data[field as keyof Step1FormData]
              );
            } else if (field in step2Data) {
              handleStep2FieldValidation(
                field,
                step2Data[field as keyof Step2FormData]
              );
            }
          });
        }
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Udyam Registration Form - Government of India</title>
        <meta
          name="description"
          content="Official Udyam Registration Form for Micro, Small and Medium Enterprises"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-udyam-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Udyam Registration
                  </h1>
                  <p className="text-sm text-gray-600 hindi-text">
                    उद्यम पंजीकरण
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-600">Government of India</p>
                <p className="text-xs text-gray-500 hindi-text">भारत सरकार</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Tracker */}
          <ProgressTracker
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          {/* Form Content */}
          <div className="mt-8">
            {currentStep === 1 && (
              <Step1Form
                data={step1Data}
                errors={step1Errors}
                onDataChange={handleStep1DataChange}
                onNext={handleStep1Next}
                onValidateField={handleStep1FieldValidation}
              />
            )}

            {currentStep === 2 && (
              <Step2Form
                data={step2Data}
                errors={step2Errors}
                onDataChange={handleStep2DataChange}
                onSubmit={handleStep2Submit}
                onBack={handleStep2Back}
                onValidateField={handleStep2FieldValidation}
              />
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Important Information / महत्वपूर्ण जानकारी
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  • Ensure all information provided is accurate and matches your
                  official documents.
                </p>
                <p className="hindi-text">
                  • सुनिश्चित करें कि प्रदान की गई सभी जानकारी सटीक है और आपके
                  आधिकारिक दस्तावेजों से मेल खाती है।
                </p>
                <p>
                  • Keep your Aadhaar and PAN documents ready for verification.
                </p>
                <p className="hindi-text">
                  • सत्यापन के लिए अपने आधार और पैन दस्तावेज तैयार रखें।
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm">
              © 2024 Ministry of Micro, Small and Medium Enterprises, Government
              of India
            </p>
            <p className="text-xs text-gray-400 mt-1 hindi-text">
              सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय, भारत सरकार
            </p>
          </div>
        </footer>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          registrationId={registrationId}
          entrepreneurName={step1Data.entrepreneurName}
          businessName={step2Data.businessName}
        />
      </div>
    </>
  );
};

export default UdyamRegistrationForm;
