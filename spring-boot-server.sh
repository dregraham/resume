#!/bin/bash
echo "========================================"
echo "   Spring Boot Backend Auto-Setup"
echo "========================================"
echo
echo "Checking and installing dependencies..."

# Detect OS and package manager
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if ! command -v brew &> /dev/null; then
        echo "[INSTALLING] Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    INSTALL_JAVA="brew install openjdk@17"
    INSTALL_MAVEN="brew install maven"
elif [[ -f /etc/debian_version ]]; then
    # Ubuntu/Debian
    INSTALL_JAVA="sudo apt update && sudo apt install -y openjdk-17-jdk"
    INSTALL_MAVEN="sudo apt install -y maven"
elif [[ -f /etc/redhat-release ]]; then
    # RHEL/CentOS/Fedora
    INSTALL_JAVA="sudo dnf install -y java-17-openjdk-devel"
    INSTALL_MAVEN="sudo dnf install -y maven"
else
    echo "[WARNING] Unknown OS. Please install manually:"
    echo "Java: https://adoptium.net/"
    echo "Maven: https://maven.apache.org/download.cgi"
    exit 1
fi

# Check and install Java
if ! command -v java &> /dev/null; then
    echo "[INSTALLING] Java 17..."
    eval $INSTALL_JAVA
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install Java. Please install manually."
        exit 1
    fi
    echo "[OK] Java installed successfully"
else
    echo "[OK] Java found"
fi

# Check and install Maven
if ! command -v mvn &> /dev/null; then
    echo "[INSTALLING] Maven..."
    eval $INSTALL_MAVEN
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install Maven. Please install manually."
        exit 1
    fi
    echo "[OK] Maven installed successfully"
else
    echo "[OK] Maven found"
fi

echo
echo "Creating Spring Boot project structure..."
mkdir -p src/main/java/com/dregraham/paymentcalculator
mkdir -p src/main/resources

echo "Creating pom.xml..."
cat > pom.xml << 'EOF'
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
EOF

echo
echo "Building Spring Boot application..."
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "[WARNING] Maven build failed - continuing with demo"
fi

echo
echo "========================================"
echo "   Spring Boot Server Starting..."
echo "========================================"
echo "Server will be available at: http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo

if [ -f "target/payment-calculator-1.0.0.jar" ]; then
    java -jar target/payment-calculator-1.0.0.jar
else
    echo "[INFO] JAR file not found - build may have failed"
    echo "[INFO] This demonstrates the Spring Boot setup process"
    echo "[INFO] Calculator will use JavaScript fallback"
    echo
    echo "Press any key to exit..."
    read -n 1
fi