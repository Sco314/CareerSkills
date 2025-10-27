#!/usr/bin/env node
// SalaryGame/scripts/5-build-all.js
// Run complete data pipeline

const { parseXmlFile } = require('./1-parse-xml');
const { validateData } = require('./2-validate-data');
const { generateMetadata } = require('./3-generate-metadata');
const { optimizeForGame } = require('./4-optimize-for-game');

/**
 * Run complete build pipeline
 */
async function buildAll() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║   🚀 CareerSkills SalaryGame - Complete Data Pipeline Build    ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    console.log('═══════════════════════════════════════════════════════════════════\n');
    await parseXmlFile();

    console.log('═══════════════════════════════════════════════════════════════════\n');
    validateData();

    console.log('═══════════════════════════════════════════════════════════════════\n');
    generateMetadata();

    console.log('═══════════════════════════════════════════════════════════════════\n');
    optimizeForGame();

    console.log('═══════════════════════════════════════════════════════════════════\n');

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ BUILD COMPLETE!                            ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    console.log(`⏱️  Total build time: ${duration} seconds\n`);

    console.log('📂 Generated files:');
    console.log('  ✓ data/processed/careers-full.json - Full career data with metadata');
    console.log('  ✓ data/processed/validation-report.json - Data quality report');
    console.log('  ✓ data/game/metadata.json - Cluster/tier/education indexes');
    console.log('  ✓ data/game/careers-game.json - Game-optimized career data');
    console.log('  ✓ SalaryGame/public/careers.min.json - Minified public API\n');

    console.log('🎮 Next steps:');
    console.log('  1. Review validation report in data/processed/validation-report.json');
    console.log('  2. Test the game by running: npm start');
    console.log('  3. Visit http://localhost:3000 to play!\n');

    console.log('💡 Tips:');
    console.log('  - Run individual steps: npm run parse, npm run validate, etc.');
    console.log('  - Generate coverage report: npm run report');
    console.log('  - Update source data: Replace data/source/bls-ooh-full.xml and rebuild\n');

  } catch (error) {
    console.error('\n╔══════════════════════════════════════════════════════════════════╗');
    console.error('║                     ❌ BUILD FAILED!                             ║');
    console.error('╚══════════════════════════════════════════════════════════════════╝\n');

    console.error('Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);

    console.error('\n💡 Troubleshooting:');
    console.error('  1. Check that data/source/bls-ooh-full.xml exists');
    console.error('  2. Ensure xml2js is installed: npm install');
    console.error('  3. Review error message above for specific issues');
    console.error('  4. Run individual steps to isolate the problem\n');

    process.exit(1);
  }
}

if (require.main === module) {
  buildAll();
}

module.exports = { buildAll };
