#!/bin/bash

BASE_URL="http://localhost:5000/api"
EMAIL="john.doe@example.com"
PASSWORD="password123"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting API Tests..."

# 1. Login
echo -n "🔑 Logging in... "
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}FAILED${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
else
  echo -e "${GREEN}SUCCESS${NC}"
fi

# Function to test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  
  echo -n "Testing $description ($method $endpoint)... "
  
  RESPONSE=$(curl -s -X $method "$BASE_URL$endpoint" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
    
  # Check if response contains error
  if [[ $RESPONSE == *"statusCode"* && $RESPONSE != *"200"* && $RESPONSE != *"201"* ]]; then
    echo -e "${RED}FAILED${NC}"
    echo "Response: $RESPONSE"
  else
    echo -e "${GREEN}SUCCESS${NC}"
  fi
}

# 2. Test Endpoints
test_endpoint "GET" "/auth/profile" "Get Current User"
test_endpoint "GET" "/expenses" "Get Expenses"
test_endpoint "GET" "/income" "Get Income"
test_endpoint "GET" "/savings/goals" "Get Savings Goals"
test_endpoint "GET" "/subscriptions" "Get Subscriptions"
test_endpoint "GET" "/tags" "Get Tags"
test_endpoint "GET" "/payment-methods" "Get Payment Methods"
test_endpoint "GET" "/accounts" "Get Accounts"
test_endpoint "GET" "/analytics/dashboard" "Get Dashboard Analytics"

echo "✅ All tests completed!"
