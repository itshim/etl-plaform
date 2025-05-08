#!/bin/bash

DB_NAME="mydb"
CONN_STR="postgresql://himanshumishra:postgres@localhost:5432/postgres"

# Create uploads directory
mkdir -p uploads

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOL

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=himanshumishra
DB_PASSWORD=postgres
DB_DATABASE=$DB_NAME

# JWT Configuration
JWT_SECRET=xJkF2U6nyOrEJcM3VJp_hB7E5FOSQ6lQq9WZ8D1Gxiq4DwKf-KxqIgJ3zYVFu7emDJbH7u5gXDwhE-VSGNwOfQ
JWT_EXPIRATION=1d

# Application Configuration
PORT=3001
NODE_ENV=development
EOL
fi

if ! psql "$CONN_STR" -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
  psql "$CONN_STR" -c "CREATE DATABASE $DB_NAME"
  echo "Database $DB_NAME created."
else
  echo "Database $DB_NAME already exists."
fi

# Create database if it doesn't exist
# psql postgresql://himanshumishra:postgres@localhost:5432/postgres -c "CREATE DATABASE etl_platform;" || true

# Start the development server
npm run start:debug