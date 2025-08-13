export interface Step1FormData {
  aadhaarNumber: string;
  entrepreneurName: string;
  otp: string;
  declaration: boolean;
}

export interface Step2FormData {
  panNumber: string;
  businessName: string;
  businessType: string;
  address: string;
  pinCode: string;
  city: string;
  state: string;
  mobileNumber: string;
  emailId: string;
  bankAccountNumber: string;
  ifscCode: string;
  dateOfCommencement: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  message: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  validation: ValidationRule;
  options?: { value: string; label: string }[];
}

export interface PinCodeResponse {
  Status: string;
  PostOffice?: Array<{
    Name: string;
    District: string;
    State: string;
    Country: string;
  }>;
}

export type FormStep = 1 | 2;

export interface ProgressStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}
