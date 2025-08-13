import type { NextApiRequest, NextApiResponse } from 'next';
import { Step1FormData, Step2FormData } from '@/types/form';
import { validateForm } from '@/utils/validation';

interface RegistrationRequest {
  step1Data: Step1FormData;
  step2Data: Step2FormData;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  registrationId?: string;
  errors?: Record<string, string>;
}

// In a real application, this would be stored in a database
let registrationDatabase: Array<{
  id: string;
  data: RegistrationRequest;
  submittedAt: string;
  status: string;
}> = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegistrationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { step1Data, step2Data }: RegistrationRequest = req.body;

    // Validate Step 1 data
    const step1Validations = {
      aadhaarNumber: {
        required: true,
        pattern: /^\d{12}$/,
        message: 'Please enter a valid 12-digit Aadhaar number',
      },
      entrepreneurName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: 'Please enter a valid name (2-100 characters)',
      },
      otp: {
        required: true,
        pattern: /^\d{6}$/,
        message: 'Please enter a valid 6-digit OTP',
      },
      declaration: {
        required: true,
        message: 'Please accept the declaration',
      },
    };

    // Validate Step 2 data
    const step2Validations = {
      panNumber: {
        required: true,
        pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: 'Please enter a valid PAN number',
      },
      businessName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: 'Please enter a valid business name',
      },
      businessType: {
        required: true,
        message: 'Please select a business type',
      },
      address: {
        required: true,
        minLength: 10,
        maxLength: 200,
        message: 'Please enter a valid address',
      },
      pinCode: {
        required: true,
        pattern: /^\d{6}$/,
        message: 'Please enter a valid PIN code',
      },
      city: {
        required: true,
        message: 'Please enter city name',
      },
      state: {
        required: true,
        message: 'Please select state',
      },
      mobileNumber: {
        required: true,
        pattern: /^[6-9]\d{9}$/,
        message: 'Please enter a valid mobile number',
      },
      emailId: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
      bankAccountNumber: {
        required: true,
        pattern: /^\d{9,18}$/,
        message: 'Please enter a valid bank account number',
      },
      ifscCode: {
        required: true,
        pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
        message: 'Please enter a valid IFSC code',
      },
      dateOfCommencement: {
        required: true,
        message: 'Please select date of commencement',
      },
    };

    const step1Errors = validateForm(step1Data, step1Validations);
    const step2Errors = validateForm(step2Data, step2Validations);

    const allErrors = { ...step1Errors, ...step2Errors };

    if (Object.keys(allErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: allErrors,
      });
    }

    // Generate registration ID
    const registrationId = `UDYAM${Date.now()}${Math.floor(
      Math.random() * 1000
    )}`;

    // Store registration (in a real app, this would go to a database)
    const registration = {
      id: registrationId,
      data: { step1Data, step2Data },
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };

    registrationDatabase.push(registration);

    // Log registration for demo purposes
    console.log('New Registration Submitted:', {
      registrationId,
      entrepreneurName: step1Data.entrepreneurName,
      businessName: step2Data.businessName,
      submittedAt: registration.submittedAt,
    });

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email/SMS
    // 3. Generate PDF certificate
    // 4. Integrate with government APIs
    // 5. Queue for manual verification if needed

    return res.status(200).json({
      success: true,
      message: 'Registration submitted successfully!',
      registrationId,
    });
  } catch (error) {
    console.error('Registration submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}

// API endpoint to get registration status (for demo)
export function getRegistrationStatus(registrationId: string) {
  return registrationDatabase.find((reg) => reg.id === registrationId);
}
