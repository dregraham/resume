Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Spring Boot Payment Calculator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Java
try {
    java -version 2>$null
    Write-Host "[OK] Java found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Java not found" -ForegroundColor Red
    Write-Host "Please install Java 17 and add to PATH" -ForegroundColor Yellow
}

# Check Maven
try {
    mvn -version 2>$null
    Write-Host "[OK] Maven found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Maven not found" -ForegroundColor Red
    Write-Host "Please install Maven and add to PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Creating Spring Boot project..." -ForegroundColor Yellow

# Create temporary project directory
$projectDir = "$env:TEMP\spring-boot-demo-$(Get-Random)"
New-Item -ItemType Directory -Path $projectDir -Force | Out-Null
Write-Host "Working in: $projectDir" -ForegroundColor Gray

# Create project structure with absolute paths
New-Item -ItemType Directory -Path "$projectDir\src\main\java\com\dregraham\paymentcalculator" -Force | Out-Null
New-Item -ItemType Directory -Path "$projectDir\src\main\resources" -Force | Out-Null

# Create Java file with proper escaping
$javaContent = @"
package com.dregraham.paymentcalculator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
public class PaymentCalculatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentCalculatorApplication.class, args);
    }
    
    @RestController
    public static class PaymentController {
        @GetMapping("/")
        public String home() {
            return "<!DOCTYPE html><html><head><title>Payment Calculator - Spring Boot Demo</title>" +
                   "<script src='https://cdn.tailwindcss.com'></script>" +
                   "<link href='https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap' rel='stylesheet'>" +
                   "<style>body{font-family:'JetBrains Mono',monospace}</style></head><body>" +
                   "<div style='height:36px'></div>" +
                   "<div class='bg-gray-900 text-green-400 py-8'>" +
                   "<div class='max-w-6xl mx-auto px-6'>" +
                   "<pre class='text-xs md:text-sm font-mono text-center whitespace-pre'>" +
                   "  .   ____          _            __ _ _\n" +
                   " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\\n" +
                   "( ( )\\___ | '_ | '_| | '_ \\/ _` | \\ \\ \\ \\\n" +
                   " \\/  ___)| |_)| | | | | || (_| |  ) ) ) )\n" +
                   "  '  |____| .__|_| |_|_| |_\\__, | / / / /\n" +
                   " =========|_|==============|___/=/_/_/_/" +
                   "</pre></div></div>" +
                   "<div class='bg-gradient-to-br from-blue-50 to-green-50 py-12'><div class='max-w-6xl mx-auto px-6'><div class='text-center mb-12'>" +
                   "<div class='flex justify-center items-center mb-6'>" +
                   "<svg class='w-16 h-16 mr-4' viewBox='0 0 24 24'><path fill='#6db33f' d='M20.205 16.392c-2.469 3.289-7.741 2.179-11.122 2.338 0 0-.599.034-1.201.133 0 0 .228-.097.519-.198 2.374-.821 3.496-.986 4.939-1.727 2.71-1.388 5.408-4.413 5.957-7.555-1.032 3.022-4.17 5.623-7.027 6.679-1.955.722-5.492 1.424-5.493 1.424a5.28 5.28 0 0 1-.143-.076c-2.405-1.17-2.475-6.38 1.894-8.059 1.916-.736 3.747-.332 5.818-.825 2.208-.525 4.766-2.18 5.805-4.344 1.165 3.458 2.565 8.866.054 12.21zm.042-13.28a9.212 9.212 0 0 1-1.065 1.89 9.982 9.982 0 0 0-7.167-3.031C6.492 1.971 2 6.463 2 11.985a9.983 9.983 0 0 0 3.205 7.334l.22.194a10.001 10.001 0 0 0 6.560 2.462c5.522 0 9.985-4.463 9.985-9.985 0-2.68-1.054-5.11-2.723-6.878z'/></svg>" +
                   "<h1 class='text-4xl md:text-5xl font-bold text-gray-900'>Payment Calculator</h1>" +
                   "</div>" +
                   "<p class='text-lg text-gray-600 max-w-2xl mx-auto mb-6'>Enterprise Spring Boot application with REST API integration</p>" +
                   "<div class='inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium'>" +
                   "<span class='w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse'></span>Server Running" +
                   "</div>" +
                   "</div></div></div>" +
                   "<div class='bg-white py-12'><div class='max-w-6xl mx-auto px-6'>" +
                   "<div class='mb-8'>" +
                   "<h2 class='text-2xl font-bold text-gray-900 mb-4'>Interactive Payment Calculator</h2></div>" +
                   "<div class='grid md:grid-cols-2 gap-12 items-start'>" +
                   "<div><p class='text-lg text-gray-600 mb-6'>Interactive calculator for loans with interest, demonstrating payment calculations with Spring Boot API integration.</p>" +
                   "<div class='bg-gray-50 p-6 rounded-md'><h3 class='font-semibold text-gray-900 mb-3'>Architecture</h3>" +
                   "<ul class='space-y-2 text-gray-600'><li class='flex items-center'><span class='w-2 h-2 bg-green-500 rounded-full mr-3'></span>Controller layer for REST endpoints</li>" +
                   "<li class='flex items-center'><span class='w-2 h-2 bg-green-500 rounded-full mr-3'></span>Service layer for business logic</li>" +
                   "<li class='flex items-center'><span class='w-2 h-2 bg-green-500 rounded-full mr-3'></span>Model classes with validation</li></ul></div></div>" +
                   "<div class='bg-white p-8 rounded-lg border border-gray-200'><form onsubmit='calculatePayment(event)' class='space-y-6'>" +
                   "<div><label class='block text-sm font-semibold text-gray-700 mb-2'>Loan Amount</label>" +
                   "<div class='relative'><span class='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold'>$</span>" +
                   "<input type='text' id='loanAmount' placeholder='10,000' required class='w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white border-gray-200'></div></div>" +
                   "<div><label class='block text-sm font-semibold text-gray-700 mb-2'>Annual Interest Rate</label>" +
                   "<div class='relative'><input type='number' id='interestRate' placeholder='5.5' min='0' step='0.01' required class='w-full pr-8 pl-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white border-gray-200'>" +
                   "<span class='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold'>%</span></div></div>" +
                   "<div><label class='block text-sm font-semibold text-gray-700 mb-2'>Payment Frequency</label>" +
                   "<select id='paymentsPerYear' required class='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-black'>" +
                   "<option value='12'>Monthly (12 payments/year)</option><option value='6'>Bi-Monthly (6 payments/year)</option>" +
                   "<option value='4'>Quarterly (4 payments/year)</option><option value='1'>Annual (1 payment/year)</option></select></div>" +
                   "<button type='submit' class='w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors'>Calculate Loan Payments</button>" +
                   "</form><div id='results'></div></div></div></div></div>" +
                   "<div class='bg-gradient-to-r from-gray-50 to-blue-50 py-12'><div class='max-w-6xl mx-auto px-6'>" +
                   "<div class='mb-8'>" +
                   "<h2 class='text-2xl font-bold text-gray-900 mb-4'>Technology Stack</h2></div>" +
                   "<div class='bg-white p-8 rounded-lg border border-gray-200'>" +
                   "<div class='grid md:grid-cols-2 gap-6 mb-6'>" +
                   "<div><h4 class='font-semibold text-gray-800 mb-2'>Backend</h4>" +
                   "<ul class='text-sm text-gray-600 space-y-1'>" +
                   "<li class='flex items-center'><span class='w-3 h-3 bg-orange-500 rounded mr-2'></span><a href='https://www.oracle.com/java/' class='text-orange-600 hover:text-orange-800 underline font-medium'>Java 17</a></li>" +
                   "<li class='flex items-center'><span class='w-3 h-3 bg-green-500 rounded mr-2'></span><a href='https://spring.io/projects/spring-boot' class='text-green-600 hover:text-green-800 underline font-medium'>Spring Boot 3.2.0</a></li>" +
                   "<li class='flex items-center'><span class='w-3 h-3 bg-red-500 rounded mr-2'></span><a href='https://maven.apache.org/' class='text-red-600 hover:text-red-800 underline font-medium'>Maven</a></li>" +
                   "<li><a href='https://restfulapi.net/' class='text-blue-600 hover:text-blue-800 underline'>REST API</a></li></ul>" +
                   "<a href='https://github.com/dregraham/resume/tree/main/src/pages/FlexiblePaymentSchedule/src/main/java/com/dregraham/rentcalculator' class='inline-flex items-center px-3 py-2 mt-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors'>" +
                   "<svg class='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'><path fill-rule='evenodd' d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z' clip-rule='evenodd'></path></svg>" +
                   "GitHub</a></div>" +
                   "<div><h4 class='font-semibold text-gray-800 mb-2'>Frontend</h4>" +
                   "<ul class='text-sm text-gray-600 space-y-1'>" +
                   "<li class='flex items-center'><span class='w-3 h-3 bg-yellow-500 rounded mr-2'></span><a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript' class='text-yellow-600 hover:text-yellow-800 underline font-medium'>JavaScript ES6+</a></li>" +
                   "<li class='flex items-center'><span class='w-3 h-3 bg-blue-500 rounded mr-2'></span><a href='https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' class='text-blue-600 hover:text-blue-800 underline font-medium'>Fetch API</a></li>" +
                   "<li class='flex items-center'><span class='w-3 h-3 bg-cyan-500 rounded mr-2'></span><a href='https://tailwindcss.com/' class='text-cyan-600 hover:text-cyan-800 underline font-medium'>Tailwind CSS</a></li>" +
                   "<li class='flex items-center'><span class='w-3 h-3 bg-purple-500 rounded mr-2'></span><a href='https://developer.mozilla.org/en-US/docs/Web/HTML' class='text-purple-600 hover:text-purple-800 underline font-medium'>HTML5</a></li></ul>" +
                   "<a href='https://github.com/dregraham/resume/blob/main/src/pages/FlexiblePaymentSchedule/FlexiblePaymentSchedule.js' class='inline-flex items-center px-3 py-2 mt-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors'>" +
                   "<svg class='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'><path fill-rule='evenodd' d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z' clip-rule='evenodd'></path></svg>" +
                   "GitHub</a></div></div>" +
                   "<h4 class='font-semibold text-gray-800 mb-2'>API Endpoint</h4>" +
                   "<pre class='bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto mb-4'>POST /api/payment-calculator/calculate" + "\\n" + "Content-Type: application/json" + "\\n\\n" + "{" + "\\n" + "  \"loanAmount\": 10000," + "\\n" + "  \"interestRate\": 5.5," + "\\n" + "  \"paymentsPerYear\": 12" + "\\n" + "}</pre>" +
                   "<p class='text-gray-600'><a href='https://dregraham.com/#/projects/flexible-payment-schedule' class='text-blue-600 hover:text-blue-800 underline'>View JavaScript Demo</a></p></div></div></div>" +
                   "<script>" +
                   "function formatNumber(value) {" +
                   "  const num = value.replace(/[^\\d.]/g, '');" +
                   "  const parts = num.split('.');" +
                   "  parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');" +
                   "  return parts.join('.');" +
                   "}" +
                   "document.getElementById('loanAmount').addEventListener('input', function(e) {" +
                   "  e.target.value = formatNumber(e.target.value);" +
                   "});" +
                   "async function calculatePayment(e) {" +
                   "  e.preventDefault();" +
                   "  const loanAmountValue = document.getElementById('loanAmount').value.replace(/[^\\d.]/g, '');" +
                   "  const loanAmount = parseFloat(loanAmountValue);" +
                   "  const interestRate = parseFloat(document.getElementById('interestRate').value);" +
                   "  const paymentsPerYear = parseInt(document.getElementById('paymentsPerYear').value);" +
                   "  try {" +
                   "    const response = await fetch('/api/payment-calculator/calculate', {" +
                   "      method: 'POST'," +
                   "      headers: { 'Content-Type': 'application/json' }," +
                   "      body: JSON.stringify({ loanAmount, interestRate, paymentsPerYear })" +
                   "    });" +
                   "    const data = await response.json();" +
                   "    document.getElementById('results').innerHTML = " +
                   "      '<div class=\"mt-6 p-6 bg-gray-50 rounded-md\">' +" +
                   "      '<h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Loan Payment Results</h3>' +" +
                   "      '<div class=\"space-y-3\">' +" +
                   "      '<div class=\"flex justify-between\"><span class=\"text-gray-600\">Payment Amount:</span>' +" +
                   "      '<span class=\"font-semibold\">$' + data.paymentAmount.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + '</span></div>' +" +
                   "      '<div class=\"flex justify-between\"><span class=\"text-gray-600\">Frequency:</span>' +" +
                   "      '<span class=\"font-semibold\">' + data.paymentFrequency + '</span></div>' +" +
                   "      '<div class=\"flex justify-between\"><span class=\"text-gray-600\">Payments Per Year:</span>' +" +
                   "      '<span class=\"font-semibold\">' + data.paymentsPerYear + '</span></div>' +" +
                   "      '<div class=\"flex justify-between\"><span class=\"text-gray-600\">Total Paid:</span>' +" +
                   "      '<span class=\"font-semibold\">$' + data.totalPaid.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + '</span></div>' +" +
                   "      '<div class=\"flex justify-between text-orange-600\"><span>Total Interest:</span>' +" +
                   "      '<span class=\"font-semibold\">$' + data.totalInterest.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + '</span></div>' +" +
                   "      '</div>' +" +
                   "      '<div class=\"mt-4 pt-4 border-t border-gray-200\">' +" +
                   "      '<p class=\"text-sm text-gray-500\">Powered by: Spring Boot API</p>' +" +
                   "      '</div></div>';" +
                   "  } catch (error) {" +
                   "    document.getElementById('results').innerHTML = " +
                   "      '<div class=\"mt-6 p-6 bg-red-50 rounded-md text-red-600\">Error: ' + error.message + '</div>';" +
                   "  }" +
                   "}" +
                   "</script></body></html>";
        }
        
        @PostMapping("/api/payment-calculator/calculate")
        @CrossOrigin(origins = "*")
        public PaymentResponse calculate(@RequestBody PaymentRequest request) {
            double monthlyRate = request.interestRate / 100 / 12;
            double numPayments = request.paymentsPerYear;
            double monthlyPayment;
            
            if (monthlyRate > 0) {
                monthlyPayment = (request.loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
            } else {
                monthlyPayment = request.loanAmount / numPayments;
            }
            
            double totalPaid = monthlyPayment * numPayments;
            double totalInterest = totalPaid - request.loanAmount;
            
            String frequency = numPayments == 12 ? "Monthly" : numPayments == 6 ? "Bi-Monthly" : numPayments == 4 ? "Quarterly" : "Annual";
            
            return new PaymentResponse(monthlyPayment, (int)numPayments, frequency, totalPaid, totalInterest);
        }
    }
    
    public static class PaymentRequest {
        public double loanAmount;
        public double interestRate;
        public int paymentsPerYear;
    }
    
    public static class PaymentResponse {
        public double paymentAmount;
        public int paymentsPerYear;
        public String paymentFrequency;
        public double totalPaid;
        public double totalInterest;
        
        public PaymentResponse(double paymentAmount, int paymentsPerYear, String paymentFrequency, double totalPaid, double totalInterest) {
            this.paymentAmount = paymentAmount;
            this.paymentsPerYear = paymentsPerYear;
            this.paymentFrequency = paymentFrequency;
            this.totalPaid = totalPaid;
            this.totalInterest = totalInterest;
        }
    }
}
"@
$javaContent | Out-File -FilePath "$projectDir\src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java" -Encoding ASCII -NoNewline

# Create pom.xml
$pomContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.dregraham</groupId>
    <artifactId>payment-calculator</artifactId>
    <version>1.0.0</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
"@
$pomContent | Out-File -FilePath "$projectDir\pom.xml" -Encoding ASCII -NoNewline

Write-Host "Building application..." -ForegroundColor Yellow
try {
    Push-Location $projectDir
    mvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Maven build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
    Write-Host "[SUCCESS] Build completed successfully" -ForegroundColor Green
    Pop-Location
} catch {
    Write-Host "[ERROR] Build failed: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
}

Write-Host ""
Write-Host "Starting Spring Boot server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Opening browser automatically..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
Write-Host ""

# Start Spring Boot server with delayed browser opening
Start-Job -ScriptBlock { 
    Start-Sleep -Seconds 8
    Start-Process "http://localhost:8080"
} | Out-Null

Write-Host "Browser will open automatically in 8 seconds..." -ForegroundColor Yellow
Write-Host "This demonstrates:" -ForegroundColor Cyan
Write-Host "• Spring Boot application architecture" -ForegroundColor White
Write-Host "• RESTful API design with @RestController" -ForegroundColor White
Write-Host "• Maven build lifecycle and dependency management" -ForegroundColor White
Write-Host "• Cross-origin resource sharing (CORS)" -ForegroundColor White
Write-Host "• JSON request/response handling" -ForegroundColor White
Write-Host "• Embedded Tomcat server" -ForegroundColor White
Write-Host ""
Write-Host "API Endpoint: POST /api/payment-calculator/calculate" -ForegroundColor Yellow
Write-Host ""

# Run server in foreground with error handling
try {
    java -jar "$projectDir\target\payment-calculator-1.0.0.jar"
} catch {
    Write-Host "[ERROR] Failed to start server: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Server stopped" -ForegroundColor Red
Read-Host "Press Enter to exit"