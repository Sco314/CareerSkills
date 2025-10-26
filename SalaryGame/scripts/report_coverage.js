#!/usr/bin/env node
/**
 * Coverage Report Script
 *
 * Purpose: Generate a data quality and coverage report
 * Input: build/careers_merged.json
 * Output: Console report
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../build/careers_merged.json');

function generateReport() {
  console.log('📊 Data Coverage Report');
  console.log('═══════════════════════════════════════\n');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.error('   Run the full data pipeline first!');
    process.exit(1);
  }

  const occupations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  console.log(`Total Occupations: ${occupations.length}\n`);

  // Field coverage
  console.log('Field Coverage:');

  const fields = [
    'soc',
    'title',
    'description',
    'education',
    'demand',
    'salary',
    'workEnvironment',
    'skills',
    'source'
  ];

  fields.forEach(field => {
    const count = occupations.filter(occ => {
      const value = occ[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'number') return value > 0;
      if (typeof value === 'string') return value.length > 0;
      return !!value;
    }).length;

    const percentage = ((count / occupations.length) * 100).toFixed(1);
    const icon = count === occupations.length ? '✓' : '⚠';
    console.log(`  ${icon} ${field.padEnd(20)} ${count}/${occupations.length} (${percentage}%)`);
  });

  console.log('');

  // Quality metrics
  console.log('Quality Metrics:');

  const estimatedSalaries = occupations.filter(occ => occ.salaryEstimated === true).length;
  const syntheticSkills = occupations.filter(occ => occ.skillsSource === 'synthetic').length;
  const missingOohUrl = occupations.filter(occ => !occ.oohUrl).length;

  console.log(`  • Estimated salaries: ${estimatedSalaries}/${occupations.length} (${((estimatedSalaries / occupations.length) * 100).toFixed(1)}%)`);
  console.log(`  • Synthetic skills: ${syntheticSkills}/${occupations.length} (${((syntheticSkills / occupations.length) * 100).toFixed(1)}%)`);
  console.log(`  • Missing OOH URLs: ${missingOohUrl}/${occupations.length} (${((missingOohUrl / occupations.length) * 100).toFixed(1)}%)`);

  console.log('');

  // Salary statistics
  const salaries = occupations.map(occ => occ.salary).filter(s => s > 0);
  const avgSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  const minSalary = Math.min(...salaries);
  const maxSalary = Math.max(...salaries);

  console.log('Salary Statistics:');
  console.log(`  • Average: $${avgSalary.toLocaleString()}`);
  console.log(`  • Min: $${minSalary.toLocaleString()}`);
  console.log(`  • Max: $${maxSalary.toLocaleString()}`);

  console.log('');

  // Demand distribution
  console.log('Demand Distribution:');
  const demandCounts = {};
  occupations.forEach(occ => {
    const category = occ.demand.split('–')[0].trim();
    demandCounts[category] = (demandCounts[category] || 0) + 1;
  });

  Object.entries(demandCounts).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
    const percentage = ((count / occupations.length) * 100).toFixed(1);
    console.log(`  • ${category.padEnd(12)} ${count.toString().padStart(2)} (${percentage}%)`);
  });

  console.log('');

  // Growth rate statistics
  const growthRates = occupations.map(occ => occ.growthRate || 0);
  const avgGrowth = (growthRates.reduce((a, b) => a + b, 0) / growthRates.length).toFixed(1);
  const positiveGrowth = growthRates.filter(g => g > 0).length;

  console.log('Growth Statistics:');
  console.log(`  • Average growth rate: ${avgGrowth}%`);
  console.log(`  • Positive growth: ${positiveGrowth}/${occupations.length} (${((positiveGrowth / occupations.length) * 100).toFixed(1)}%)`);

  console.log('');

  // Overall quality score
  const completeRecords = occupations.filter(occ => {
    return occ.soc &&
           occ.title &&
           occ.description &&
           occ.description.length >= 10 &&
           occ.education &&
           occ.demand &&
           occ.salary > 0 &&
           occ.workEnvironment &&
           occ.skills &&
           occ.skills.length >= 3 &&
           occ.source;
  }).length;

  const qualityScore = ((completeRecords / occupations.length) * 100).toFixed(1);

  console.log('Overall Quality:');
  console.log(`  • Complete records: ${completeRecords}/${occupations.length} (${qualityScore}%)`);

  if (qualityScore >= 95) {
    console.log('  ✅ Excellent data quality!');
  } else if (qualityScore >= 80) {
    console.log('  ✓ Good data quality');
  } else {
    console.log('  ⚠ Consider improving data coverage');
  }

  console.log('');
  console.log('═══════════════════════════════════════\n');
}

// Run if called directly
if (require.main === module) {
  try {
    generateReport();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating report:', error);
    process.exit(1);
  }
}

module.exports = { generateReport };
