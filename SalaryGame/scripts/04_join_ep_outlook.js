#!/usr/bin/env node
/**
 * Script 04: Join Employment Projections (EP) Data
 *
 * Purpose: Add job outlook and demand information
 * Input: build/03_with_wages.json
 * Output: build/04_with_outlook.json
 *
 * EP Data Source: https://www.bls.gov/emp/tables.htm
 * Downloads employment projections (growth %, openings)
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../build/03_with_wages.json');
const OUTPUT_FILE = path.join(__dirname, '../build/04_with_outlook.json');

// Employment Projections data (mock)
const EP_DATA = {
  '29-1141': { growthRate: 6, openingsPerYear: 194500 },    // Registered Nurses
  '15-1252': { growthRate: 25, openingsPerYear: 153900 },   // Software Developers
  '25-2021': { growthRate: 1, openingsPerYear: 133600 },    // Elementary Teachers
  '47-2111': { growthRate: 6, openingsPerYear: 79900 },     // Electricians
  '17-2141': { growthRate: 10, openingsPerYear: 20200 },    // Mechanical Engineers
  '29-1292': { growthRate: 7, openingsPerYear: 13800 },     // Dental Hygienists
  '11-2021': { growthRate: 6, openingsPerYear: 31100 },     // Marketing Managers
  '47-2152': { growthRate: 2, openingsPerYear: 48600 },     // Plumbers
  '29-1123': { growthRate: 14, openingsPerYear: 17400 },    // Physical Therapists
  '27-1024': { growthRate: 3, openingsPerYear: 24800 },     // Graphic Designers
  '15-2051': { growthRate: 35, openingsPerYear: 17700 },    // Data Scientists
  '23-2011': { growthRate: 4, openingsPerYear: 43000 },     // Paralegals
  '29-1131': { growthRate: 20, openingsPerYear: 4400 },     // Veterinarians
  '15-1254': { growthRate: 16, openingsPerYear: 21800 },    // Web Developers
  '33-3051': { growthRate: 3, openingsPerYear: 68500 },     // Police Officers
  '13-2011': { growthRate: 4, openingsPerYear: 136400 },    // Accountants
  '49-9021': { growthRate: 5, openingsPerYear: 38100 },     // HVAC Technicians
  '29-1122': { growthRate: 12, openingsPerYear: 11100 },    // Occupational Therapists
  '17-2051': { growthRate: 5, openingsPerYear: 24200 },     // Civil Engineers
  '35-1011': { growthRate: 15, openingsPerYear: 18800 },    // Chefs
  '29-1071': { growthRate: 27, openingsPerYear: 12200 },    // Physician Assistants
  '41-9021': { growthRate: 5, openingsPerYear: 55200 },     // Real Estate Agents
  '29-1051': { growthRate: 2, openingsPerYear: 13600 },     // Pharmacists
  '15-1212': { growthRate: 32, openingsPerYear: 18100 },    // Cybersecurity Analysts
  '21-1029': { growthRate: 9, openingsPerYear: 74700 },     // Social Workers
  '17-2011': { growthRate: 6, openingsPerYear: 3700 },      // Aerospace Engineers
  '31-9091': { growthRate: 8, openingsPerYear: 56400 },     // Dental Assistants
  '13-2051': { growthRate: 8, openingsPerYear: 32300 },     // Financial Analysts
  '11-9021': { growthRate: 8, openingsPerYear: 44200 },     // Construction Managers
  '31-9092': { growthRate: 14, openingsPerYear: 114600 },   // Medical Assistants
  '17-1011': { growthRate: 5, openingsPerYear: 8200 },      // Architects
  '33-2011': { growthRate: 4, openingsPerYear: 28000 },     // Firefighters
  '11-3121': { growthRate: 8, openingsPerYear: 17800 },     // HR Managers
  '29-1124': { growthRate: 4, openingsPerYear: 1500 },      // Radiation Therapists
  '13-2072': { growthRate: -1, openingsPerYear: 26000 },    // Loan Officers
  '17-2199': { growthRate: 10, openingsPerYear: 3500 },     // Robotics Engineers
  '29-2032': { growthRate: 10, openingsPerYear: 6900 },     // Medical Sonographers
  '13-1121': { growthRate: 18, openingsPerYear: 16400 },    // Event Planners
  '29-1211': { growthRate: 2, openingsPerYear: 2900 },      // Anesthesiologists
  '29-1021': { growthRate: 4, openingsPerYear: 6300 },      // Dentists
  '51-4121': { growthRate: -2, openingsPerYear: 38700 },    // Welders
  '27-1025': { growthRate: 4, openingsPerYear: 7800 },      // Interior Designers
  '27-1022': { growthRate: 3, openingsPerYear: 2500 },      // Fashion Designers
  '53-2021': { growthRate: 1, openingsPerYear: 2100 },      // Air Traffic Controllers
  '29-2042': { growthRate: 5, openingsPerYear: 19800 },     // Paramedics
  '17-2041': { growthRate: 14, openingsPerYear: 1700 },     // Chemical Engineers
  '19-2031': { growthRate: 6, openingsPerYear: 9100 },      // Chemists
  '23-1011': { growthRate: 8, openingsPerYear: 48700 },     // Lawyers
  '17-2171': { growthRate: 8, openingsPerYear: 2100 },      // Petroleum Engineers
  '51-8013': { growthRate: -15, openingsPerYear: 2500 },    // Power Plant Operators
  '19-1023': { growthRate: 5, openingsPerYear: 1500 },      // Wildlife Biologists
  '25-2031': { growthRate: 1, openingsPerYear: 77400 },     // High School Teachers
  '31-9097': { growthRate: 8, openingsPerYear: 21300 },     // Phlebotomists
  '39-5012': { growthRate: 8, openingsPerYear: 78500 },     // Hair Stylists
  '41-2011': { growthRate: -10, openingsPerYear: 518700 },  // Cashiers
  '15-1251': { growthRate: -10, openingsPerYear: 8500 },    // Computer Programmers
  '27-2021': { growthRate: 0, openingsPerYear: 800 },       // Professional Athletes
  '43-3071': { growthRate: -12, openingsPerYear: 41100 },   // Bank Tellers
  '49-3023': { growthRate: -1, openingsPerYear: 69000 },    // Auto Mechanics
  '27-4021': { growthRate: 4, openingsPerYear: 12700 },     // Photographers
  '27-2012': { growthRate: 4, openingsPerYear: 15600 },     // Movie Directors
  '27-2011': { growthRate: 4, openingsPerYear: 6100 },      // Actors
  '25-4021': { growthRate: 3, openingsPerYear: 14400 },     // Librarians
  '27-3043': { growthRate: 4, openingsPerYear: 15200 },     // Writers
  '15-2021': { growthRate: 2, openingsPerYear: 300 },       // Mathematicians
  '11-3031': { growthRate: 16, openingsPerYear: 71600 }     // Financial Managers
};

// Categorize demand based on growth rate
function categorizeDemand(growthRate, openings) {
  if (growthRate >= 20) return 'Very High';
  if (growthRate >= 10) return 'High';
  if (growthRate >= 5) return 'Moderate';
  if (growthRate >= 0) return 'Low';
  return 'Declining';
}

function joinOutlookData() {
  console.log('📈 Joining employment projections data...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.error('   Run script 03 first!');
    process.exit(1);
  }

  const occupations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  const enriched = occupations.map(occ => {
    const epData = EP_DATA[occ.soc] || { growthRate: 3, openingsPerYear: 1000 };
    const demandCategory = categorizeDemand(epData.growthRate, epData.openingsPerYear);
    const demand = `${demandCategory} – ${epData.growthRate}% (2024–34)`;

    return {
      ...occ,
      demand,
      growthRate: epData.growthRate,
      openingsPerYear: epData.openingsPerYear
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log(`✅ Added employment projections to ${enriched.length} occupations`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log('');

  return enriched;
}

// Run if called directly
if (require.main === module) {
  try {
    joinOutlookData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error joining outlook data:', error);
    process.exit(1);
  }
}

module.exports = { joinOutlookData };
