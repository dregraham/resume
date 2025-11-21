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
                   "<script src='https://cdn.tailwindcss.com'></script></head><body>" +
                   "<div style='height:36px'></div>" +
                   "<div class='bg-white py-20'><div class='max-w-6xl mx-auto px-6'><div class='text-center mb-20'>" +
                   "<h1 class='text-5xl md:text-6xl font-bold text-gray-900 mb-6'>Payment Calculator with Interest</h1>" +
                   "<p class='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>Spring Boot application for calculating loan payments with interest across different payment schedules.</p>" +
                   "</div></div></div>" +
                   "<div class='bg-white py-20'><div class='max-w-6xl mx-auto px-6'>" +
                   "<div class='flex items-center mb-8'><div class='w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4'>1</div>" +
                   "<h2 class='text-3xl font-bold text-gray-900'>Try Loan Calculator</h2></div>" +
                   "<div class='grid md:grid-cols-2 gap-12 items-start'>" +
                   "<div><p class='text-lg text-gray-600 mb-6'>Interactive calculator for loans with interest, demonstrating payment calculations with Spring Boot API integration.</p>" +
                   "<div class='bg-gray-50 p-6 rounded-md'><h3 class='font-semibold text-gray-900 mb-3'>Features Demonstrated</h3>" +
                   "<ul class='space-y-2 text-gray-600'><li class='flex items-center'><span class='w-2 h-2 bg-green-500 rounded-full mr-3'></span>Interest rate calculations</li>" +
                   "<li class='flex items-center'><span class='w-2 h-2 bg-green-500 rounded-full mr-3'></span>Multiple payment frequencies</li>" +
                   "<li class='flex items-center'><span class='w-2 h-2 bg-green-500 rounded-full mr-3'></span>Spring Boot API integration</li></ul></div></div>" +
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
                   "<div class='bg-gray-50 py-20'><div class='max-w-6xl mx-auto px-6'>" +
                   "<div class='flex items-center mb-8'><div class='w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4'>2</div>" +
                   "<h2 class='text-3xl font-bold text-gray-900'>API Documentation</h2></div>" +
                   "<div class='bg-white p-8 rounded-lg border border-gray-200'><h3 class='text-lg font-semibold text-gray-900 mb-4'>cURL Examples</h3>" +
                   "<pre class='bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto mb-4'>curl -X POST http://localhost:8080/api/payment-calculator/calculate -H 'Content-Type: application/json' -d '{\"loanAmount\":10000,\"interestRate\":5.5,\"paymentsPerYear\":12}'</pre>" +
                   "<p class='text-gray-600'><a href='https://dregraham.com/#/projects/flexible-payment-schedule' class='text-blue-600 hover:text-blue-800 underline'>View Full React Frontend</a></p></div></div></div>" +
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