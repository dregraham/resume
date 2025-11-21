@echo off
echo Starting
echo Java check:
java -version
echo Maven check:
mvn -version
echo Creating files:
mkdir src\main\java\com\dregraham\paymentcalculator 2>nul
echo package com.dregraham.paymentcalculator; > src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo import org.springframework.boot.SpringApplication; >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo import org.springframework.boot.autoconfigure.SpringBootApplication; >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo @SpringBootApplication >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo public class PaymentCalculatorApplication { >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo     public static void main(String[] args) { >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo         SpringApplication.run(PaymentCalculatorApplication.class, args); >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo     } >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo } >> src\main\java\com\dregraham\paymentcalculator\PaymentCalculatorApplication.java
echo Building:
mvn clean package -DskipTests
echo Starting server:
java -jar target\payment-calculator-1.0.0.jar
echo Done
set /p dummy=Press Enter to exit: