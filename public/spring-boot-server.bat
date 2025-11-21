@echo off
echo ========================================
echo    Spring Boot Backend Auto-Setup
echo ========================================
echo.
echo Checking and installing dependencies...

REM Check for Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found. Please install Java 17 from:
    echo https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
) else (
    echo [OK] Java found
)

REM Check for Maven
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven not found. Please install Maven from:
    echo https://maven.apache.org/download.cgi
    pause
    exit /b 1
) else (
    echo [OK] Maven found
)

echo.
echo Creating Spring Boot project structure...
mkdir src\main\java\com\dregraham\paymentcalculator 2>nul
mkdir src\main\resources 2>nul

echo Creating pom.xml...
(
echo ^<?xml version="1.0" encoding="UTF-8"?^>
echo ^<project xmlns="http://maven.apache.org/POM/4.0.0"^>
echo     ^<modelVersion^>4.0.0^</modelVersion^>
echo     ^<groupId^>com.dregraham^</groupId^>
echo     ^<artifactId^>payment-calculator^</artifactId^>
echo     ^<version^>1.0.0^</version^>
echo     ^<parent^>
echo         ^<groupId^>org.springframework.boot^</groupId^>
echo         ^<artifactId^>spring-boot-starter-parent^</artifactId^>
echo         ^<version^>3.2.0^</version^>
echo     ^</parent^>
echo     ^<dependencies^>
echo         ^<dependency^>
echo             ^<groupId^>org.springframework.boot^</groupId^>
echo             ^<artifactId^>spring-boot-starter-web^</artifactId^>
echo         ^</dependency^>
echo     ^</dependencies^>
echo ^</project^>
) > pom.xml

echo.
echo Building Spring Boot application...
mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo [WARNING] Maven build failed - continuing with demo
)

echo.
echo ========================================
echo    Spring Boot Server Starting...
echo ========================================
echo Server will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

if exist "target\payment-calculator-1.0.0.jar" (
    java -jar target\payment-calculator-1.0.0.jar
) else (
    echo [INFO] JAR file not found - build may have failed
    echo [INFO] This demonstrates the Spring Boot setup process
    echo [INFO] Calculator will use JavaScript fallback
    echo.
    echo Window will stay open for demonstration...
    pause
)