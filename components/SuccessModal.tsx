import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  entrepreneurName: string;
  businessName: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  registrationId,
  entrepreneurName,
  businessName,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    alert('PDF download functionality would be implemented here.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 hindi-text mb-4">पंजीकरण सफल!</p>
            <p className="text-gray-700">
              Your Udyam registration has been submitted successfully.
            </p>
          </div>

          {/* Registration Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Registration Details / पंजीकरण विवरण
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Registration ID:
                </span>
                <span className="text-sm font-mono text-udyam-blue font-semibold">
                  {registrationId}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Entrepreneur Name:
                </span>
                <span className="text-sm text-gray-900">
                  {entrepreneurName}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Business Name:
                </span>
                <span className="text-sm text-gray-900">{businessName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Submitted On:
                </span>
                <span className="text-sm text-gray-900">
                  {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Important Information / महत्वपूर्ण जानकारी
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Please save your Registration ID for future reference</li>
              <li>• You will receive a confirmation email within 24 hours</li>
              <li>• Certificate will be generated after verification</li>
              <li className="hindi-text">
                • भविष्य के संदर्भ के लिए अपनी पंजीकरण आईडी सहेजें
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePrint}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Receipt
            </button>
            <button
              onClick={handleDownloadPDF}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </button>
            <button onClick={onClose} className="btn-primary flex-1">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
