# Career Salary Comparison Game

An interactive educational web application designed for high school students to learn about different careers and their salaries through an engaging comparison game.

## Overview

Students are presented with two random careers side-by-side and must guess which one has the higher median annual salary. After making their selection, the actual salaries are revealed along with educational information about both careers. This game helps students:

- Learn about diverse career options
- Understand salary ranges across different professions
- Discover education requirements for various careers
- Explore job market demand and work environments

## Features

- **40+ Real Careers**: Curated selection of careers from various industries
- **Custom Career Integration**: Add any career from BLS.gov using real government URLs
- **Automatic Data Scraping**: Backend server extracts career information automatically from BLS.gov
- **Accurate Data**: Salary information from U.S. Bureau of Labor Statistics (BLS)
- **Career Details**: Includes job descriptions, education requirements, demand outlook, work environment, and key skills
- **Persistent Storage**: Custom careers saved in browser localStorage
- **Score Tracking**: Points system with streak bonuses
- **Student-Friendly UI**: Clean, modern design optimized for Chromebooks
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Data Sources

All career data is sourced from authoritative government and research organizations:

- **U.S. Bureau of Labor Statistics (BLS)**: Median annual wages and employment projections (2022-2032)
- **O*NET Online**: Occupational descriptions, skills, and work activities
- **Salary.com**: Additional salary verification and market data

### Salary Data Accuracy

All salaries represent **median annual wages** as reported by the BLS Occupational Employment and Wage Statistics (OEWS) program. Median wage means that half the workers in an occupation earned more than that amount and half earned less. Data is updated annually by BLS.

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup Instructions

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   cd CareerSkills
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to: `http://localhost:3000`

## How to Use

### For Teachers/Administrators

1. Follow the installation steps above
2. The server runs on port 3000 by default
3. Students can access the game at `http://localhost:3000` or your server's URL
4. Custom careers added by students are saved in their browser's localStorage

### For Students - Playing the Game

1. Navigate to the hosted URL or `http://localhost:3000`
2. Click "Start Game" to begin
3. Read about both careers presented
4. Click the "Select Higher Salary" button on the career you think earns more
5. View the revealed salaries and learn from the feedback
6. Click "Next Round" to continue playing

### For Students - Adding Custom Careers

1. Click "Add Custom Career" from the main screen
2. Visit the BLS Occupational Outlook Handbook: https://www.bls.gov/ooh/
3. Browse or search for a career (e.g., "Actuary", "Computer Programmer")
4. Copy the URL from the career page
   - Example: `https://www.bls.gov/ooh/math/actuaries.htm`
   - Example: `https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm`
5. Paste the URL into the form and click "Add Career"
6. The app will automatically extract all career information
7. Your custom career will now appear in the game rotation
8. Click "View My Careers" to manage your added careers

### Game Rules

- **+10 points** for each correct answer
- **+5 bonus points** for 3+ round streak
- **+10 bonus points** for 5+ round streak
- Results summary shown after every 10 rounds
- Track your accuracy and best streak

## File Structure

```
CareerSkills/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # Frontend game logic and API calls
├── server.js           # Backend Node.js server with scraping logic
├── package.json        # Node.js dependencies and scripts
├── data/
│   └── careers.json    # Default career data with salaries and details
└── README.md           # Documentation
```

## API Endpoints

### POST /api/scrape-career

Scrapes career data from a BLS.gov URL.

**Request:**
```json
{
  "url": "https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm"
}
```

**Response (Success):**
```json
{
  "title": "Physicians and Surgeons",
  "salary": 229300,
  "description": "Physicians and surgeons diagnose and treat injuries or illnesses...",
  "education": "Doctoral or professional degree",
  "demand": "Projected to grow 3 percent from 2022 to 2032",
  "workEnvironment": "Physicians and surgeons work in offices, hospitals...",
  "skills": ["Communication", "Problem-solving", "Empathy"],
  "source": "https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm"
}
```

**Response (Error):**
```json
{
  "error": "Could not extract salary information. Please ensure this is a valid BLS OOH career page."
}
```

### GET /api/health

Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Career Skills API is running"
}
```

## Technical Details

### Technologies Used

**Frontend:**
- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- localStorage for custom career persistence

**Backend:**
- Node.js
- Express.js web server
- Cheerio (HTML parsing/web scraping)
- node-fetch (HTTP requests)
- CORS middleware

### Browser Compatibility

- Chrome/Chromium (optimized for Chromebooks)
- Firefox
- Safari
- Edge

### Performance

- Lightweight: ~150KB total size
- Fast loading on school networks
- No external dependencies
- Works offline after initial load

## Career List (40 Careers)

The game includes careers across multiple sectors:

**Healthcare**: Registered Nurse, Physician Assistant, Physical Therapist, Dental Hygienist, Pharmacist, Veterinarian, Occupational Therapist, Medical Sonographer, Radiation Therapist, Medical Assistant, Dental Assistant

**Technology**: Software Developer, Web Developer, Data Scientist, Cybersecurity Analyst, Robotics Engineer

**Engineering**: Mechanical Engineer, Civil Engineer, Aerospace Engineer, Architect

**Business**: Marketing Manager, Financial Analyst, Accountant, Human Resources Manager, Construction Manager, Event Planner, Loan Officer

**Trades**: Electrician, Plumber, HVAC Technician, Electrician Apprentice, Chef, Firefighter

**Education & Social Services**: Elementary School Teacher, Social Worker

**Creative**: Graphic Designer

**Legal**: Paralegal

**Public Service**: Police Officer, Firefighter

**Sales**: Real Estate Agent

**Medical Specialists**: Anesthesiologist

## Educational Value

This game helps students:

1. **Explore Career Options**: Discover careers they may not have considered
2. **Understand Compensation**: Learn how education and training affect earning potential
3. **Challenge Assumptions**: Some high-paying careers don't require 4-year degrees
4. **Make Informed Decisions**: Better understand the career landscape for future planning

## Customization

### Adding New Careers

Edit `data/careers.json` and add new career objects with this structure:

```json
{
  "id": 41,
  "title": "Career Title",
  "description": "What the career involves...",
  "education": "Required education level",
  "demand": "Job outlook information",
  "salary": 50000,
  "workEnvironment": "Where they work",
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "source": "BLS OES Code"
}
```

### Styling Changes

Modify `styles.css` to change:
- Colors (update the gradient values)
- Fonts (change font-family)
- Spacing and layout
- Responsive breakpoints

## License

This educational resource is provided for use in schools and educational settings. Career data is sourced from public government databases (BLS, O*NET).

## Example BLS URLs to Try

Here are some careers you can add using their BLS.gov URLs:

- **Actuaries**: https://www.bls.gov/ooh/math/actuaries.htm
- **Computer Programmers**: https://www.bls.gov/ooh/computer-and-information-technology/computer-programmers.htm
- **Aerospace Engineers**: https://www.bls.gov/ooh/architecture-and-engineering/aerospace-engineers.htm
- **Veterinarians**: https://www.bls.gov/ooh/healthcare/veterinarians.htm
- **Chiropractors**: https://www.bls.gov/ooh/healthcare/chiropractors.htm
- **Forensic Science Technicians**: https://www.bls.gov/ooh/life-physical-and-social-science/forensic-science-technicians.htm

Browse more careers at: https://www.bls.gov/ooh/

## Troubleshooting

### Server Issues

**Server won't start:**
- Ensure Node.js is installed: `node --version`
- Check if port 3000 is available
- Try reinstalling dependencies: `rm -rf node_modules && npm install`

**Port already in use:**
- Change the port by setting environment variable: `PORT=3001 npm start`
- Or kill the process using port 3000

### Career Scraping Issues

**Career scraping fails:**
- Verify the URL is from `bls.gov/ooh/` specifically
- Check your internet connection
- Some BLS pages may have different HTML structures
- Try a different career URL from the examples above

**Missing data in scraped career:**
- The scraper extracts what's available on the page
- Some career pages may not have all fields
- You can manually edit the career in localStorage if needed

### Browser Issues

**Custom careers not saving:**
- Ensure localStorage is enabled in your browser
- Don't use private/incognito mode (localStorage won't persist)
- Check browser storage quota isn't exceeded

**Game not loading:**
1. Check that all files are in the correct directory structure
2. Ensure you're using a modern web browser
3. Verify that JavaScript is enabled
4. Open browser console (F12) to check for error messages
5. Verify the server is running on `http://localhost:3000`

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Verify server is running with `npm start`
3. Check browser console for error messages (F12)
4. Ensure all dependencies are installed (`npm install`)

## Future Enhancements

Possible additions:
- Filter by education level
- Filter by industry sector
- Comparison of careers by state/region
- Career path progression trees
- Save progress/scores across devices (user accounts)
- Multiplayer mode
- Export custom careers to share with other students
- Manual career entry (without BLS URL)
- Career comparison reports (PDF export)

## Credits

- **Data**: U.S. Bureau of Labor Statistics, O*NET Online
- **Design**: Modern, accessible web design principles
- **Target Audience**: High school students (grades 9-12)

## Version

Version 1.0 - Initial Release

---

**Note for Educators**: This tool is designed to supplement career counseling and should be used alongside discussions about personal interests, skills, and values. Salary is just one factor in career satisfaction and success.
