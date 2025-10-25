const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API endpoint to scrape BLS.gov career data
app.post('/api/scrape-career', async (req, res) => {
    const startTime = Date.now();

    try {
        const { url: rawUrl } = req.body;

        if (!rawUrl) {
            return res.status(400).json({
                error: 'URL is required'
            });
        }

        // Normalize and validate URL
        let parsedUrl;
        try {
            parsedUrl = new URL(rawUrl);
        } catch (e) {
            return res.status(400).json({
                error: 'Invalid URL format. Please provide a valid BLS.gov OOH URL.'
            });
        }

        // Validate hostname
        if (!/^(www\.)?bls\.gov$/i.test(parsedUrl.hostname)) {
            return res.status(400).json({
                error: 'URL must be from bls.gov domain'
            });
        }

        // Validate path - must be under /ooh/
        if (!/^\/ooh\//i.test(parsedUrl.pathname)) {
            return res.status(400).json({
                error: 'URL must be a BLS Occupational Outlook Handbook page (path should start with /ooh/)'
            });
        }

        // Validate that it's an .htm page (allow optional trailing slash)
        if (!/\.htm\/?$/i.test(parsedUrl.pathname)) {
            return res.status(400).json({
                error: 'URL must be a BLS OOH page ending in .htm'
            });
        }

        // Normalize URL: force https, remove trailing slash after .htm
        const normalizedPath = parsedUrl.pathname.replace(/\/$/, '');
        const normalizedUrl = `https://${parsedUrl.hostname}${normalizedPath}`;

        console.log(`Fetching career data from: ${normalizedUrl}`);

        // Fetch the HTML content with User-Agent header and timeout
        const response = await fetch(normalizedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 15000 // 15 second timeout
        });

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({
                    error: 'Career page not found. Please check the URL and try again.'
                });
            }
            if (response.status === 403 || response.status === 429) {
                return res.status(503).json({
                    error: 'BLS.gov is temporarily unavailable. Please try again in a moment.'
                });
            }
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract career data from BLS page
        const careerData = {
            title: '',
            description: '',
            education: '',
            salary: 0,
            demand: '',
            workEnvironment: '',
            skills: [],
            source: normalizedUrl
        };

        const fieldsFound = [];

        // Extract title from h1 or page title
        careerData.title = $('h1').first().text().trim() ||
                          $('title').text().replace(' : Occupational Outlook Handbook', '').trim();
        if (careerData.title) fieldsFound.push('title');

        // Extract salary (median pay) with multiple fallback strategies
        const salaryText = $('p:contains("Median Pay")').parent().find('.ooh-highlight').text() ||
                          $('p:contains("Median annual wage")').parent().find('.ooh-highlight').text() ||
                          $('.ooh-highlight:contains("$")').first().text();
        const salaryMatch = salaryText.match(/\$([0-9,]+)/);
        if (salaryMatch) {
            careerData.salary = parseInt(salaryMatch[1].replace(/,/g, ''));
            fieldsFound.push('salary');
        }

        // Extract description from "What They Do" section
        const whatTheyDoSection = $('h2:contains("What"), h3:contains("What")').first();
        if (whatTheyDoSection.length) {
            const descriptionPara = whatTheyDoSection.next('p').text().trim() ||
                                   whatTheyDoSection.parent().next('p').text().trim();
            careerData.description = descriptionPara.substring(0, 300);
        }

        // Fallback: use meta description
        if (!careerData.description) {
            careerData.description = $('meta[name="description"]').attr('content') ||
                                    $('meta[property="og:description"]').attr('content') || '';
        }
        if (careerData.description) fieldsFound.push('description');

        // Extract education requirements
        const educationSection = $('h3:contains("Education"), h2:contains("How to Become")').first();
        if (educationSection.length) {
            const educationText = educationSection.next('p').text().trim() ||
                                 educationSection.parent().next('p').text().trim();
            careerData.education = educationText.substring(0, 200);
        }

        // Try to get education from the "Entry-level education" field
        const entryLevelEd = $('p:contains("Entry-level education")').parent().find('.ooh-highlight').text().trim();
        if (entryLevelEd && !careerData.education) {
            careerData.education = entryLevelEd;
        }
        if (careerData.education) fieldsFound.push('education');

        // Extract job outlook/demand
        const outlookText = $('p:contains("Job Outlook")').parent().find('.ooh-highlight').text().trim() ||
                           $('h2:contains("Job Outlook"), h3:contains("Job Outlook")').next('p').text().trim();
        if (outlookText) {
            careerData.demand = outlookText.substring(0, 150);
            fieldsFound.push('demand');
        }

        // Extract work environment
        const workEnvSection = $('h2:contains("Work Environment"), h3:contains("Work Environment")').first();
        if (workEnvSection.length) {
            const workEnvText = workEnvSection.next('p').text().trim();
            careerData.workEnvironment = workEnvText.substring(0, 150);
            fieldsFound.push('workEnvironment');
        }

        // Extract skills from "Important Qualities" section
        const qualitiesSection = $('h3:contains("Important Qualities"), h2:contains("Important Qualities")').first();
        if (qualitiesSection.length) {
            const qualitiesList = qualitiesSection.nextAll('p').first().text();
            // Try to extract from list items
            qualitiesSection.parent().find('li').each((i, elem) => {
                if (i < 5) { // Limit to 5 skills
                    const skill = $(elem).text().split('.')[0].trim();
                    if (skill) careerData.skills.push(skill);
                }
            });
        }

        // If no skills found, add some generic ones
        if (careerData.skills.length === 0) {
            careerData.skills = ['Problem-solving', 'Communication', 'Technical skills'];
        } else {
            fieldsFound.push('skills');
        }

        // Validation - use 422 for scraping issues (valid URL but couldn't parse content)
        if (!careerData.title) {
            console.warn(`Failed to extract title from: ${normalizedUrl}`);
            return res.status(422).json({
                error: 'Could not read the career title from this page. The page layout may have changed or this may not be a career page.'
            });
        }

        if (careerData.salary === 0) {
            console.warn(`Failed to extract salary from: ${normalizedUrl}, fields found: ${fieldsFound.join(', ')}`);
            return res.status(422).json({
                error: 'Could not read salary information from this page. The page layout may have changed.'
            });
        }

        const elapsed = Date.now() - startTime;
        console.log(`Successfully scraped career data: "${careerData.title}" in ${elapsed}ms, fields found: ${fieldsFound.join(', ')}`);
        res.json(careerData);

    } catch (error) {
        console.error('Error scraping career data:', error);
        res.status(500).json({
            error: 'Failed to scrape career data. Please check the URL and try again.',
            details: error.message
        });
    }
});

// API endpoint to save student records
app.post('/api/save-record', async (req, res) => {
    try {
        const { name, block, correct, round, streak, timestamp } = req.body;

        // Validate required fields
        if (!name || !block) {
            return res.status(400).json({
                error: 'Name and block are required fields'
            });
        }

        // Create record object
        const record = {
            name,
            block,
            correct: correct || 0,
            round: round || 1,
            streak: streak || 0,
            timestamp: timestamp || new Date().toISOString()
        };

        const recordsFilePath = path.join(__dirname, 'student_records.json');

        // Read existing records or create new array
        let records = [];
        try {
            const fileContent = await fs.readFile(recordsFilePath, 'utf8');
            records = JSON.parse(fileContent);
        } catch (error) {
            // File doesn't exist or is invalid, start with empty array
            console.log('Creating new records file');
        }

        // Add new record
        records.push(record);

        // Write back to file
        await fs.writeFile(recordsFilePath, JSON.stringify(records, null, 2), 'utf8');

        console.log(`Record saved for ${name} (Block ${block}): ${correct} correct, Round ${round}`);

        res.json({
            success: true,
            message: 'Record saved successfully',
            record: record
        });

    } catch (error) {
        console.error('Error saving record:', error);
        res.status(500).json({
            error: 'Failed to save record',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Career Skills API is running' });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Career Skills Game Server is running!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`\n📝 API Endpoints:`);
    console.log(`   POST /api/scrape-career - Scrape BLS.gov career data`);
    console.log(`   GET  /api/health - Health check\n`);
});
