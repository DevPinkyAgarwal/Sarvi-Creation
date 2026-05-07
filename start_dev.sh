#!/bin/bash

# Sarvi Creation Development Startup Script

echo "Starting Sarvi Creation Development Servers..."

# Function to kill all background processes on exit
cleanup() {
    echo "Shutting down servers..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT

# Start Backend
echo "Starting Backend..."
(cd backend && npm run dev) &

# Start Unified Store
echo "Starting Unified Store..."
(cd frontend && npm run dev) &

echo "All servers are starting in the background."
echo "Press Ctrl+C to stop all servers."

# Wait for all background processes
wait
