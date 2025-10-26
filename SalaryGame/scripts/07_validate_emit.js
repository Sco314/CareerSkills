#!/usr/bin/env node
/**
 * Script 07: Validate and Emit Final JSON
 *
 * Purpose: Validate against schema and emit final careers.min.json
 * Input: build/06_with_fallbacks.json
 * Output: public/careers.min.json (minified for app)
 *         build/careers_merged.json (full data for debugging)
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../build/06_with_fallbacks.json');
const OUTPUT_PUBLIC = path.join(__dirname, '../public/careers.min.json');
const OUTPUT_DEBUG = path.join(__dirname, '../build/careers_merged.json');
const SCHEMA_FILE = path.join(__dirname, '../schema/occupation.schema.json');

// Simple validation (for production, use a proper JSON schema validator like Ajv)
function validateOccupation(occ, index) {
  const errors = [];

  // Required fields
  if (!occ.soc || !occ.soc.match(/^[0-9]{2}-[0-9]{4}$/)) {
    errors.push(`Invalid SOC code: ${occ.soc}`);
  }
  if (!occ.title || occ.title.length < 1) {
    errors.push('Missing title');
  }
  if (!occ.description || occ.description.length < 10) {
    errors.push('Description too short');
  }
  if (!occ.education) {
    errors.push('Missing education');
  }
  if (!occ.demand) {
    errors.push('Missing demand');
  }
  if (!occ.salary || occ.salary < 0) {
    errors.push('Invalid salary');
  }
  if (!occ.skills || occ.skills.length < 3 || occ.skills.length > 5) {
    errors.push('Skills must be 3-5 items');
  }
  if (!occ.source) {
    errors.push('Missing source');
  }

  return errors;
}

function validateAndEmit() {
  console.log('✅ Validating and emitting final careers data...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.error('   Run script 06 first!');
    process.exit(1);
  }

  const occupations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  // Validate all occupations
  let validCount = 0;
  let invalidCount = 0;

  occupations.forEach((occ, index) => {
    const errors = validateOccupation(occ, index);
    if (errors.length > 0) {
      console.error(`❌ Validation errors in occupation ${index} (${occ.soc} - ${occ.title}):`);
      errors.forEach(err => console.error(`   - ${err}`));
      invalidCount++;
    } else {
      validCount++;
    }
  });

  if (invalidCount > 0) {
    console.error(`\n❌ Validation failed: ${invalidCount} invalid occupations`);
    process.exit(1);
  }

  console.log(`✅ All ${validCount} occupations validated successfully`);

  // Create public directory if it doesn't exist
  const publicDir = path.dirname(OUTPUT_PUBLIC);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Emit minified version for app (only fields needed by frontend)
  const minified = occupations.map((occ, index) => ({
    id: index + 1,  // Add simple numeric ID for frontend
    soc: occ.soc,
    title: occ.title,
    description: occ.description,
    education: occ.education,
    demand: occ.demand,
    salary: occ.salary,
    workEnvironment: occ.workEnvironment,
    skills: occ.skills,
    source: occ.source
  }));

  fs.writeFileSync(OUTPUT_PUBLIC, JSON.stringify(minified));
  console.log(`📦 Minified output: ${OUTPUT_PUBLIC}`);
  console.log(`   Size: ${(fs.statSync(OUTPUT_PUBLIC).size / 1024).toFixed(2)} KB`);

  // Emit full debug version
  fs.writeFileSync(OUTPUT_DEBUG, JSON.stringify(occupations, null, 2));
  console.log(`🔍 Debug output: ${OUTPUT_DEBUG}`);
  console.log(`   Size: ${(fs.statSync(OUTPUT_DEBUG).size / 1024).toFixed(2)} KB`);

  console.log('');
  console.log('🎉 Data pipeline complete!');
  console.log('');

  return { minified, full: occupations };
}

// Run if called directly
if (require.main === module) {
  try {
    validateAndEmit();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error validating and emitting data:', error);
    process.exit(1);
  }
}

module.exports = { validateAndEmit };
