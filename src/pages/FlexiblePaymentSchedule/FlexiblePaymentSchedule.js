import React from 'react';
import SimpleNav from '../../Components/SimpleNav';

// Add JetBrains Mono font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.head.querySelector('link[href*="JetBrains+Mono"]')) {
  document.head.appendChild(fontLink);
}

// Add custom styles
const customStyles = `
  .jetbrains-mono {
    font-family: 'JetBrains Mono', monospace !important;
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
if (!document.head.querySelector('style[data-jetbrains]')) {
  styleSheet.setAttribute('data-jetbrains', 'true');
  document.head.appendChild(styleSheet);
}

const FlexiblePaymentSchedule = () => {
  const [loanAmount, setLoanAmount] = React.useState('');
  const [displayAmount, setDisplayAmount] = React.useState('');
  const [interestRate, setInterestRate] = React.useState('');
  const [schedule, setSchedule] = React.useState('12');
  const [results, setResults] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  const formatNumber = (value) => {
    const num = value.replace(/[^\d.]/g, '');
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^\d.]/g, '');
    setLoanAmount(numericValue);
    setDisplayAmount(formatNumber(value));
  };

  const validateInputs = () => {
    const newErrors = {};
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    
    if (!loanAmount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than $0';
    }
    if (!interestRate || isNaN(rate) || rate < 0) {
      newErrors.rate = 'Please enter a valid interest rate (0% or higher)';
    }
    if (rate > 50) {
      newErrors.rate = 'Interest rate seems unusually high. Please verify.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePayments = async (event) => {
    event.preventDefault();
    
    if (!validateInputs()) return;
    
    const requestData = {
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      paymentsPerYear: parseInt(schedule)
    };
    
    // Try Spring Boot API first, fallback to JavaScript
    try {
      const response = await fetch('http://localhost:8080/api/payment-calculator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults({
          paymentAmount: data.paymentAmount,
          paymentsPerYear: data.paymentsPerYear,
          paymentFrequency: data.paymentFrequency,
          totalPaid: data.totalPaid,
          totalInterest: data.totalInterest,
          source: 'Spring Boot API'
        });
        return;
      }
    } catch (error) {
      // Fall through to JavaScript calculation
    }
    
    // JavaScript fallback
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const paymentsPerYear = parseInt(schedule);
    const periodicRate = rate / paymentsPerYear;
    
    // Calculate payment with interest using standard loan formula
    const paymentAmount = periodicRate > 0 
      ? (amount * periodicRate) / (1 - Math.pow(1 + periodicRate, -paymentsPerYear))
      : amount / paymentsPerYear;
    
    const totalPaid = paymentAmount * paymentsPerYear;
    const totalInterest = totalPaid - amount;
    
    const paymentFrequency = {
      12: 'Monthly', 6: 'Bi-Monthly', 4: 'Quarterly', 1: 'Annual'
    }[paymentsPerYear];
    
    setResults({
      paymentAmount: paymentAmount.toFixed(2),
      paymentsPerYear,
      paymentFrequency,
      totalPaid: totalPaid.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      source: 'JavaScript'
    });
  };

  return (
    <>
      <SimpleNav />
      <div style={{ height: 36 }} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 py-12 jetbrains-mono">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <svg className="w-16 h-16 mr-4" viewBox="0 0 24 24"><path fill="#6db33f" d="M20.205 16.392c-2.469 3.289-7.741 2.179-11.122 2.338 0 0-.599.034-1.201.133 0 0 .228-.097.519-.198 2.374-.821 3.496-.986 4.939-1.727 2.71-1.388 5.408-4.413 5.957-7.555-1.032 3.022-4.17 5.623-7.027 6.679-1.955.722-5.492 1.424-5.493 1.424a5.28 5.28 0 0 1-.143-.076c-2.405-1.17-2.475-6.38 1.894-8.059 1.916-.736 3.747-.332 5.818-.825 2.208-.525 4.766-2.18 5.805-4.344 1.165 3.458 2.565 8.866.054 12.21zm.042-13.28a9.212 9.212 0 0 1-1.065 1.89 9.982 9.982 0 0 0-7.167-3.031C6.492 1.971 2 6.463 2 11.985a9.983 9.983 0 0 0 3.205 7.334l.22.194a10.001 10.001 0 0 0 6.560 2.462c5.522 0 9.985-4.463 9.985-9.985 0-2.68-1.054-5.11-2.723-6.878z"/></svg>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Payment Calculator</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">Enterprise Spring Boot application with REST API integration</p>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Server Running
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="https://github.com/dregraham/resume/tree/main/src/pages/FlexiblePaymentSchedule" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 hover:text-white transition-colors font-medium">
                View Source Code
              </a>
              <button onClick={() => document.getElementById('calculator').scrollIntoView({behavior: 'smooth'})} 
                      className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors font-medium">
                Try Calculator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Backend Setup */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-12 jetbrains-mono">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Setup Spring Boot Backend</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Test the complete Spring Boot backend with automated setup scripts that handle all dependencies.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Auto-installs Java 17 + Maven
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Builds Spring Boot application
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Starts server on port 8080
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <a 
                href="/spring-boot-server.exe"
                download="spring-boot-server.exe"
                className="block w-full bg-blue-600 text-white px-6 py-4 rounded-md hover:bg-blue-700 hover:text-white transition-colors text-center font-medium"
              >
                Download Windows Installer (.exe)
              </a>
              <p className="text-base text-gray-600 text-center">
                Requires: <a href="https://adoptium.net/temurin/releases/?version=17" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Java 17</a> & <a href="https://maven.apache.org/download.cgi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Maven</a>
              </p>
              <a 
                href="/spring-boot-server.sh"
                download="spring-boot-server.sh"
                className="block w-full border border-gray-300 text-gray-700 px-6 py-4 rounded-md hover:bg-gray-50 transition-colors text-center font-medium"
              >
                Download Mac/Linux Setup (.sh)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Payment Calculator */}
      <div className="bg-white py-12 jetbrains-mono">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Payment Calculator</h2>
          </div>
          <div id="calculator" className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Interactive calculator for loans with interest, demonstrating payment calculations with Spring Boot API integration.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <form onSubmit={calculatePayments} className="space-y-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input 
                      type="text" 
                      id="amount" 
                      value={displayAmount}
                      onChange={handleAmountChange}
                      placeholder="10,000"
                      required 
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white ${displayAmount ? 'text-gray-900' : 'text-gray-400'} ${
                        errors.amount ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label htmlFor="rate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Annual Interest Rate
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      id="rate" 
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="5.5"
                      min="0" 
                      step="0.01"
                      required 
                      className={`w-full pr-8 pl-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white ${interestRate ? 'text-gray-900' : 'text-gray-400'} ${
                        errors.rate ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">%</span>
                  </div>
                  {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate}</p>}
                </div>

                <div>
                  <label htmlFor="schedule" className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Frequency
                  </label>
                  <select 
                    id="schedule" 
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-black"
                  >
                    <option value="12">Monthly (12 payments/year)</option>
                    <option value="6">Bi-Monthly (6 payments/year)</option>
                    <option value="4">Quarterly (4 payments/year)</option>
                    <option value="1">Annual (1 payment/year)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Calculate Loan Payments
                </button>
              </form>
          
              {results && (
                <div className="mt-6 p-6 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Payment Results</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Amount:</span>
                      <span className="font-semibold">${parseFloat(results.paymentAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-semibold">{results.paymentFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payments Per Year:</span>
                      <span className="font-semibold">{results.paymentsPerYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid:</span>
                      <span className="font-semibold">${parseFloat(results.totalPaid).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Total Interest:</span>
                      <span className="font-semibold">${parseFloat(results.totalInterest).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Powered by: {results.source || 'JavaScript'}
                      {results.source === 'JavaScript' && ' (Download backend above to test Spring Boot integration)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Technology Stack */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-12 jetbrains-mono">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h3>
              <p className="text-lg text-gray-600 mb-6">
                Enterprise Spring Boot application with automated dependency management and build process.
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                  <a href="https://adoptium.net/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 underline font-medium">Java 17</a>
                  <span className="ml-2 text-gray-600">- Runtime environment</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                  <a href="https://maven.apache.org/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 underline font-medium">Maven</a>
                  <span className="ml-2 text-gray-600">- Build automation</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  <a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline font-medium">Spring Boot 3.2</a>
                  <span className="ml-2 text-gray-600">- Web framework</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline font-medium">React</a>
                  <span className="ml-2 text-gray-600">- Frontend UI</span>
                </div>
              </div>
              <div className="pt-6">
                <a 
                  href="https://github.com/dregraham/resume/tree/main/src/pages/FlexiblePaymentSchedule" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Complete Source Code →
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Architecture Components</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <a href="https://github.com/dregraham/resume/blob/main/src/pages/FlexiblePaymentSchedule/src/main/java/com/dregraham/rentcalculator/controller/RentCalculatorController.java" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline font-medium">RentCalculatorController.java</a>
                  <span className="ml-2 text-gray-600">- REST endpoints</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <a href="https://github.com/dregraham/resume/blob/main/src/pages/FlexiblePaymentSchedule/src/main/java/com/dregraham/rentcalculator/service/RentCalculatorService.java" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline font-medium">RentCalculatorService.java</a>
                  <span className="ml-2 text-gray-600">- Business logic</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <a href="https://github.com/dregraham/resume/blob/main/src/pages/FlexiblePaymentSchedule/src/main/java/com/dregraham/rentcalculator/model/RentCalculationRequest.java" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline font-medium">RentCalculationRequest.java</a>
                  <span className="ml-2 text-gray-600">- Data validation</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <a href="https://github.com/dregraham/resume/blob/main/src/pages/FlexiblePaymentSchedule/pom.xml" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline font-medium">Maven configuration</a>
                  <span className="ml-2 text-gray-600">- Dependencies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlexiblePaymentSchedule;