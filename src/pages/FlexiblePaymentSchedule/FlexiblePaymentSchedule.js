
import React, { useState, useEffect } from 'react';
import SimpleNav from '../../Components/SimpleNav';
import './FlexiblePaymentSchedule.css';



// Add JetBrains Mono font (top-level, outside component)
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.head.querySelector('link[href*="JetBrains+Mono"]')) {
  document.head.appendChild(fontLink);
}

// Add custom styles (top-level, outside component)
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
  const [serverStatus, setServerStatus] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Health check for backend server
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/payment-calculator/ping');
        if (res.ok) {
          setServerStatus('running');
        } else {
          setServerStatus('offline');
        }
      } catch {
        setServerStatus('offline');
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  });

  const [loanAmount, setLoanAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [schedule, setSchedule] = useState('12');
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [isBlurbExpanded, setIsBlurbExpanded] = useState(false);

  // === How It Works Steps ===
  const howItWorksSteps = [
    {
      step: "01",
      title: "User Submits Loan Details",
      text: "You enter the loan amount, interest rate, and payment frequency, then click 'Calculate Loan Payments'.",
      color: "from-green-400 to-teal-400",
    },
    {
      step: "02",
      title: "Frontend Validates Input",
      text: "The React app checks your input for valid numbers and reasonable ranges before sending anything to the backend.",
      color: "from-blue-400 to-purple-400",
    },
    {
      step: "03",
      title: "Backend Calculation (Java)",
      text: "If the Spring Boot API is running, your data is sent to the backend, where Java classes validate and process the request, then calculate the payment schedule using OOP logic.",
      color: "from-yellow-400 to-orange-400",
    },
    {
      step: "04",
      title: "Results Returned & Displayed",
      text: "The backend responds with the calculated payment, total paid, and interest. The React UI displays these results instantly. If the backend is offline, the calculation is done in JavaScript as a fallback.",
      color: "from-red-400 to-pink-400",
    }
  ];

  const formatNumber = (value) => {
    const num = value.replace(/[^\d.]/g, '');
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setLoanAmount(value.replace(/[^\d.]/g, ''));
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
      // Fallback to JS calculation if backend fails
    }

    // JavaScript Fallback
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const paymentsPerYear = parseInt(schedule);
    const periodicRate = rate / paymentsPerYear;
    const paymentAmount = periodicRate > 0
      ? (amount * periodicRate) / (1 - Math.pow(1 + periodicRate, -paymentsPerYear))
      : amount / paymentsPerYear;
    const totalPaid = paymentAmount * paymentsPerYear;
    const totalInterest = totalPaid - amount;

    setResults({
      paymentAmount: paymentAmount.toFixed(2),
      paymentsPerYear,
      paymentFrequency: { 12: 'Monthly', 6: 'Bi-Monthly', 4: 'Quarterly', 1: 'Annual' }[paymentsPerYear],
      totalPaid: totalPaid.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      source: 'JavaScript'
    });
  };

  return (
    <>
      <SimpleNav />
      <div style={{ height: 36 }} />

      {/* === HERO SECTION === */}
      <section className="text-center py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'desyrelregular, serif' }}>
            Payment Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Java-driven payment engine with Spring Boot backend and a built-in JS/React fallback. Download the .jar file below and plug it into any project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="https://github.com/dregraham/resume/tree/main/src/pages/FlexiblePaymentSchedule"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              View Source Code
            </a>
            <button
              onClick={() => document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' })}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Try Calculator
            </button>
          </div>
        </div>
      </section>
      {/* Step 1: Backend Setup */}

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Setup Spring Boot Backend</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Fully packaged backend using Spring Boot with automated setup scripts for Java & Maven. <br/> <br/>
                Can be downloaded and run locally without needing to manually configure dependencies.
              </p>
              <div className="space-y-3">
                <div className="flex items-start text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  <span>
                    <strong>1. Install Java 17 or newer:</strong><br/>
                    <span className="jetbrains-mono bg-gray-100 px-2 py-1 rounded">choco install temurin17 -y</span> <br/>
                    or download from <a href="https://adoptium.net/temurin/releases/?version=17" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Adoptium</a>.
                  </span>
                </div>
                <div className="flex items-start text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  <span>
                    <strong>2. Open PowerShell (or Terminal) in the folder where you downloaded the .jar file and run:</strong><br/>
                    <span className="jetbrains-mono bg-gray-100 px-2 py-1 rounded">java -jar ./payment-calculator-1.0.0.jar</span>
                  </span>
                </div>
                <div className="flex items-start text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  <span>
                    <strong>3. Verify the service is running:</strong><br/>
                    Open your browser and go to <span className="jetbrains-mono bg-gray-100 px-2 py-1 rounded">http://localhost:8080/</span>.<br/>
                    You should see a message: <span className="jetbrains-mono bg-gray-100 px-2 py-1 rounded">Payment Calculator API is running.</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              {/* Screenshot above download button */}
              <img
                src={require("./spring-boot-server.png")}
                alt="Spring Boot server running in PowerShell"
                style={{ maxWidth: '100%', borderRadius: 8, margin: '0 0 12px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}
                onClick={() => setIsImageOpen(true)}
                tabIndex={0}
                aria-label="Expand Spring Boot server screenshot"
              />
              <span className="text-xs text-gray-500">Click image to expand</span>
              {/* Modal for expanded image */}
              {isImageOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                  onClick={() => setIsImageOpen(false)}
                  style={{ cursor: 'zoom-out' }}
                  aria-modal="true"
                  role="dialog"
                >
                  <img
                    src={require("./spring-boot-server.png")}
                    alt="Spring Boot server running in PowerShell expanded"
                    style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              )}
              <a
                href="/payment-calculator-1.0.0.jar"
                download="payment-calculator-1.0.0.jar"
                className="block w-full bg-blue-600 text-white px-6 py-4 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Download Spring Boot JAR (.jar)
              </a>
              <p className="text-base text-gray-600 text-center">
                Requires: {" "}
                <a
                  href="https://adoptium.net/temurin/releases/?version=17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Java 17
                </a>{" "}
                &{" "}
                <a
                  href="https://maven.apache.org/download.cgi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Maven
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* === CALCULATOR === */}
      <section className="py-16 bg-gray-50">
        {/* Server status indicator */}
        <div className="mb-4">
          {serverStatus === 'running' && (
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Local Server Running</span>
          )}
          {serverStatus === 'offline' && (
            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Local Server Offline</span>
          )}
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Payment Calculator</h2>
          </div>

          <div id="calculator" className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-lg text-gray-600 mb-6">
              Enter your loan details to calculate payments. <br/>
              <br/>
              <em>Note:</em> <br/> If the downloadable Spring Boot server (above) is running locally, the calculation is executed in Java via the backend. If not, the logic runs directly in JavaScript as a fallback.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <form onSubmit={calculatePayments} className="space-y-6">

                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-semibold">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={displayAmount}
                      onChange={handleAmountChange}
                      placeholder="10,000"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg ${errors.amount ? 'border-red-500' : 'border-gray-200'}`.replace('bg-white', '')}
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-semibold">Annual Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="5.5"
                      step="0.01"
                      className={`w-full pr-8 px-4 py-3 border-2 rounded-lg ${errors.rate ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate}</p>}
                </div>

                {/* Payment Frequency */}
                <div>
                  <label className="block text-sm font-semibold">Payment Frequency</label>
                  <select
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  >
                    <option value="12">Monthly</option>
                    <option value="6">Bi-Monthly</option>
                    <option value="4">Quarterly</option>
                    <option value="1">Annual</option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium"
                >
                  Calculate Payments
                </button>
              </form>

              {/* Results */}
              {results && (
                <div className="mt-6 p-6 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold mb-4">Loan Payment Results</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span>Payment Amount:</span><span>${Number(results.paymentAmount).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Frequency:</span><span>{results.paymentFrequency}</span></div>
                    <div className="flex justify-between"><span>Total Paid:</span><span>${Number(results.totalPaid).toFixed(2)}</span></div>
                    <div className="flex justify-between text-orange-600"><span>Total Interest:</span><span>${Number(results.totalInterest).toFixed(2)}</span></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Processed using: {results.source}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS SECTION === */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-12" style={{ fontFamily: 'desyrelregular, serif' }}>
            How It Works
          </h2>
          <div className="grid gap-6">
            {howItWorksSteps.map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex gap-6">
                  <div className={`w-14 h-14 min-w-14 min-h-14 aspect-square rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold`}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === BUILD STORY === */}
      <div className={`how-built-blurb ${isBlurbExpanded ? 'expanded' : ''}`} onClick={() => setIsBlurbExpanded(!isBlurbExpanded)}>
        <h3>How I Built This {isBlurbExpanded ? '−' : '+'}</h3>
        {isBlurbExpanded && (
          <div className="blurb-story">
            <p><strong>Project Origin:</strong> Started as a simple JavaScript calculator, but I rebuilt it using Spring Boot to make it more maintainable and production-aligned.</p>
            <p><strong>Why Transition:</strong> Java was better suited for handling calculation logic, layered structure, and data integrity.</p>
            <p><strong>Front/Back Integration:</strong> The calculator first calls the backend API. If unavailable, it falls back to client-side logic.</p>
            <p><strong>Result:</strong> Evolves from UI-only demo to packaged backend tool — engineered to be reusable, scalable, and structured like a real service.</p>
          </div>
        )}
      </div>

      {/* === README LINK === */}
      <div className="text-center py-8">
        <a
          href="https://github.com/dregraham/resume/blob/main/src/pages/FlexiblePaymentSchedule/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          README.md →
        </a>
      </div>
    </>
  );
};

export default FlexiblePaymentSchedule;