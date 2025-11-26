#!/bin/bash
EMAIL="test$(date +%s)@example.com"
echo "Signup with $EMAIL"
curl -v -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"password123\"}"
