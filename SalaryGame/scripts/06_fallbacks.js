#!/usr/bin/env node
/**
 * Script 06: Fallbacks for Missing Data
 *
 * Purpose: Fill in any missing fields with fallback data
 * Input: build/05_with_skills.json
 * Output: build/06_with_fallbacks.json
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../build/05_with_skills.json');
const OUTPUT_FILE = path.join(__dirname, '../build/06_with_fallbacks.json');

function applyFallbacks() {
  console.log('🔧 Applying fallbacks for missing data...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.error('   Run script 05 first!');
    process.exit(1);
  }

  const occupations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  let fallbacksApplied = 0;

  const enriched = occupations.map(occ => {
    const result = { ...occ };
    let modified = false;

    // Fallback for description
    if (!result.description || result.description.length < 10) {
      result.description = `Professionals in ${result.title.toLowerCase()} perform specialized tasks and contribute to their industry.`;
      modified = true;
    }

    // Fallback for work environment
    if (!result.workEnvironment || result.workEnvironment.length < 5) {
      result.workEnvironment = 'Various settings including offices, facilities, and remote locations';
      modified = true;
    }

    // Fallback for education
    if (!result.education || result.education.length < 3) {
      result.education = 'Varies by position';
      modified = true;
    }

    // Fallback for demand
    if (!result.demand || result.demand.length < 3) {
      result.demand = 'Moderate – 3% (2024–34)';
      modified = true;
    }

    // Fallback for salary (should have been handled in script 03)
    if (!result.salary || result.salary === 0) {
      result.salary = 50000;
      result.salaryEstimated = true;
      modified = true;
    }

    // Fallback for skills
    if (!result.skills || result.skills.length < 3) {
      result.skills = ['Communication', 'Problem-solving', 'Teamwork'];
      result.skillsSource = 'synthetic';
      modified = true;
    }

    // Ensure source field exists
    if (!result.source) {
      result.source = `BLS OOH ${result.soc}`;
      modified = true;
    }

    // Add lastUpdated timestamp
    if (!result.lastUpdated) {
      result.lastUpdated = new Date().toISOString();
      modified = true;
    }

    if (modified) {
      fallbacksApplied++;
    }

    return result;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log(`✅ Applied fallbacks to ${fallbacksApplied} occupations`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log('');

  return enriched;
}

// Run if called directly
if (require.main === module) {
  try {
    applyFallbacks();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error applying fallbacks:', error);
    process.exit(1);
  }
}

module.exports = { applyFallbacks };
