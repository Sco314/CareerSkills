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
- **Accurate Data**: Salary information from U.S. Bureau of Labor Statistics (BLS)
- **Career Details**: Includes job descriptions, education requirements, demand outlook, work environment, and key skills
- **Score Tracking**: Points system with streak bonuses
- **Student-Friendly UI**: Clean, modern design optimized for Chromebooks
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Backend Required**: Static files that can be hosted anywhere

## Data Sources

All career data is sourced from authoritative government and research organizations:

- **U.S. Bureau of Labor Statistics (BLS)**: Median annual wages and employment projections (2022-2032)
- **O*NET Online**: Occupational descriptions, skills, and work activities
- **Salary.com**: Additional salary verification and market data

### Salary Data Accuracy

All salaries represent **median annual wages** as reported by the BLS Occupational Employment and Wage Statistics (OEWS) program. Median wage means that half the workers in an occupation earned more than that amount and half earned less. Data is updated annually by BLS.

## How to Use

### For Teachers/Administrators

1. Download or clone this repository
2. Host the files on your school's web server, or
3. Open `index.html` directly in a web browser

### For Students

1. Navigate to the hosted URL or open the `index.html` file
2. Click "Start Game" to begin
3. Read about both careers presented
4. Click the "Select Higher Salary" button on the career you think earns more
5. View the revealed salaries and learn from the feedback
6. Click "Next Round" to continue playing

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
├── script.js           # Game logic and interactions
├── data/
│   └── careers.json    # Career data with salaries and details
└── README.md           # Documentation
```

## Technical Details

### Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- JSON for data storage

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

## Support

For questions or issues:
1. Check that all files are in the correct directory structure
2. Ensure you're using a modern web browser
3. Verify that JavaScript is enabled
4. Check browser console for error messages

## Future Enhancements

Possible additions:
- Filter by education level
- Filter by industry sector
- Comparison of careers by state/region
- Career path progression trees
- Save progress/scores
- Multiplayer mode
- Integration with live BLS API

## Credits

- **Data**: U.S. Bureau of Labor Statistics, O*NET Online
- **Design**: Modern, accessible web design principles
- **Target Audience**: High school students (grades 9-12)

## Version

Version 1.0 - Initial Release

---

**Note for Educators**: This tool is designed to supplement career counseling and should be used alongside discussions about personal interests, skills, and values. Salary is just one factor in career satisfaction and success.
