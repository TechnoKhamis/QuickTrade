#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "=== Testing CashWise API ==="
echo ""

# 1. Register a user
echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Salman Dowaik",
    "email": "salman@example.com",
    "password": "password123"
  }')

echo "$REGISTER_RESPONSE"
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# 2. Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "salman@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE"
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo ""

# 3. Get categories
echo "3. Getting categories..."
curl -s -X GET "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""

# 4. Create income transaction
echo "4. Creating income transaction..."
curl -s -X POST "$BASE_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000.000,
    "type": "INCOME",
    "categoryId": 1,
    "description": "Monthly salary",
    "transactionDate": "2026-02-01",
    "isManual": true
  }' | json_pp
echo ""

# 5. Create expense transaction
echo "5. Creating expense transaction..."
curl -s -X POST "$BASE_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 45.500,
    "type": "EXPENSE",
    "categoryId": 5,
    "description": "Lunch at Nandos with team",
    "transactionDate": "2026-02-26",
    "isManual": true
  }' | json_pp
echo ""

# 6. Get all transactions
echo "6. Getting all transactions..."
curl -s -X GET "$BASE_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""

# 7. Get dashboard stats
echo "7. Getting dashboard stats..."
curl -s -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""

echo "=== Testing Complete ==="
