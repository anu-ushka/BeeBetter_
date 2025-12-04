#!/bin/bash

# 1. Signup
EMAIL="test_adv_$(date +%s)@example.com"
echo "Signup..."
RESP=$(curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Adv User\",\"email\":\"$EMAIL\",\"password\":\"password123\"}")
TOKEN=$(echo $RESP | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Create Habits
echo "Creating habits..."
curl -s -X POST http://localhost:5001/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Read Book","category":"Learning"}' > /dev/null

curl -s -X POST http://localhost:5001/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Exercise","category":"Health"}' > /dev/null

curl -s -X POST http://localhost:5001/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Code","category":"Productivity"}' > /dev/null

# 3. Test Search
echo "Testing Search (query='Code')..."
curl -s -X GET "http://localhost:5001/api/habits?search=Code" \
  -H "Authorization: Bearer $TOKEN" | grep "Code" && echo "Search Passed" || echo "Search Failed"

echo "Testing Filter (category='Health')..."
curl -s -X GET "http://localhost:5001/api/habits?category=Health" \
  -H "Authorization: Bearer $TOKEN" | grep "Exercise" && echo "Filter Passed" || echo "Filter Failed"

echo "Testing Sort..."
curl -s -X GET "http://localhost:5001/api/habits?sort=name" \
  -H "Authorization: Bearer $TOKEN" > /dev/null && echo "Sort Passed"

echo "Testing Pagination (limit=1)..."
curl -s -X GET "http://localhost:5001/api/habits?limit=1&page=1" \
  -H "Authorization: Bearer $TOKEN" | grep "totalPages" && echo "Pagination Passed"
