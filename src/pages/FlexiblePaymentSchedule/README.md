# Flexible Payment Calculator

A full-stack loan payment calculator built with Spring Boot REST API and React frontend, demonstrating modern Java development practices and financial calculation algorithms.

## 🎯 Project Overview

This application calculates loan payments using standard amortization formulas with configurable payment frequencies. It showcases enterprise Java development patterns with a responsive React frontend and automated backend setup scripts.

## 🏗️ Architecture

### Backend (Spring Boot 3.2)
- **Controller Layer**: REST endpoints with proper HTTP methods and JSON handling
- **Service Layer**: Business logic separation with financial calculation algorithms  
- **Model Layer**: Validated DTOs with comprehensive error handling
- **Configuration**: CORS setup for cross-origin requests and dependency injection

### Frontend (React 18)
- **Component Architecture**: Functional components with React hooks
- **State Management**: useState for form data and calculation results
- **API Integration**: Fetch API with fallback to JavaScript calculations
- **Responsive Design**: Tailwind CSS with mobile-first approach

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 LTS | Runtime environment with modern language features |
| Spring Boot | 3.2.0 | Application framework with auto-configuration |
| Maven | 3.x | Build automation and dependency management |
| React | 18.x | Frontend UI framework with component architecture |
| Tailwind CSS | 3.x | Utility-first CSS framework for styling |

## 📁 Project Structure

```
FlexiblePaymentSchedule/
├── src/main/java/com/dregraham/rentcalculator/
│   ├── controller/
│   │   └── RentCalculatorController.java    # REST API endpoints
│   ├── service/
│   │   └── RentCalculatorService.java       # Business logic layer
│   ├── model/
│   │   ├── RentCalculationRequest.java      # Request DTO with validation
│   │   └── RentCalculationResponse.java     # Response DTO
│   └── PaymentCalculatorApplication.java    # Spring Boot main class
├── FlexiblePaymentSchedule.js               # React frontend component
├── pom.xml                                  # Maven configuration
└── README.md                                # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+ (for React development)

### Backend Setup
1. **Download automated setup:**
   - Windows: [spring-boot-server.exe](https://dregraham.com/spring-boot-server.exe)
   - Mac/Linux: [spring-boot-server.sh](https://dregraham.com/spring-boot-server.sh)

2. **Manual setup:**
   ```bash
   mvn clean package -DskipTests
   java -jar target/payment-calculator-1.0.0.jar
   ```

3. **API will be available at:** `http://localhost:8080`

### Frontend Integration
The React component automatically detects if the Spring Boot API is running and falls back to JavaScript calculations if not available.

## 📊 API Documentation

### Calculate Payment Schedule
**Endpoint:** `POST /api/payment-calculator/calculate`

**Request Body:**
```json
{
  "loanAmount": 10000.00,
  "interestRate": 5.5,
  "paymentsPerYear": 12
}
```

**Response:**
```json
{
  "paymentAmount": 856.07,
  "paymentsPerYear": 12,
  "paymentFrequency": "Monthly",
  "totalPaid": 10272.84,
  "totalInterest": 272.84
}
```

## 🧮 Financial Calculations

The application implements standard loan amortization formulas:

```java
// Monthly payment calculation
double periodicRate = annualRate / paymentsPerYear;
double payment = (principal * periodicRate) / (1 - Math.pow(1 + periodicRate, -paymentsPerYear));
```

**Supported Payment Frequencies:**
- Monthly (12 payments/year)
- Bi-Monthly (6 payments/year)  
- Quarterly (4 payments/year)
- Annual (1 payment/year)

## 🔧 Key Features

### Backend Implementation
- `@Valid` annotations with `@NotNull`, `@DecimalMin` constraints
- `ResponseEntity` with proper HTTP status codes
- `@CrossOrigin` configuration for React integration
- `@Autowired` service layer dependency injection

### Development Practices
- Controller → Service → Model layered architecture
- DTO pattern for request/response objects
- Error handling with try/catch and fallback logic
- React hooks (useState) with form validation

## 🎨 Frontend Features

- **Interactive Calculator**: Real-time input validation and formatting
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Integration**: Seamless backend communication with JavaScript fallback
- **Professional UI**: Clean, engineering-focused design without unnecessary visual elements

## 📝 Development Notes

This project demonstrates practical Spring Boot development skills including:
- RESTful API design with proper HTTP methods
- Bean validation and error handling
- Service layer architecture and dependency injection
- Cross-origin resource sharing (CORS) configuration
- Integration with modern frontend frameworks

The React frontend showcases:
- Modern functional component patterns
- State management with hooks
- API integration with error handling
- Responsive design principles

## 🔗 Links

- **Live Demo**: [dregraham.com/projects/flexible-payment-schedule](https://dregraham.com/#/projects/flexible-payment-schedule)
- **Source Code**: [GitHub Repository](https://github.com/dregraham/resume/tree/main/src/pages/FlexiblePaymentSchedule)
- **Portfolio**: [dregraham.com](https://dregraham.com)

---

Built by [Dre Graham](https://github.com/dregraham) - Cloud Engineer & Full-Stack Developer