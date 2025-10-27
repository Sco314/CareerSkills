#!/usr/bin/env node
// SalaryGame/scripts/4-optimize-for-game.js
// Optimize career data for game (strip unnecessary fields, compress)

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../../data/processed/careers-full.json');
const OUTPUT_GAME = path.join(__dirname, '../../data/game/careers-game.json');
const OUTPUT_PUBLIC = path.join(__dirname, '../public/careers.min.json');

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Create game-optimized career object
 * @param {object} career - Full career object
 * @returns {object} Optimized career object
 */
function optimizeCareer(career) {
  return {
    id: career.id,
    soc: career.soc,
    title: career.title,
    title_short: career.title_short || career.title,
    description: truncateText(career.description, 250),
    salary: career.salary.annual,
    salary_range: career.salary.range,
    salary_hourly: career.salary.hourly,
    education: career.education,
    work_experience: career.work_experience,
    demand: career.demand,
    growth_rate: career.growth?.rate,
    growth_category: career.growth?.category,
    job_count: career.job_count,
    work_environment: truncateText(career.work_environment, 200),
    metadata: {
      salary_tier: career.metadata.salary_tier,
      cluster: career.metadata.cluster,
      education_level: career.metadata.education_level
    },
    source: career.source
  };
}

/**
 * Create minimal career object for public API
 * @param {object} career - Full career object
 * @returns {object} Minimal career object
 */
function createMinimalCareer(career) {
  return {
    id: career.id,
    soc: career.soc,
    title: career.title,
    description: truncateText(career.description, 150),
    education: career.education,
    demand: career.demand,
    salary: career.salary.annual,
    workEnvironment: truncateText(career.work_environment, 150),
    skills: career.metadata?.keywords?.slice(0, 5) || [],
    source: career.source
  };
}

/**
 * Optimize data for game
 */
function optimizeForGame() {
  console.log('🚀 Step 4: Optimizing data for game...\n');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: Input file not found at ${INPUT_FILE}`);
    console.log('💡 Hint: Run scripts 1-3 first');
    process.exit(1);
  }

  console.log(`📂 Loading careers from ${INPUT_FILE}...`);
  const careers = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  const fullSize = fs.statSync(INPUT_FILE).size;
  console.log(`✅ Loaded ${careers.length} careers (${(fullSize / 1024).toFixed(2)} KB)\n`);

  console.log('⚙️  Creating game-optimized version...');
  const gameCareers = careers.map(optimizeCareer);

  const gameDir = path.dirname(OUTPUT_GAME);
  if (!fs.existsSync(gameDir)) {
    fs.mkdirSync(gameDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_GAME, JSON.stringify(gameCareers, null, 2));
  const gameSize = fs.statSync(OUTPUT_GAME).size;
  console.log(`✅ Saved game version (${(gameSize / 1024).toFixed(2)} KB)\n`);

  console.log('⚙️  Creating minified public version...');
  const minimalCareers = careers.map(createMinimalCareer);

  const publicDir = path.dirname(OUTPUT_PUBLIC);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PUBLIC, JSON.stringify(minimalCareers));
  const publicSize = fs.statSync(OUTPUT_PUBLIC).size;
  console.log(`✅ Saved public version (${(publicSize / 1024).toFixed(2)} KB)\n`);

  const compressionRatio = ((1 - publicSize / fullSize) * 100).toFixed(1);

  console.log('📊 Optimization Results:');
  console.log(`  Full data: ${(fullSize / 1024).toFixed(2)} KB`);
  console.log(`  Game version: ${(gameSize / 1024).toFixed(2)} KB (${((1 - gameSize / fullSize) * 100).toFixed(1)}% smaller)`);
  console.log(`  Public version: ${(publicSize / 1024).toFixed(2)} KB (${compressionRatio}% smaller)`);
  console.log(`  Careers: ${careers.length}`);

  console.log('\n📝 Field comparison:');
  console.log('  Full career fields:', Object.keys(careers[0] || {}).length);
  console.log('  Game career fields:', Object.keys(gameCareers[0] || {}).length);
  console.log('  Public career fields:', Object.keys(minimalCareers[0] || {}).length);

  console.log('\n🎮 Sample game career:');
  if (gameCareers.length > 0) {
    const sample = gameCareers[0];
    console.log(`  ID: ${sample.id}`);
    console.log(`  Title: ${sample.title}`);
    console.log(`  Salary: $${sample.salary.toLocaleString()}`);
    console.log(`  Tier: ${sample.metadata.salary_tier}`);
    console.log(`  Cluster: ${sample.metadata.cluster}`);
    console.log(`  Education: ${sample.education}`);
    console.log(`  Description: ${sample.description.substring(0, 80)}...`);
  }

  console.log('\n✅ Step 4 complete: Data optimized for game!\n');
}

if (require.main === module) {
  optimizeForGame();
}

module.exports = { optimizeForGame, optimizeCareer, createMinimalCareer };
