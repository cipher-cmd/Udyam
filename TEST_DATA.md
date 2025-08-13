# Test Data for Udyam Registration Form

## 🧪 Complete Test Data Sets

### Test Set 1: Delhi Business
```
Step 1:
- Aadhaar: 123456789012
- Name: Rajesh Kumar (auto-filled after OTP)
- OTP: (use the 6-digit code shown in alert)
- Declaration: ✓ Check the box

Step 2:
- PAN: ABCDE1234F
- Business Name: Delhi Electronics Pvt Ltd
- Business Type: Manufacturing
- Address: Plot 15, Sector 8, Industrial Area, New Delhi
- PIN Code: 110001 (will auto-fill Delhi)
- Mobile: 9876543210
- Email: rajesh@delhielectronics.com
- Bank Account: 123456789012345
- IFSC: SBIN0000001 (State Bank of India, New Delhi)
- Date: 2023-01-15
```

### Test Set 2: Mumbai Business
```
Step 1:
- Aadhaar: 987654321098
- Name: Priya Sharma (auto-filled after OTP)
- OTP: (use the generated code)
- Declaration: ✓ Check the box

Step 2:
- PAN: XYZAB5678C
- Business Name: Mumbai Tech Solutions
- Business Type: Service
- Address: Office 301, Andheri East, Mumbai
- PIN Code: 400001 (will auto-fill Mumbai)
- Mobile: 8765432109
- Email: priya@mumbaitech.com
- Bank Account: 987654321098765
- IFSC: HDFC0000001 (HDFC Bank, Mumbai)
- Date: 2022-06-20
```

### Test Set 3: Bangalore Business
```
Step 1:
- Aadhaar: 456789012345
- Name: Suresh Reddy (auto-filled after OTP)
- OTP: (use the generated code)
- Declaration: ✓ Check the box

Step 2:
- PAN: PQRST9876Z
- Business Name: Bangalore IT Services
- Business Type: Service
- Address: Block C, Electronic City, Bangalore
- PIN Code: 560001 (will auto-fill Bangalore)
- Mobile: 7654321098
- Email: suresh@bangaloreit.com
- Bank Account: 456789012345678
- IFSC: ICIC0000001 (ICICI Bank, Bangalore)
- Date: 2023-03-10
```

## 🏦 Valid IFSC Codes for Testing

### State Bank of India (SBI)
- `SBIN0000001` - New Delhi Main Branch
- `SBIN0000002` - Mumbai Fort Branch
- `SBIN0000003` - Bangalore MG Road Branch
- `SBIN0000004` - Chennai Anna Salai Branch
- `SBIN0000005` - Kolkata Park Street Branch

### HDFC Bank
- `HDFC0000001` - Delhi Connaught Place
- `HDFC0000002` - Mumbai Nariman Point
- `HDFC0000003` - Bangalore Koramangala
- `HDFC0000004` - Chennai T Nagar
- `HDFC0000005` - Hyderabad Banjara Hills

### ICICI Bank
- `ICIC0000001` - Delhi Karol Bagh
- `ICIC0000002` - Mumbai Andheri
- `ICIC0000003` - Bangalore Electronic City
- `ICIC0000004` - Chennai Velachery
- `ICIC0000005` - Pune Camp

### Axis Bank
- `UTIB0000001` - Delhi Rajouri Garden
- `UTIB0000002` - Mumbai Powai
- `UTIB0000003` - Bangalore Whitefield
- `UTIB0000004` - Chennai OMR
- `UTIB0000005` - Gurgaon Sector 14

## 📍 PIN Codes with Auto-Fill Support

### Major Cities (Guaranteed Auto-Fill)
- `110001` - New Delhi, Delhi
- `400001` - Mumbai, Maharashtra
- `560001` - Bangalore, Karnataka
- `700001` - Kolkata, West Bengal
- `600001` - Chennai, Tamil Nadu
- `500001` - Hyderabad, Telangana
- `380001` - Ahmedabad, Gujarat
- `302001` - Jaipur, Rajasthan
- `411001` - Pune, Maharashtra
- `226001` - Lucknow, Uttar Pradesh

### Additional Working PIN Codes
- `160001` - Chandigarh, Chandigarh
- `682001` - Kochi, Kerala
- `751001` - Bhubaneswar, Odisha
- `800001` - Patna, Bihar
- `492001` - Raipur, Chhattisgarh

## 🎯 Quick Test Flow

### 5-Minute Demo Test:
1. **Enter Aadhaar:** `123456789012`
2. **Click "Validate & Send OTP"** (wait 2 seconds)
3. **Enter the OTP** shown in the alert popup
4. **Check declaration box**
5. **Click "Next Step"**
6. **Enter PAN:** `ABCDE1234F`
7. **Click "Validate PAN"** (wait 2 seconds)
8. **Fill business details:**
   - Business Name: `Test Business`
   - Type: `Manufacturing`
   - Address: `Test Address, Test City`
9. **Enter PIN:** `110001` (auto-fills Delhi)
10. **Enter Mobile:** `9876543210`
11. **Enter Email:** `test@example.com`
12. **Enter Bank Account:** `123456789012345`
13. **Enter IFSC:** `SBIN0000001`
14. **Select Date:** Any past date
15. **Click "Submit Registration"**

## 🔧 Troubleshooting

### If PIN Code Doesn't Auto-Fill:
- The form now has fallback data for major Indian cities
- If your PIN code isn't recognized, you can manually enter city and state
- No error alert will show - just type manually

### If API is Slow:
- The PostPin API sometimes has delays
- Fallback data ensures the form always works
- Manual entry is always available as backup

### Common IFSC Code Patterns:
- **SBI:** `SBIN` + 7 digits (e.g., `SBIN0001234`)
- **HDFC:** `HDFC` + 7 digits (e.g., `HDFC0001234`)
- **ICICI:** `ICIC` + 7 digits (e.g., `ICIC0001234`)
- **Axis:** `UTIB` + 7 digits (e.g., `UTIB0001234`)

## ✅ Validation Patterns

- **Aadhaar:** 12 digits only
- **PAN:** 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
- **Mobile:** 10 digits starting with 6-9
- **PIN Code:** 6 digits
- **IFSC:** 4 letters + 0 + 6 alphanumeric characters
- **Bank Account:** 9-18 digits

All test data provided above follows these validation patterns and will work perfectly with your form!
