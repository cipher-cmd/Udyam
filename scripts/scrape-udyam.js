const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeUdyamForm() {
  console.log('Starting Udyam form scraping...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for production
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('Navigating to Udyam registration portal...');
    await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for the page to load completely
    await page.waitForTimeout(3000);
    
    console.log('Extracting form structure...');
    
    // Extract form fields and validation rules
    const formData = await page.evaluate(() => {
      const extractedData = {
        step1: {
          fields: [],
          validations: [],
          labels: []
        },
        step2: {
          fields: [],
          validations: [],
          labels: []
        },
        uiComponents: {
          dropdowns: [],
          buttons: [],
          radioButtons: [],
          checkboxes: []
        }
      };
      
      // Extract input fields
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach((input, index) => {
        const fieldInfo = {
          id: input.id || `field_${index}`,
          name: input.name || '',
          type: input.type || input.tagName.toLowerCase(),
          placeholder: input.placeholder || '',
          required: input.required || input.hasAttribute('required'),
          maxLength: input.maxLength || '',
          pattern: input.pattern || '',
          className: input.className || ''
        };
        
        // Try to find associated label
        const label = document.querySelector(`label[for="${input.id}"]`) || 
                     input.closest('td')?.previousElementSibling?.textContent?.trim() ||
                     input.closest('div')?.querySelector('label')?.textContent?.trim();
        
        if (label) {
          fieldInfo.label = typeof label === 'string' ? label : label.textContent?.trim();
        }
        
        // Categorize by likely step (this is an approximation)
        if (input.id?.toLowerCase().includes('aadhaar') || 
            input.id?.toLowerCase().includes('pan') ||
            input.id?.toLowerCase().includes('otp') ||
            index < 10) {
          extractedData.step1.fields.push(fieldInfo);
        } else {
          extractedData.step2.fields.push(fieldInfo);
        }
      });
      
      // Extract dropdowns
      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
        const options = Array.from(select.options).map(option => ({
          value: option.value,
          text: option.textContent.trim()
        }));
        
        extractedData.uiComponents.dropdowns.push({
          id: select.id,
          name: select.name,
          options: options
        });
      });
      
      // Extract buttons
      const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
      buttons.forEach(button => {
        extractedData.uiComponents.buttons.push({
          id: button.id,
          text: button.textContent?.trim() || button.value,
          type: button.type,
          className: button.className
        });
      });
      
      // Extract validation patterns from scripts
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        const content = script.textContent || '';
        
        // Look for common validation patterns
        if (content.includes('PAN') || content.includes('pan')) {
          const panPattern = content.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/g);
          if (panPattern) {
            extractedData.step1.validations.push({
              field: 'PAN',
              pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
              description: 'PAN format validation'
            });
          }
        }
        
        if (content.includes('Aadhaar') || content.includes('aadhaar')) {
          extractedData.step1.validations.push({
            field: 'Aadhaar',
            pattern: '[0-9]{12}',
            description: 'Aadhaar number validation'
          });
        }
        
        // Look for PIN code validation
        if (content.includes('PIN') || content.includes('pin')) {
          extractedData.step2.validations.push({
            field: 'PIN',
            pattern: '[0-9]{6}',
            description: 'PIN code validation'
          });
        }
      });
      
      return extractedData;
    });
    
    console.log('Form data extracted successfully');
    
    // Save the extracted data
    const outputPath = path.join(__dirname, '..', 'data', 'udyam-form-structure.json');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(formData, null, 2));
    console.log(`Form structure saved to: ${outputPath}`);
    
    // Take a screenshot for reference
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'data', 'udyam-form-screenshot.png'),
      fullPage: true 
    });
    console.log('Screenshot saved');
    
    return formData;
    
  } catch (error) {
    console.error('Error scraping Udyam form:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper if this file is executed directly
if (require.main === module) {
  scrapeUdyamForm()
    .then((data) => {
      console.log('Scraping completed successfully');
      console.log('Extracted fields:', data.step1.fields.length + data.step2.fields.length);
    })
    .catch((error) => {
      console.error('Scraping failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapeUdyamForm };
