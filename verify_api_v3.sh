#!/bin/bash
EMAIL="test$(date +%s)@example.com"
echo "Signup with $EMAIL"
curl -v -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"password123\"}" > signup_v3.json
echo ""
cat signup_v3.json
echo ""

TOKEN=$(cat signup_v3.json | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

echo "2. Create Habit"
curl -v -X POST http://localhost:5001/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Drink Water","category":"Health"}'
echo ""

echo "3. Get Habits"
curl -v -X GET http://localhost:5001/api/habits \
  -H "Authorization: Bearer $TOKEN"
echo ""
