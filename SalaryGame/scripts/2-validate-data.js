#!/usr/bin/env node
// SalaryGame/scripts/2-validate-data.js
// Validate parsed career data and generate validation report

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../../data/processed/careers-full.json');
const OUTPUT_FILE = path.join(__dirname, '../../data/processed/validation-report.json');

/**
 * Validation rules
 */
const VALIDATION_RULES = {
  required_fields: ['id', 'soc', 'title', 'description', 'salary', 'education', 'demand'],
  soc_format: /^[0-9]{2}-[0-9]{4}$/,
  salary_min: 0,
  salary_max: 500000,
  description_min_length: 10,
  title_min_length: 1
};

/**
 * Validate a single career object
 * @param {object} career - Career object
 * @returns {object} Validation result
 */
function validateCareer(career) {
  const errors = [];
  const warnings = [];

  if (!career.id) {
    errors.push('Missing required field: id');
  }

  if (!career.soc) {
    errors.push('Missing required field: soc');
  } else if (!VALIDATION_RULES.soc_format.test(career.soc)) {
    warnings.push(`Invalid SOC format: ${career.soc} (expected XX-XXXX)`);
  }

  if (!career.title) {
    errors.push('Missing required field: title');
  } else if (career.title.length < VALIDATION_RULES.title_min_length) {
    errors.push('Title is too short');
  }

  if (!career.description) {
    errors.push('Missing required field: description');
  } else if (career.description.length < VALIDATION_RULES.description_min_length) {
    warnings.push(`Description is too short (${career.description.length} chars)`);
  }

  if (!career.salary || typeof career.salary !== 'object') {
    errors.push('Missing or invalid salary object');
  } else {
    if (!career.salary.annual || career.salary.annual <= VALIDATION_RULES.salary_min) {
      errors.push(`Invalid salary: ${career.salary.annual}`);
    }

    if (career.salary.annual > VALIDATION_RULES.salary_max) {
      warnings.push(`Unusually high salary: $${career.salary.annual.toLocaleString()}`);
    }
  }

  if (!career.education) {
    errors.push('Missing required field: education');
  }

  if (!career.demand) {
    errors.push('Missing required field: demand');
  }

  if (!career.work_environment) {
    warnings.push('Missing work_environment');
  }

  if (!career.growth || typeof career.growth !== 'object') {
    warnings.push('Missing or invalid growth object');
  } else if (career.growth.rate === null || career.growth.rate === undefined) {
    warnings.push('Missing growth rate');
  }

  return {
    id: career.id,
    soc: career.soc,
    title: career.title,
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Check for duplicate SOC codes
 * @param {Array<object>} careers - Array of careers
 * @returns {Array<object>} Duplicate entries
 */
function findDuplicateSocs(careers) {
  const socCounts = {};
  const duplicates = [];

  for (const career of careers) {
    if (career.soc) {
      if (!socCounts[career.soc]) {
        socCounts[career.soc] = [];
      }
      socCounts[career.soc].push(career);
    }
  }

  for (const [soc, occurrences] of Object.entries(socCounts)) {
    if (occurrences.length > 1) {
      duplicates.push({
        soc,
        count: occurrences.length,
        careers: occurrences.map(c => ({ id: c.id, title: c.title }))
      });
    }
  }

  return duplicates;
}

/**
 * Validate all careers and generate report
 */
function validateData() {
  console.log('🚀 Step 2: Validating career data...\n');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: Input file not found at ${INPUT_FILE}`);
    console.log('💡 Hint: Run script 1-parse-xml.js first');
    process.exit(1);
  }

  console.log(`📂 Loading careers from ${INPUT_FILE}...`);
  const careers = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  console.log(`✅ Loaded ${careers.length} careers\n`);

  console.log('🔍 Running validation checks...');
  const results = careers.map(validateCareer);

  const validCareers = results.filter(r => r.valid);
  const invalidCareers = results.filter(r => !r.valid);
  const careersWithWarnings = results.filter(r => r.warnings.length > 0);

  console.log(`  ✓ Valid careers: ${validCareers.length}`);
  console.log(`  ⚠️  Careers with warnings: ${careersWithWarnings.length}`);
  console.log(`  ❌ Invalid careers: ${invalidCareers.length}\n`);

  const duplicates = findDuplicateSocs(careers);
  if (duplicates.length > 0) {
    console.log(`⚠️  Found ${duplicates.length} duplicate SOC code(s):`);
    for (const dup of duplicates) {
      console.log(`  - ${dup.soc}: ${dup.count} occurrences`);
      for (const career of dup.careers) {
        console.log(`    - ID ${career.id}: ${career.title}`);
      }
    }
    console.log('');
  } else {
    console.log('✅ No duplicate SOC codes found\n');
  }

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  const salaryStats = {
    min: Math.min(...careers.filter(c => c.salary?.annual).map(c => c.salary.annual)),
    max: Math.max(...careers.filter(c => c.salary?.annual).map(c => c.salary.annual)),
    avg: Math.round(
      careers.filter(c => c.salary?.annual).reduce((sum, c) => sum + c.salary.annual, 0) /
      careers.filter(c => c.salary?.annual).length
    )
  };

  const report = {
    summary: {
      total_careers: careers.length,
      valid_careers: validCareers.length,
      invalid_careers: invalidCareers.length,
      careers_with_warnings: careersWithWarnings.length,
      total_errors: totalErrors,
      total_warnings: totalWarnings,
      duplicate_socs: duplicates.length
    },
    validation_results: results,
    duplicates,
    salary_stats: salaryStats,
    generated_at: new Date().toISOString()
  };

  console.log('💾 Saving validation report...');
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  const outputSize = fs.statSync(OUTPUT_FILE).size;
  console.log(`✅ Report saved to ${OUTPUT_FILE} (${(outputSize / 1024).toFixed(2)} KB)\n`);

  console.log('📊 Validation Summary:');
  console.log(`  Total careers: ${careers.length}`);
  console.log(`  Valid: ${validCareers.length} (${((validCareers.length / careers.length) * 100).toFixed(1)}%)`);
  console.log(`  Invalid: ${invalidCareers.length} (${((invalidCareers.length / careers.length) * 100).toFixed(1)}%)`);
  console.log(`  Warnings: ${totalWarnings}`);
  console.log(`  Errors: ${totalErrors}\n`);

  console.log('💰 Salary Range:');
  console.log(`  Min: $${salaryStats.min.toLocaleString()}`);
  console.log(`  Max: $${salaryStats.max.toLocaleString()}`);
  console.log(`  Avg: $${salaryStats.avg.toLocaleString()}\n`);

  if (invalidCareers.length > 0) {
    console.log('❌ Invalid careers found:');
    for (const result of invalidCareers.slice(0, 5)) {
      console.log(`  ID ${result.id} (${result.soc}): ${result.title}`);
      for (const error of result.errors) {
        console.log(`    - ${error}`);
      }
    }
    if (invalidCareers.length > 5) {
      console.log(`  ... and ${invalidCareers.length - 5} more\n`);
    }
  }

  if (invalidCareers.length > 0) {
    console.log('\n⚠️  Step 2 complete with errors - review validation report\n');
    process.exit(1);
  } else {
    console.log('✅ Step 2 complete: All careers validated successfully!\n');
  }
}

if (require.main === module) {
  validateData();
}

module.exports = { validateData, validateCareer };
