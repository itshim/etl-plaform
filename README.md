# ETL Platform

A web-based platform for data processing and visualization that allows users to upload, transform, and visualize their data.

## Features

- User authentication (register/login)
- File upload support for CSV and Excel files
- Data preview and transformation
- Interactive data visualization
- Data download capabilities

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express and TypeScript
- Database: PostgreSQL
- Data Processing: DataFrame
- Visualization: Chart.js

## Project Structure

```
etl-platform/
├── frontend/           # React frontend application
├── backend/           # Node.js backend application
└── README.md         # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```