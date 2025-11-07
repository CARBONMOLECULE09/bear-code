#!/bin/bash

# Bear Code API Test Script
# Quick script to test all major API endpoints

set -e

BASE_URL="http://localhost:3000/api/v1"
EMAIL="test@example.com"
PASSWORD="SecurePass123"
NAME="Test User"

echo "🐻 Bear Code API Test"
echo "===================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH=$(curl -s "$BASE_URL/health")
if echo "$HEALTH" | grep -q "success"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi
echo ""

# Register user
echo "2. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}")

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ User registered${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
else
    # Try login if user already exists
    echo -e "${YELLOW}⚠️  User might already exist, trying login...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
    
    if echo "$LOGIN_RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✅ Login successful${NC}"
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    else
        echo -e "${RED}❌ Registration and login failed${NC}"
        echo "$LOGIN_RESPONSE"
        exit 1
    fi
fi
echo ""

# Get profile
echo "3. Getting user profile..."
PROFILE=$(curl -s "$BASE_URL/users/profile" \
    -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE" | grep -q "success"; then
    echo -e "${GREEN}✅ Profile retrieved${NC}"
    echo "$PROFILE" | grep -o '"email":"[^"]*' | cut -d'"' -f4
else
    echo -e "${RED}❌ Failed to get profile${NC}"
    exit 1
fi
echo ""

# Get credit balance
echo "4. Checking credit balance..."
BALANCE=$(curl -s "$BASE_URL/credits/balance" \
    -H "Authorization: Bearer $TOKEN")

if echo "$BALANCE" | grep -q "balance"; then
    echo -e "${GREEN}✅ Balance retrieved${NC}"
    echo "$BALANCE" | grep -o '"balance":[0-9]*' | cut -d':' -f2
else
    echo -e "${RED}❌ Failed to get balance${NC}"
    exit 1
fi
echo ""

# Index code
echo "5. Indexing code..."
INDEX_RESPONSE=$(curl -s -X POST "$BASE_URL/search/index" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "code": "function hello() { return \"world\"; }",
        "language": "javascript",
        "metadata": {
            "fileName": "hello.js",
            "projectName": "test-project"
        }
    }')

if echo "$INDEX_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Code indexed${NC}"
else
    echo -e "${YELLOW}⚠️  Code indexing might have failed (check if Pinecone is configured)${NC}"
fi
echo ""

# Get documents
echo "6. Getting indexed documents..."
DOCUMENTS=$(curl -s "$BASE_URL/search/documents" \
    -H "Authorization: Bearer $TOKEN")

if echo "$DOCUMENTS" | grep -q "success"; then
    echo -e "${GREEN}✅ Documents retrieved${NC}"
else
    echo -e "${RED}❌ Failed to get documents${NC}"
fi
echo ""

# Get user stats
echo "7. Getting user stats..."
STATS=$(curl -s "$BASE_URL/users/stats" \
    -H "Authorization: Bearer $TOKEN")

if echo "$STATS" | grep -q "success"; then
    echo -e "${GREEN}✅ Stats retrieved${NC}"
    echo "$STATS"
else
    echo -e "${RED}❌ Failed to get stats${NC}"
fi
echo ""

echo "===================="
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Access Token (save this for manual testing):"
echo "$TOKEN"
echo ""
echo "You can now use this token to test other endpoints:"
echo "  curl $BASE_URL/users/profile -H \"Authorization: Bearer $TOKEN\""
