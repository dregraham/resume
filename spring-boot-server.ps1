# Spring Boot Server Setup and Demo
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Spring Boot Backend Auto-Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check for Java
try {
    $javaVersion = java -version 2>&1
    Write-Host "[OK] Java found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Java not found. Please install Java 17 from:" -ForegroundColor Red
    Write-Host "https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check for Maven
try {
    $mavenVersion = mvn -version 2>&1
    Write-Host "[OK] Maven found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Maven not found. Please install Maven from:" -ForegroundColor Red
    Write-Host "https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Creating Spring Boot project structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "src\main\java\com\dregraham\paymentcalculator" -Force | Out-Null
New-Item -ItemType Directory -Path "src\main\resources" -Force | Out-Null

Write-Host "Creating pom.xml..." -ForegroundColor Cyan
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
</project>
"@
$pomContent | Out-File -FilePath "pom.xml" -Encoding UTF8

Write-Host ""
Write-Host "Building Spring Boot application..." -ForegroundColor Cyan
$buildResult = mvn clean package -DskipTests 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Maven build failed - continuing with demo" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Spring Boot Server Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "target\payment-calculator-1.0.0.jar") {
    java -jar target\payment-calculator-1.0.0.jar
} else {
    Write-Host "[INFO] JAR file not found - build may have failed" -ForegroundColor Yellow
    Write-Host "[INFO] This demonstrates the Spring Boot setup process" -ForegroundColor Yellow
    Write-Host "[INFO] Calculator will use JavaScript fallback" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Window will stay open for demonstration..." -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
}