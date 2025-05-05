# Health Insurance Quoting System

A Next.js application for health insurance quoting with dynamic filtering and plan recommendations.

## Database Setup

This application uses PostgreSQL for data storage. Follow these steps to set up the database:

1. **Install PostgreSQL** if you don't have it already.

2. **Create a new database**:
   \`\`\`sql
   CREATE DATABASE health_insurance_db;
   \`\`\`

3. **Set up environment variables**:
   Create a `.env.local` file in the root of your project with the following variables:
   \`\`\`
   POSTGRES_URL=postgresql://username:password@localhost:5432/health_insurance_db
   \`\`\`
   Replace `username`, `password`, and `health_insurance_db` with your PostgreSQL credentials and database name.

4. **Initialize the database**:
   - Start the application: `npm run dev`
   - Navigate to `/admin/database-setup` in your browser
   - Click "Initialize Schema" to create all required tables
   - Click "Seed Database" to populate the database with sample data

## Running the Application

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Admin dashboard for managing companies, plans, health conditions, medications, questions, and eligibility rules
- Agent portal for creating quotes based on client health information
- Dynamic filtering of plans based on eligibility rules
- Plan recommendations based on client data
