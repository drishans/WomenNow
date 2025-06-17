import type { VercelRequest, VercelResponse } from '@vercel/node';

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
        
        // Google Sheets Web App URL
        const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || '';
        
        if (!GOOGLE_SHEETS_URL) {
            console.error('GOOGLE_SHEETS_URL not configured');
            return res.status(500).json({ 
                success: false, 
                error: 'server_error' 
            });
        }

        // Check for duplicate submission in Google Sheets
        const emailLower = surveyData.email.toLowerCase();
        
        try {
            const checkResponse = await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    checkDuplicate: true,
                    email: emailLower 
                })
            });

            if (checkResponse.ok) {
                const result = await checkResponse.json();
                if (result.exists) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'duplicate' 
                    });
                }
            }
        } catch (error) {
            console.error('Error checking for duplicates:', error);
            // Continue anyway - better to risk a duplicate than block submission
        }

        // Prepare data for Google Sheets
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        const rowData = [
            timestamp,
            surveyData.name,
            surveyData.phone,
            surveyData.email,
            surveyData.referralSource || '',
            surveyData.overall_rating,
            surveyData.overall_comments || '',
            surveyData.food_rating,
            surveyData.food_comments || '',
            surveyData.decor_rating,
            surveyData.decor_comments || '',
            surveyData.entertainment_rating,
            surveyData.entertainment_comments || '',
            surveyData.suggestions || ''
        ];

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
            return res.status(500).json({ 
                success: false, 
                error: 'server_error' 
            });
        }
        
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