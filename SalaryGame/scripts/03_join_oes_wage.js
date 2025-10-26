#!/usr/bin/env node
/**
 * Script 03: Join OES (Occupational Employment Statistics) Wage Data
 *
 * Purpose: Add salary information from BLS OES data
 * Input: build/02_with_ooh.json
 * Output: build/03_with_wages.json
 *
 * OES Data Source: https://www.bls.gov/oes/tables.htm
 * Downloads median annual wages by SOC code
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../build/02_with_ooh.json');
const OUTPUT_FILE = path.join(__dirname, '../build/03_with_wages.json');

// OES wage data (mock - in real implementation, load from OES CSV/Excel)
const OES_WAGES = {
  '29-1141': 81220,    // Registered Nurses
  '15-1252': 124200,   // Software Developers
  '25-2021': 61690,    // Elementary School Teachers
  '47-2111': 60240,    // Electricians
  '17-2141': 96310,    // Mechanical Engineers
  '29-1292': 81400,    // Dental Hygienists
  '11-2021': 156580,   // Marketing Managers
  '47-2152': 60090,    // Plumbers
  '29-1123': 97720,    // Physical Therapists
  '27-1024': 57990,    // Graphic Designers
  '15-2051': 103500,   // Data Scientists
  '23-2011': 59200,    // Paralegals
  '29-1131': 103260,   // Veterinarians
  '15-1254': 80730,    // Web Developers
  '33-3051': 66020,    // Police Officers
  '13-2011': 79880,    // Accountants
  '49-9021': 57300,    // HVAC Technicians
  '29-1122': 93180,    // Occupational Therapists
  '17-2051': 89940,    // Civil Engineers
  '35-1011': 56520,    // Chefs
  '29-1071': 126010,   // Physician Assistants
  '41-9021': 54300,    // Real Estate Agents
  '29-1051': 132750,   // Pharmacists
  '15-1212': 112000,   // Cybersecurity Analysts
  '21-1029': 55350,    // Social Workers
  '17-2011': 126880,   // Aerospace Engineers
  '31-9091': 43950,    // Dental Assistants
  '13-2051': 99890,    // Financial Analysts
  '11-9021': 101480,   // Construction Managers
  '31-9092': 38270,    // Medical Assistants
  '17-1011': 89560,    // Architects
  '33-2011': 57120,    // Firefighters
  '11-3121': 130000,   // HR Managers
  '29-1124': 98300,    // Radiation Therapists
  '13-2072': 65740,    // Loan Officers
  '17-2199': 99040,    // Robotics Engineers
  '29-2032': 78210,    // Medical Sonographers
  '13-1121': 54560,    // Event Planners
  '29-1211': 331190,   // Anesthesiologists
  '29-1021': 163220,   // Dentists
  '51-4121': 47540,    // Welders
  '27-1025': 62510,    // Interior Designers
  '27-1022': 76700,    // Fashion Designers
  '53-2021': 132250,   // Air Traffic Controllers
  '29-2042': 49090,    // Paramedics
  '17-2041': 106260,   // Chemical Engineers
  '19-2031': 79430,    // Chemists
  '23-1011': 135740,   // Lawyers
  '17-2171': 131800,   // Petroleum Engineers
  '51-8013': 94790,    // Power Plant Operators
  '19-1023': 66350,    // Wildlife Biologists
  '25-2031': 65220,    // High School Teachers
  '31-9097': 38530,    // Phlebotomists
  '39-5012': 33400,    // Hair Stylists
  '41-2011': 29720,    // Cashiers
  '15-1251': 97800,    // Computer Programmers
  '27-2021': 77300,    // Professional Athletes
  '43-3071': 36310,    // Bank Tellers
  '49-3023': 46970,    // Auto Mechanics
  '27-4021': 38950,    // Photographers
  '27-2012': 92220,    // Movie Directors
  '27-2011': 28920,    // Actors
  '25-4021': 64370,    // Librarians
  '27-3043': 73150,    // Writers
  '15-2021': 108100,   // Mathematicians
  '11-3031': 156100    // Financial Managers
};

function joinWageData() {
  console.log('💰 Joining OES wage data...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.error('   Run script 02 first!');
    process.exit(1);
  }

  const occupations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  let matched = 0;
  let estimated = 0;

  const enriched = occupations.map(occ => {
    let salary = OES_WAGES[occ.soc];
    let salaryEstimated = false;

    if (!salary) {
      // Fallback: estimate from related SOC (same 5-digit group)
      const socPrefix = occ.soc.substring(0, 5);
      const relatedSocs = Object.keys(OES_WAGES).filter(s => s.startsWith(socPrefix));

      if (relatedSocs.length > 0) {
        // Average of related SOCs
        const relatedWages = relatedSocs.map(s => OES_WAGES[s]);
        salary = Math.round(relatedWages.reduce((a, b) => a + b, 0) / relatedWages.length);
        salaryEstimated = true;
        estimated++;
      } else {
        // Default fallback
        salary = 50000;
        salaryEstimated = true;
        estimated++;
      }
    } else {
      matched++;
    }

    return {
      ...occ,
      salary,
      salaryEstimated
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log(`✅ Added wage data to ${enriched.length} occupations`);
  console.log(`   📊 Exact matches: ${matched}`);
  console.log(`   📊 Estimated: ${estimated}`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log('');

  return enriched;
}

// Run if called directly
if (require.main === module) {
  try {
    joinWageData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error joining wage data:', error);
    process.exit(1);
  }
}

module.exports = { joinWageData };
