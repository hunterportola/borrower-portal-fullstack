#!/bin/bash

echo "🔧 Starting Borrower Portal Backend..."

# Check if port 3001 is in use and kill if necessary
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔴 Port 3001 is in use, killing existing process..."
    lsof -ti:3001 | xargs kill -9
    echo "✅ Port 3001 freed"
    sleep 2
fi

echo "🚀 Starting backend server on port 3001..."
npm run dev