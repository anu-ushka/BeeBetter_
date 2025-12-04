#!/bin/bash

# Base URL
BASE_URL="http://localhost:5001/api"

# 1. Signup User (Reuse or Create New)
echo "1. Signup User"
curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Journal User","email":"journal@example.com","password":"password123"}' > journal_user.json
echo ""
TOKEN=$(cat journal_user.json | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# 2. Create Journal Entry
echo "2. Create Journal Entry"
curl -s -X POST $BASE_URL/journals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"My First Entry","content":"Today was a great day!","mood":"Happy","tags":["personal","reflection"]}' > journal_entry.json
echo ""
cat journal_entry.json
echo ""
JOURNAL_ID=$(cat journal_entry.json | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Journal ID: $JOURNAL_ID"
echo ""

# 3. Create Another Journal Entry (for pagination/search)
echo "3. Create Another Journal Entry"
curl -s -X POST $BASE_URL/journals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Sad Day","content":"Feeling a bit down today.","mood":"Sad","tags":["personal"]}'
echo ""

# 4. Get All Journals (Default)
echo "4. Get All Journals"
curl -s -X GET $BASE_URL/journals \
  -H "Authorization: Bearer $TOKEN"
echo ""

# 5. Search Journals
echo "5. Search Journals (query='great')"
curl -s -X GET "$BASE_URL/journals?search=great" \
  -H "Authorization: Bearer $TOKEN"
echo ""

# 6. Filter Journals by Mood
echo "6. Filter Journals (mood='Sad')"
curl -s -X GET "$BASE_URL/journals?mood=Sad" \
  -H "Authorization: Bearer $TOKEN"
echo ""

# 7. Update Journal Entry
echo "7. Update Journal Entry"
curl -s -X PUT $BASE_URL/journals/$JOURNAL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"My Updated Entry","mood":"Excited"}'
echo ""

# 8. Delete Journal Entry
echo "8. Delete Journal Entry"
curl -s -X DELETE $BASE_URL/journals/$JOURNAL_ID \
  -H "Authorization: Bearer $TOKEN"
echo ""

# 9. Verify Deletion
echo "9. Verify Deletion (Should be empty or less count)"
curl -s -X GET $BASE_URL/journals \
  -H "Authorization: Bearer $TOKEN"
echo ""
