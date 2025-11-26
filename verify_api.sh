#!/bin/bash

echo "1. Signup User"
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' > signup.json
echo ""
cat signup.json
echo ""

TOKEN=$(cat signup.json | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

echo "2. Create Habit"
curl -X POST http://localhost:5000/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Drink Water","category":"Health"}'
echo ""

echo "3. Get Habits"
curl -X GET http://localhost:5000/api/habits \
  -H "Authorization: Bearer $TOKEN"
echo ""
