import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // For now, return a message about data storage
    res.status(200).json({ 
        message: 'CSV download is not available in the serverless environment. Survey data is logged to Vercel logs.',
        note: 'For production use, consider integrating with a database or external storage service.'
    });
}