import type { VercelRequest, VercelResponse } from '@vercel/node';

// Store submitted emails in memory to prevent duplicates during the event
const submittedEmails = new Set<string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const surveyData = req.body;
        
        // Check for duplicate submission
        const emailLower = surveyData.email.toLowerCase();
        if (submittedEmails.has(emailLower)) {
            return res.status(400).json({ 
                success: false, 
                error: 'duplicate' 
            });
        }

        // Prepare data for Google Sheets
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        const rowData = [
            timestamp,
            surveyData.name,
            surveyData.phone,
            surveyData.email,
            surveyData.overall_rating,
            surveyData.overall_comments || '',
            surveyData.food_rating,
            surveyData.food_comments || '',
            surveyData.decor_rating,
            surveyData.decor_comments || '',
            surveyData.entertainment_rating,
            surveyData.entertainment_comments || ''
        ];

        // Google Sheets Web App URL (you'll need to replace this)
        const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || '';
        
        if (GOOGLE_SHEETS_URL) {
            // Send to Google Sheets
            const response = await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row: rowData })
            });

            if (!response.ok) {
                console.error('Failed to save to Google Sheets');
            }
        }

        // Add email to submitted set
        submittedEmails.add(emailLower);
        
        // Log for backup
        console.log('Survey submission:', JSON.stringify(surveyData, null, 2));
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error processing survey:', error);
        res.status(500).json({ 
            success: false, 
            error: 'server_error' 
        });
    }
}