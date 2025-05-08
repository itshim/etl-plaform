#!/bin/bash

# Start backend server
cd backend
./setup.sh &

# Start frontend server
cd ../frontend
npm start 