# Dili Haat Survey Site

A survey collection website for the Dili Haat South Asian event hosted by WomenNowTV.

## Features
- Contact information collection (name, phone, email)
- Star ratings (1-5) with text feedback for:
  - Overall Experience
  - Food
  - Decor
  - Entertainment
- Duplicate submission prevention (by email)
- CSV data export
- Mobile-responsive design
- Green/blue color theme

## Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

## Data Access
Survey responses are stored in CSV format. To download:
- Navigate to `/api/download-csv` when running the server

## Tech Stack
- Frontend: HTML, TypeScript, CSS
- Backend: Node.js, Express, TypeScript
- Data Storage: CSV files
- Hosting: Vercel