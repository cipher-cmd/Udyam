import { FormErrors, ValidationRule } from '@/types/form';

// Validation patterns
export const VALIDATION_PATTERNS = {
  AADHAAR: /^\d{12}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PIN_CODE: /^\d{6}$/,
  MOBILE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  BANK_ACCOUNT: /^\d{9,18}$/,
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  AADHAAR_INVALID: 'Please enter a valid 12-digit Aadhaar number',
  PAN_INVALID: 'Please enter a valid PAN number (e.g., ABCDE1234F)',
  PIN_CODE_INVALID: 'Please enter a valid 6-digit PIN code',
  MOBILE_INVALID: 'Please enter a valid 10-digit mobile number',
  EMAIL_INVALID: 'Please enter a valid email address',
  IFSC_INVALID: 'Please enter a valid IFSC code',
  BANK_ACCOUNT_INVALID:
    'Please enter a valid bank account number (9-18 digits)',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
};

// Validate individual field
export const validateField = (
  name: string,
  value: any,
  validation: ValidationRule
): string => {
  // Check required
  if (validation.required && (!value || value.toString().trim() === '')) {
    return validation.message || VALIDATION_MESSAGES.REQUIRED;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return '';
  }

  const stringValue = value.toString().trim();

  // Check pattern
  if (validation.pattern && !validation.pattern.test(stringValue)) {
    return validation.message;
  }

  // Check min length
  if (validation.minLength && stringValue.length < validation.minLength) {
    return (
      validation.message || VALIDATION_MESSAGES.MIN_LENGTH(validation.minLength)
    );
  }

  // Check max length
  if (validation.maxLength && stringValue.length > validation.maxLength) {
    return (
      validation.message || VALIDATION_MESSAGES.MAX_LENGTH(validation.maxLength)
    );
  }

  return '';
};

// Validate entire form
export const validateForm = (
  data: Record<string, any>,
  validationRules: Record<string, ValidationRule>
): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(validationRules).forEach((fieldName) => {
    const error = validateField(
      fieldName,
      data[fieldName],
      validationRules[fieldName]
    );
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

// Format Aadhaar number with spaces for display
export const formatAadhaarNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return value;
};

// Format PAN number to uppercase
export const formatPanNumber = (value: string): string => {
  return value.toUpperCase();
};

// Clean numeric input (remove non-digits)
export const cleanNumericInput = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Validate Aadhaar using Verhoeff algorithm (basic implementation)
export const validateAadhaarChecksum = (aadhaar: string): boolean => {
  const cleanAadhaar = cleanNumericInput(aadhaar);
  if (cleanAadhaar.length !== 12) return false;

  // Verhoeff algorithm implementation
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  let c = 0;
  const myArray = cleanAadhaar.split('').map(Number).reverse();

  for (let i = 0; i < myArray.length; i++) {
    c = d[c][p[(i + 1) % 8][myArray[i]]];
  }

  return c === 0;
};

// Check if PAN format is valid
export const isPanValid = (pan: string): boolean => {
  return VALIDATION_PATTERNS.PAN.test(pan);
};

// Generate OTP (for demo purposes)
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
