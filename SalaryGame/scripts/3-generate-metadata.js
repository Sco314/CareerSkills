#!/usr/bin/env node
// SalaryGame/scripts/3-generate-metadata.js
// Generate metadata (clusters, tiers, education levels) and enrich careers

const fs = require('fs');
const path = require('path');
const { classifySalaryTier, groupCareersByTier } = require('./utils/salary-tiers');
const { detectCluster, groupCareersByCluster } = require('./utils/cluster-detector');
const { parseEducationLevel, groupCareersByEducation } = require('./utils/education-levels');

const INPUT_FILE = path.join(__dirname, '../../data/processed/careers-full.json');
const OUTPUT_CAREERS = path.join(__dirname, '../../data/processed/careers-full.json');
const OUTPUT_METADATA = path.join(__dirname, '../../data/game/metadata.json');

/**
 * Extract keywords from text
 * @param {string} text - Text to extract keywords from
 * @param {number} maxKeywords - Maximum number of keywords
 * @returns {Array<string>} Array of keywords
 */
function extractKeywords(text, maxKeywords = 10) {
  if (!text) return [];

  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'a', 'an', 'as', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'from', 'into'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  const wordCounts = {};
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  const sorted = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return sorted;
}

/**
 * Generate search text for career
 * @param {object} career - Career object
 * @returns {string} Search text
 */
function generateSearchText(career) {
  const parts = [
    career.title,
    career.title_short,
    career.description,
    career.education,
    career.work_environment
  ];

  return parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Enrich career with metadata
 * @param {object} career - Career object
 * @returns {object} Enriched career
 */
function enrichCareer(career) {
  const salaryTier = classifySalaryTier(career.salary.annual);
  const cluster = detectCluster(career.title, career.description);
  const educationLevel = parseEducationLevel(career.education);
  const keywords = extractKeywords(`${career.title} ${career.description} ${career.what_they_do}`, 8);
  const searchText = generateSearchText(career);

  return {
    ...career,
    metadata: {
      salary_tier: salaryTier,
      cluster,
      education_level: educationLevel,
      keywords,
      search_text: searchText
    }
  };
}

/**
 * Generate metadata file
 */
function generateMetadata() {
  console.log('🚀 Step 3: Generating metadata...\n');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: Input file not found at ${INPUT_FILE}`);
    console.log('💡 Hint: Run scripts 1 and 2 first');
    process.exit(1);
  }

  console.log(`📂 Loading careers from ${INPUT_FILE}...`);
  const careers = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  console.log(`✅ Loaded ${careers.length} careers\n`);

  console.log('🏷️  Enriching careers with metadata...');
  const enrichedCareers = careers.map(enrichCareer);

  console.log('  ✓ Classified salary tiers');
  console.log('  ✓ Detected career clusters');
  console.log('  ✓ Parsed education levels');
  console.log('  ✓ Extracted keywords');
  console.log('  ✓ Generated search text\n');

  console.log('📊 Generating metadata indexes...');
  const clusterGroups = groupCareersByCluster(enrichedCareers);
  const tierGroups = groupCareersByTier(enrichedCareers);
  const educationGroups = groupCareersByEducation(enrichedCareers);

  console.log(`  ✓ ${Object.keys(clusterGroups).length} clusters`);
  console.log(`  ✓ ${Object.keys(tierGroups).length} salary tiers`);
  console.log(`  ✓ ${Object.keys(educationGroups).length} education levels\n`);

  const growthCategories = {};
  for (const career of enrichedCareers) {
    const category = career.growth?.category || 'Unknown';
    if (!growthCategories[category]) {
      growthCategories[category] = { careers: [], count: 0 };
    }
    growthCategories[category].careers.push(career.id);
    growthCategories[category].count++;
  }

  const metadata = {
    clusters: clusterGroups,
    salary_tiers: tierGroups,
    education_levels: educationGroups,
    growth_categories: growthCategories,
    total_careers: enrichedCareers.length,
    generated_at: new Date().toISOString()
  };

  console.log('💾 Saving enriched careers...');
  fs.writeFileSync(OUTPUT_CAREERS, JSON.stringify(enrichedCareers, null, 2));
  const careersSize = fs.statSync(OUTPUT_CAREERS).size;
  console.log(`✅ Saved to ${OUTPUT_CAREERS} (${(careersSize / 1024).toFixed(2)} KB)\n`);

  console.log('💾 Saving metadata file...');
  const metadataDir = path.dirname(OUTPUT_METADATA);
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_METADATA, JSON.stringify(metadata, null, 2));
  const metadataSize = fs.statSync(OUTPUT_METADATA).size;
  console.log(`✅ Saved to ${OUTPUT_METADATA} (${(metadataSize / 1024).toFixed(2)} KB)\n`);

  console.log('📊 Metadata Summary:');
  console.log('\n🏢 Top 5 clusters by career count:');
  const topClusters = Object.entries(clusterGroups)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  for (const [cluster, data] of topClusters) {
    console.log(`  ${data.metadata.icon} ${data.metadata.label}: ${data.count} careers`);
  }

  console.log('\n💰 Salary tier distribution:');
  for (const [tier, data] of Object.entries(tierGroups)) {
    console.log(`  ${tier}: ${data.count} careers (avg: $${data.avgSalary.toLocaleString()})`);
  }

  console.log('\n📚 Education level distribution:');
  const topEducation = Object.entries(educationGroups)
    .filter(([key]) => key !== 'unknown')
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  for (const [level, data] of topEducation) {
    console.log(`  ${data.label}: ${data.count} careers`);
  }

  console.log('\n📈 Growth category distribution:');
  const sortedGrowth = Object.entries(growthCategories)
    .sort((a, b) => b[1].count - a[1].count);
  for (const [category, data] of sortedGrowth) {
    console.log(`  ${category}: ${data.count} careers`);
  }

  console.log('\n✅ Step 3 complete: Metadata generated successfully!\n');
}

if (require.main === module) {
  generateMetadata();
}

module.exports = { generateMetadata, enrichCareer };
