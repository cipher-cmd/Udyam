# Udyam Registration Form

A responsive UI form that mimics the first two steps of the Udyam registration process for Micro, Small and Medium Enterprises (MSMEs) in India.

## Features

### ✅ Completed Features

1. **Web Scraping** - Extracted form fields and structure from the official Udyam portal
2. **Responsive UI** - Mobile-first design with React/Next.js and TypeScript
3. **Step 1: Aadhaar Verification**
   - Aadhaar number input with formatting
   - OTP generation and validation (demo mode)
   - Name auto-fill from Aadhaar (simulated)
   - Declaration checkbox
4. **Step 2: PAN Validation & Business Details**
   - PAN number validation with proper format
   - Business details form
   - Auto-fill city/state based on PIN code using PostPin API
   - Bank account and IFSC validation
5. **Real-time Validation**
   - Aadhaar format validation (12 digits)
   - PAN format validation (ABCDE1234F)
   - Mobile number validation
   - Email validation
   - PIN code validation with location lookup
6. **Progress Tracker** - Shows current step and completion status
7. **Bilingual Support** - English and Hindi labels

### 🎨 UI Enhancements

- Modern, clean design inspired by government portals
- Responsive layout (mobile-first approach)
- Progress indicator with step completion
- Real-time form validation with error messages
- Success/error states for form fields
- Loading states for API calls

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom government-themed colors
- **Validation**: Custom validation utilities with regex patterns
- **API Integration**: PostPin API for PIN code to city/state lookup
- **Web Scraping**: Puppeteer for extracting form structure

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd udyam-registration-form
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run scrape` - Run web scraper to extract form structure

## Form Validation

### Step 1 Validations

- **Aadhaar Number**: 12-digit numeric validation
- **Name**: 2-100 characters, required
- **OTP**: 6-digit numeric (demo mode)
- **Declaration**: Must be checked

### Step 2 Validations

- **PAN Number**: Format ABCDE1234F (5 letters + 4 digits + 1 letter)
- **Business Name**: 2-100 characters
- **Address**: 10-200 characters
- **PIN Code**: 6-digit numeric with location lookup
- **Mobile**: 10-digit starting with 6-9
- **Email**: Valid email format
- **Bank Account**: 9-18 digits
- **IFSC Code**: Format ABCD0123456

## API Integrations

### PIN Code Lookup

Uses the PostPin API (`https://api.postalpincode.in/pincode/{pincode}`) to:

- Auto-fill city options based on PIN code
- Auto-select state
- Validate PIN code existence

### Demo Features

- OTP generation (6-digit random number)
- PAN validation simulation
- Aadhaar name lookup simulation

## File Structure

```
├── components/
│   ├── ProgressTracker.tsx    # Step progress indicator
│   ├── Step1Form.tsx          # Aadhaar verification form
│   └── Step2Form.tsx          # PAN & business details form
├── pages/
│   ├── _app.tsx               # Next.js app wrapper
│   └── index.tsx              # Main application page
├── scripts/
│   └── scrape-udyam.js        # Web scraper for form structure
├── styles/
│   └── globals.css            # Global styles with Tailwind
├── types/
│   └── form.ts                # TypeScript interfaces
├── utils/
│   └── validation.ts          # Validation utilities
├── data/
│   ├── udyam-form-structure.json  # Scraped form data
│   └── udyam-form-screenshot.png  # Portal screenshot
└── README.md
```

## Responsive Design

The application is built with a mobile-first approach:

- **Mobile (< 640px)**: Single column layout, optimized touch targets
- **Tablet (640px - 1024px)**: Two-column layout for some fields
- **Desktop (> 1024px)**: Full multi-column layout with better spacing

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

1. **Backend Integration**

   - Real Aadhaar API integration
   - PAN verification service
   - Database storage
   - File upload for documents

2. **Additional Features**

   - Document upload (Aadhaar, PAN, Bank statements)
   - Email/SMS notifications
   - Application status tracking
   - Print/PDF generation of form

3. **Security**
   - Input sanitization
   - CSRF protection
   - Rate limiting
   - Encryption for sensitive data

## License

This project is created for educational/demonstration purposes. The actual Udyam registration should be done through the official government portal at [udyamregistration.gov.in](https://udyamregistration.gov.in).

## Acknowledgments

- Official Udyam Registration Portal for form structure reference
- PostPin API for PIN code services
- Government of India design guidelines
