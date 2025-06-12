# Dili Haat Survey Site

A simple survey collection website for the Dili Haat South Asian event hosted by WomenNowTV.

## Features
- Contact information collection (name, phone, email)
- 1-5 star ratings with optional text feedback for:
  - Overall Experience
  - Food
  - Decor
  - Entertainment
- Duplicate submission prevention (by email)
- Mobile-responsive design
- Green/blue gradient theme

## Quick Setup (5 minutes)

### 1. Set up Google Sheets
1. Create a new Google Sheet
2. Open Extensions → Apps Script
3. Copy the code from `google-apps-script.js`
4. Run the `setupHeaders()` function once to create column headers
5. Deploy → New Deployment → Web App
   - Execute as: "Me"
   - Who has access: "Anyone"
6. Copy the Web App URL

### 2. Configure Vercel
1. Go to your [Vercel Dashboard](https://vercel.com)
2. Select the project
3. Settings → Environment Variables
4. Add: `GOOGLE_SHEETS_URL` = [Your Web App URL]
5. Redeploy the project

### 3. Access Your Data
- Open your Google Sheet to see responses in real-time
- Download as CSV: File → Download → CSV

## Local Development
```bash
# Install dependencies
npm install

# Test locally (requires Node.js)
npx vercel dev
```

## Project Structure
```
├── api/
│   └── submit-survey.ts    # Serverless function
├── public/
│   ├── index.html         # Survey form
│   ├── styles.css         # Styling
│   └── script.js          # Frontend logic
└── google-apps-script.js  # Google Sheets integration
```

## Live URL
https://dili-haat-survey.vercel.app

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Vercel Serverless Functions
- Data Storage: Google Sheets
- Hosting: Vercel (free tier)