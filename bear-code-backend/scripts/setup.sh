#!/bin/bash

# Bear Code Backend Setup Script
# This script helps you set up the development environment

set -e

echo "🐻 Bear Code Backend Setup"
echo "=========================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update .env with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env
    else
        # Linux
        sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env
    fi
    
    echo "✅ .env file created with generated JWT secret"
    echo ""
    echo "⚠️  Please update the following in .env:"
    echo "   - MONGODB_URI (if not using localhost)"
    echo "   - PINECONE_API_KEY (for semantic search)"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Create logs directory
if [ ! -d logs ]; then
    echo "📁 Creating logs directory..."
    mkdir -p logs
    echo "✅ Logs directory created"
    echo ""
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running"
        echo ""
        echo "To start MongoDB with Docker:"
        echo "  docker run -d -p 27017:27017 --name mongodb mongo:7"
        echo ""
        echo "Or use Docker Compose:"
        echo "  docker-compose up -d mongo"
    fi
else
    echo "⚠️  mongosh not found, skipping MongoDB check"
    echo "   Make sure MongoDB is running before starting the server"
fi
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✅ Docker is available"
    echo ""
    echo "To start the full stack with Docker Compose:"
    echo "  docker-compose up -d"
    echo ""
else
    echo "⚠️  Docker not found"
    echo "   Install Docker to use containerized deployment"
    echo ""
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
echo "✅ Build completed"
echo ""

echo "=========================="
echo "✅ Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Start MongoDB (if not running)"
echo "3. Run: npm run dev"
echo ""
echo "For more information, see QUICKSTART.md"
echo ""
echo "Happy coding! 🐻"
