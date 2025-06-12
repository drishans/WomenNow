import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as csvWriter from 'csv-writer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../src')));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// CSV file path
const csvFilePath = path.join(dataDir, 'survey_responses.csv');

// Create CSV writer
const createCsvWriter = csvWriter.createObjectCsvWriter;
const writer = createCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'name', title: 'Name' },
        { id: 'phone', title: 'Phone' },
        { id: 'email', title: 'Email' },
        { id: 'overall_rating', title: 'Overall Rating' },
        { id: 'overall_comments', title: 'Overall Comments' },
        { id: 'food_rating', title: 'Food Rating' },
        { id: 'food_comments', title: 'Food Comments' },
        { id: 'decor_rating', title: 'Decor Rating' },
        { id: 'decor_comments', title: 'Decor Comments' },
        { id: 'entertainment_rating', title: 'Entertainment Rating' },
        { id: 'entertainment_comments', title: 'Entertainment Comments' }
    ],
    append: fs.existsSync(csvFilePath)
});

// Store submitted emails to prevent duplicates
const submittedEmails = new Set<string>();

// Load existing emails on startup
if (fs.existsSync(csvFilePath)) {
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n');
    lines.slice(1).forEach(line => {
        const email = line.split(',')[3]?.trim().replace(/"/g, '');
        if (email) submittedEmails.add(email.toLowerCase());
    });
}

// Survey submission endpoint
app.post('/api/submit-survey', async (req, res) => {
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

        // Write to CSV
        await writer.writeRecords([surveyData]);
        
        // Add email to submitted set
        submittedEmails.add(emailLower);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving survey:', error);
        res.status(500).json({ 
            success: false, 
            error: 'server_error' 
        });
    }
});

// Download CSV endpoint (optional - for admin use)
app.get('/api/download-csv', (req, res) => {
    if (fs.existsSync(csvFilePath)) {
        res.download(csvFilePath, 'survey_responses.csv');
    } else {
        res.status(404).json({ error: 'No survey data found' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});