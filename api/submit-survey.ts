import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// Store submitted emails in memory (resets on each deployment)
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

        // In production, we'll store data differently
        // For now, just add to memory and return success
        submittedEmails.add(emailLower);
        
        // Log the submission (visible in Vercel logs)
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