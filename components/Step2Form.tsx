import React, { useState, useEffect } from 'react';
import { Step2FormData, FormErrors, PinCodeResponse } from '@/types/form';
import {
  validateField,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  formatPanNumber,
  cleanNumericInput,
} from '@/utils/validation';

interface Step2FormProps {
  data: Step2FormData;
  errors: FormErrors;
  onDataChange: (data: Partial<Step2FormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  onValidateField: (field: string, value: any) => void;
}

const Step2Form: React.FC<Step2FormProps> = ({
  data,
  errors,
  onDataChange,
  onSubmit,
  onBack,
  onValidateField,
}) => {
  const [isValidatingPan, setIsValidatingPan] = useState(false);
  const [panValidated, setPanValidated] = useState(false);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Business type options
  const businessTypes = [
    { value: 'manufacturing', label: 'Manufacturing / विनिर्माण' },
    { value: 'service', label: 'Service / सेवा' },
    { value: 'trading', label: 'Trading / व्यापार' },
  ];

  // State options (major Indian states)
  const stateOptions = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Puducherry',
  ];

  // Fetch city/state from PIN code
  const fetchLocationFromPinCode = async (pinCode: string) => {
    if (pinCode.length !== 6) return;

    setIsLoadingLocation(true);
    try {
      // Using India Post API for PIN code lookup
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pinCode}`
      );
      const data: PinCodeResponse[] = await response.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffices = data[0].PostOffice;
        const cities = [...new Set(postOffices.map((po) => po.District))];
        const state = postOffices[0].State;

        setCityOptions(cities);

        // Auto-fill city and state if not already filled
        if (!data.city && cities.length > 0) {
          onDataChange({ city: cities[0] });
        }
        if (!data.state) {
          onDataChange({ state });
        }
      } else {
        // Fallback with common Indian PIN codes and their locations
        const fallbackPinCodes: Record<string, { cities: string[], state: string }> = {
          '110001': { cities: ['New Delhi'], state: 'Delhi' },
          '400001': { cities: ['Mumbai'], state: 'Maharashtra' },
          '560001': { cities: ['Bangalore'], state: 'Karnataka' },
          '700001': { cities: ['Kolkata'], state: 'West Bengal' },
          '600001': { cities: ['Chennai'], state: 'Tamil Nadu' },
          '500001': { cities: ['Hyderabad'], state: 'Telangana' },
          '380001': { cities: ['Ahmedabad'], state: 'Gujarat' },
          '302001': { cities: ['Jaipur'], state: 'Rajasthan' },
          '411001': { cities: ['Pune'], state: 'Maharashtra' },
          '226001': { cities: ['Lucknow'], state: 'Uttar Pradesh' },
          '160001': { cities: ['Chandigarh'], state: 'Chandigarh' },
          '682001': { cities: ['Kochi'], state: 'Kerala' },
          '751001': { cities: ['Bhubaneswar'], state: 'Odisha' },
          '800001': { cities: ['Patna'], state: 'Bihar' },
          '492001': { cities: ['Raipur'], state: 'Chhattisgarh' },
        };

        if (fallbackPinCodes[pinCode]) {
          const location = fallbackPinCodes[pinCode];
          setCityOptions(location.cities);
          onDataChange({ 
            city: location.cities[0], 
            state: location.state 
          });
        } else {
          setCityOptions([]);
          // Don't show alert, just allow manual entry
          console.log('PIN code not found in fallback data, allowing manual entry');
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      // Fallback: Allow manual entry without showing error
      setCityOptions([]);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPanNumber(e.target.value);
    if (value.length <= 10) {
      onDataChange({ panNumber: value });
      onValidateField('panNumber', value);
      setPanValidated(false);
    }
  };

  const handleValidatePan = async () => {
    const panError = validateField('panNumber', data.panNumber, {
      required: true,
      pattern: VALIDATION_PATTERNS.PAN,
      message: VALIDATION_MESSAGES.PAN_INVALID,
    });

    if (panError) {
      onValidateField('panNumber', data.panNumber);
      return;
    }

    setIsValidatingPan(true);
    try {
      // Simulate PAN validation API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPanValidated(true);
      alert('PAN validated successfully!');
    } catch (error) {
      alert('Error validating PAN. Please try again.');
    } finally {
      setIsValidatingPan(false);
    }
  };

  const handlePinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = cleanNumericInput(e.target.value);
    if (value.length <= 6) {
      onDataChange({ pinCode: value });
      onValidateField('pinCode', value);

      if (value.length === 6) {
        fetchLocationFromPinCode(value);
      } else {
        setCityOptions([]);
      }
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = cleanNumericInput(e.target.value);
    if (value.length <= 10) {
      onDataChange({ mobileNumber: value });
      onValidateField('mobileNumber', value);
    }
  };

  const handleBankAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = cleanNumericInput(e.target.value);
    if (value.length <= 18) {
      onDataChange({ bankAccountNumber: value });
      onValidateField('bankAccountNumber', value);
    }
  };

  const handleIfscChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 11) {
      onDataChange({ ifscCode: value });
      onValidateField('ifscCode', value);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const validations = {
      panNumber: {
        required: true,
        pattern: VALIDATION_PATTERNS.PAN,
        message: VALIDATION_MESSAGES.PAN_INVALID,
      },
      businessName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: 'Please enter a valid business name (2-100 characters)',
      },
      businessType: {
        required: true,
        message: 'Please select a business type',
      },
      address: {
        required: true,
        minLength: 10,
        maxLength: 200,
        message: 'Please enter a valid address (10-200 characters)',
      },
      pinCode: {
        required: true,
        pattern: VALIDATION_PATTERNS.PIN_CODE,
        message: VALIDATION_MESSAGES.PIN_CODE_INVALID,
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
        pattern: VALIDATION_PATTERNS.MOBILE,
        message: VALIDATION_MESSAGES.MOBILE_INVALID,
      },
      emailId: {
        required: true,
        pattern: VALIDATION_PATTERNS.EMAIL,
        message: VALIDATION_MESSAGES.EMAIL_INVALID,
      },
      bankAccountNumber: {
        required: true,
        pattern: VALIDATION_PATTERNS.BANK_ACCOUNT,
        message: VALIDATION_MESSAGES.BANK_ACCOUNT_INVALID,
      },
      ifscCode: {
        required: true,
        pattern: VALIDATION_PATTERNS.IFSC,
        message: VALIDATION_MESSAGES.IFSC_INVALID,
      },
      dateOfCommencement: {
        required: true,
        message: 'Please select date of commencement',
      },
    };

    let hasErrors = false;
    Object.entries(validations).forEach(([field, validation]) => {
      const error = validateField(
        field,
        data[field as keyof Step2FormData],
        validation
      );
      if (error) {
        onValidateField(field, data[field as keyof Step2FormData]);
        hasErrors = true;
      }
    });

    if (!panValidated) {
      alert('Please validate your PAN number first.');
      hasErrors = true;
    }

    if (!hasErrors) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 2: Business Details & PAN Validation
          </h2>
          <p className="text-gray-600 hindi-text">
            चरण 2: व्यावसायिक विवरण और पैन सत्यापन
          </p>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-6">
          {/* PAN Number */}
          <div>
            <label className="form-label">1. PAN Number / पैन नंबर *</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={data.panNumber}
                onChange={handlePanChange}
                placeholder="ABCDE1234F"
                className={`form-input flex-1 ${
                  errors.panNumber
                    ? 'border-red-500'
                    : panValidated
                    ? 'border-green-500'
                    : ''
                }`}
                disabled={panValidated}
              />
              <button
                type="button"
                onClick={handleValidatePan}
                disabled={
                  !data.panNumber ||
                  errors.panNumber ||
                  isValidatingPan ||
                  panValidated
                }
                className={`btn-primary whitespace-nowrap ${
                  panValidated ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              >
                {isValidatingPan
                  ? 'Validating...'
                  : panValidated
                  ? 'Validated ✓'
                  : 'Validate PAN'}
              </button>
            </div>
            {errors.panNumber && (
              <p className="form-error">{errors.panNumber}</p>
            )}
            {panValidated && (
              <p className="form-success">PAN validated successfully!</p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label className="form-label">
              2. Business Name / व्यावसायिक नाम *
            </label>
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => {
                onDataChange({ businessName: e.target.value });
                onValidateField('businessName', e.target.value);
              }}
              placeholder="Enter your business name"
              className={`form-input ${
                errors.businessName ? 'border-red-500' : ''
              }`}
              maxLength={100}
            />
            {errors.businessName && (
              <p className="form-error">{errors.businessName}</p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <label className="form-label">
              3. Business Type / व्यावसायिक प्रकार *
            </label>
            <select
              value={data.businessType}
              onChange={(e) => {
                onDataChange({ businessType: e.target.value });
                onValidateField('businessType', e.target.value);
              }}
              className={`form-input ${
                errors.businessType ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="form-error">{errors.businessType}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="form-label">
              4. Business Address / व्यावसायिक पता *
            </label>
            <textarea
              value={data.address}
              onChange={(e) => {
                onDataChange({ address: e.target.value });
                onValidateField('address', e.target.value);
              }}
              placeholder="Enter complete business address"
              className={`form-input ${errors.address ? 'border-red-500' : ''}`}
              rows={3}
              maxLength={200}
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          {/* PIN Code, City, State Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">5. PIN Code / पिन कोड *</label>
              <input
                type="text"
                value={data.pinCode}
                onChange={handlePinCodeChange}
                placeholder="123456"
                className={`form-input ${
                  errors.pinCode ? 'border-red-500' : ''
                }`}
              />
              {errors.pinCode && <p className="form-error">{errors.pinCode}</p>}
              {isLoadingLocation && (
                <p className="text-sm text-blue-600 mt-1">
                  Loading location...
                </p>
              )}
            </div>

            <div>
              <label className="form-label">6. City / शहर *</label>
              {cityOptions.length > 0 ? (
                <select
                  value={data.city}
                  onChange={(e) => {
                    onDataChange({ city: e.target.value });
                    onValidateField('city', e.target.value);
                  }}
                  className={`form-input ${
                    errors.city ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select city</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => {
                    onDataChange({ city: e.target.value });
                    onValidateField('city', e.target.value);
                  }}
                  placeholder="Enter city name"
                  className={`form-input ${
                    errors.city ? 'border-red-500' : ''
                  }`}
                />
              )}
              {errors.city && <p className="form-error">{errors.city}</p>}
            </div>

            <div>
              <label className="form-label">7. State / राज्य *</label>
              <select
                value={data.state}
                onChange={(e) => {
                  onDataChange({ state: e.target.value });
                  onValidateField('state', e.target.value);
                }}
                className={`form-input ${errors.state ? 'border-red-500' : ''}`}
              >
                <option value="">Select state</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="form-error">{errors.state}</p>}
            </div>
          </div>

          {/* Contact Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                8. Mobile Number / मोबाइल नंबर *
              </label>
              <input
                type="text"
                value={data.mobileNumber}
                onChange={handleMobileChange}
                placeholder="9876543210"
                className={`form-input ${
                  errors.mobileNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.mobileNumber && (
                <p className="form-error">{errors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label className="form-label">9. Email ID / ईमेल आईडी *</label>
              <input
                type="email"
                value={data.emailId}
                onChange={(e) => {
                  onDataChange({ emailId: e.target.value });
                  onValidateField('emailId', e.target.value);
                }}
                placeholder="example@email.com"
                className={`form-input ${
                  errors.emailId ? 'border-red-500' : ''
                }`}
              />
              {errors.emailId && <p className="form-error">{errors.emailId}</p>}
            </div>
          </div>

          {/* Bank Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                10. Bank Account Number / बैंक खाता संख्या *
              </label>
              <input
                type="text"
                value={data.bankAccountNumber}
                onChange={handleBankAccountChange}
                placeholder="123456789012345"
                className={`form-input ${
                  errors.bankAccountNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.bankAccountNumber && (
                <p className="form-error">{errors.bankAccountNumber}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                11. IFSC Code / आईएफएससी कोड *
              </label>
              <input
                type="text"
                value={data.ifscCode}
                onChange={handleIfscChange}
                placeholder="SBIN0001234"
                className={`form-input ${
                  errors.ifscCode ? 'border-red-500' : ''
                }`}
              />
              {errors.ifscCode && (
                <p className="form-error">{errors.ifscCode}</p>
              )}
            </div>
          </div>

          {/* Date of Commencement */}
          <div>
            <label className="form-label">
              12. Date of Commencement / प्रारंभ की तारीख *
            </label>
            <input
              type="date"
              value={data.dateOfCommencement}
              onChange={(e) => {
                onDataChange({ dateOfCommencement: e.target.value });
                onValidateField('dateOfCommencement', e.target.value);
              }}
              className={`form-input ${
                errors.dateOfCommencement ? 'border-red-500' : ''
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dateOfCommencement && (
              <p className="form-error">{errors.dateOfCommencement}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
            <button type="button" onClick={onBack} className="btn-secondary">
              ← Back to Step 1
            </button>
            <button type="submit" className="btn-primary min-w-[140px]">
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2Form;
