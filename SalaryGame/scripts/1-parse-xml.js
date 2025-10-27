#!/usr/bin/env node
// SalaryGame/scripts/1-parse-xml.js
// Parse BLS OOH XML file and extract career data

const fs = require('fs');
const path = require('path');
const {
  parseXmlString,
  stripHtml,
  safeExtract,
  extractText,
  parseInt10,
  parseNumber,
  extractGrowthRate,
  formatDemand,
  extractSimilarOccupations
} = require('./utils/xml-parser');

const INPUT_FILE = path.join(__dirname, '../../data/source/bls-ooh-full.xml');
const OUTPUT_FILE = path.join(__dirname, '../../data/processed/careers-full.json');

/**
 * Extract career data from XML occupation node
 * @param {object} occupation - XML occupation object
 * @param {number} id - Career ID
 * @returns {object} Extracted career data
 */
function extractCareerData(occupation, id) {
  const socCode = extractText(safeExtract(occupation, 'soc_coverage.soc_code', ''));
  const title = extractText(safeExtract(occupation, 'title', ''));
  const titleShort = extractText(safeExtract(occupation, 'occupation_name_short_singular', title));
  const description = stripHtml(extractText(safeExtract(occupation, 'description', '')));

  const salaryAnnual = parseInt10(extractText(safeExtract(occupation, 'quick_facts.qf_median_pay_annual.value', '')));
  const salaryHourly = parseNumber(extractText(safeExtract(occupation, 'quick_facts.qf_median_pay_hourly.value', '')));
  const salaryRange = extractText(safeExtract(occupation, 'quick_facts.qf_median_pay_annual.range', ''));

  let education = extractText(safeExtract(occupation, 'quick_facts.qf_entry_level_education.value', ''));
  if (!education || education.trim() === '') {
    education = 'Varies';
  }

  const workExperience = extractText(safeExtract(occupation, 'quick_facts.qf_work_experience.value', 'None'));
  const onTheJobTraining = extractText(safeExtract(occupation, 'quick_facts.qf_on_the_job_training.value', 'None'));

  const jobCount = parseInt10(extractText(safeExtract(occupation, 'quick_facts.qf_number_of_jobs.value', '')));

  const outlookText = extractText(safeExtract(occupation, 'quick_facts.qf_employment_outlook.value', ''));
  const growthRate = extractGrowthRate(outlookText);

  const openingsPerYear = parseInt10(extractText(safeExtract(occupation, 'quick_facts.qf_job_openings_per_year.value', '')));

  const workEnvironmentRaw = extractText(safeExtract(occupation, 'summary_work_environment', ''));
  const workEnvironment = stripHtml(workEnvironmentRaw);

  const whatTheyDoRaw = extractText(safeExtract(occupation, 'what_they_do', ''));
  const whatTheyDo = stripHtml(whatTheyDoRaw);

  const howToBecomeRaw = extractText(safeExtract(occupation, 'how_to_become_one', ''));
  const howToBecome = stripHtml(howToBecomeRaw);

  const similarOccupations = extractSimilarOccupations(safeExtract(occupation, 'similar_occupations', null));

  const occupationCode = extractText(safeExtract(occupation, 'occupation_code', ''));

  const videoLink = extractText(safeExtract(occupation, 'video_link', ''));

  const demand = formatDemand(growthRate, '2034');

  return {
    id,
    soc: socCode,
    occupation_code: occupationCode,
    title,
    title_short: titleShort,
    description,
    salary: {
      annual: salaryAnnual,
      hourly: salaryHourly,
      range: salaryRange
    },
    education,
    work_experience: workExperience,
    on_the_job_training: onTheJobTraining,
    job_count: jobCount,
    growth: {
      rate: growthRate,
      text: outlookText,
      category: demand.split(' – ')[0]
    },
    openings_per_year: openingsPerYear,
    work_environment: workEnvironment,
    what_they_do: whatTheyDo,
    how_to_become: howToBecome,
    similar_occupations: similarOccupations,
    video_link: videoLink,
    demand,
    source: `BLS OOH ${socCode || occupationCode}`,
    last_updated: new Date().toISOString()
  };
}

/**
 * Parse XML file and extract all careers
 */
async function parseXmlFile() {
  console.log('🚀 Step 1: Parsing BLS OOH XML file...\n');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: XML file not found at ${INPUT_FILE}`);
    console.log('💡 Hint: Ensure xml-compilation.xml is copied to data/source/bls-ooh-full.xml');
    process.exit(1);
  }

  const fileSize = fs.statSync(INPUT_FILE).size;
  console.log(`📂 Reading XML file (${(fileSize / 1024 / 1024).toFixed(2)} MB)...`);

  const xmlContent = fs.readFileSync(INPUT_FILE, 'utf8');

  console.log('⚙️  Parsing XML structure...');
  const parsed = await parseXmlString(xmlContent);

  const occupations = parsed.ooh?.occupation || [];
  console.log(`✅ Found ${occupations.length} occupations in XML\n`);

  console.log('🔄 Extracting career data...');
  const careers = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < occupations.length; i++) {
    try {
      const career = extractCareerData(occupations[i], i + 1);

      if (career.soc && career.title && career.salary.annual > 0) {
        careers.push(career);
        successCount++;

        if (successCount % 50 === 0) {
          console.log(`  ✓ Processed ${successCount} careers...`);
        }
      } else {
        errorCount++;
        console.log(`  ⚠️  Skipped occupation ${i + 1}: Missing required data (SOC: ${career.soc}, Title: ${career.title}, Salary: ${career.salary.annual})`);
      }
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Error processing occupation ${i + 1}:`, error.message);
    }
  }

  console.log(`\n✅ Successfully extracted ${successCount} careers`);
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} occupations skipped due to missing data or errors`);
  }

  console.log(`\n💾 Saving to ${OUTPUT_FILE}...`);
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(careers, null, 2));

  const outputSize = fs.statSync(OUTPUT_FILE).size;
  console.log(`✅ Saved ${careers.length} careers (${(outputSize / 1024).toFixed(2)} KB)\n`);

  console.log('📊 Sample career data:');
  if (careers.length > 0) {
    const sample = careers[0];
    console.log(`  Title: ${sample.title}`);
    console.log(`  SOC: ${sample.soc}`);
    console.log(`  Salary: $${sample.salary.annual.toLocaleString()}`);
    console.log(`  Education: ${sample.education}`);
    console.log(`  Growth: ${sample.growth.rate}%`);
    console.log(`  Description: ${sample.description.substring(0, 100)}...`);
  }

  console.log('\n✅ Step 1 complete: XML parsing successful!\n');
}

if (require.main === module) {
  parseXmlFile().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { parseXmlFile, extractCareerData };
