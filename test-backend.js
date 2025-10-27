// test-backend.js
// Comprehensive test of backend modules

const { getInstance } = require('./src/data-loader');
const { filter, search, getTop, getRandom, getSimilar } = require('./src/career-query');
const { generate, generateFromCluster, generateMultiple } = require('./src/matchup-generator');

async function runTests() {
  console.log('🧪 Testing Backend Modules\n');

  // Test 1: Data Loader
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test 1: Data Loader');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const loader = await getInstance();
  const careers = loader.getCareers();
  const metadata = loader.getMetadata();

  console.log(`✓ Loaded ${careers.length} careers`);
  console.log(`✓ Metadata has ${Object.keys(metadata.clusters).length} clusters`);
  console.log(`✓ Metadata has ${Object.keys(metadata.salary_tiers).length} salary tiers`);

  const career42 = loader.getCareerById(42);
  console.log(`✓ getCareerById(42): ${career42 ? career42.title : 'NOT FOUND'}`);

  const techCareers = loader.getCareersByCluster('technology');
  console.log(`✓ Technology cluster: ${techCareers.length} careers`);

  const highSalary = loader.getCareersByTier('high');
  console.log(`✓ High salary tier: ${highSalary.length} careers\n`);

  // Test 2: Career Query
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test 2: Career Query');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const searchResults = search('software', { limit: 5 });
  console.log(`✓ Search 'software': ${searchResults.length} results`);
  for (const career of searchResults.slice(0, 3)) {
    console.log(`  - ${career.title} ($${career.salary.toLocaleString()})`);
  }

  const filtered = filter({
    cluster: 'healthcare',
    salaryMin: 50000,
    salaryMax: 100000
  });
  console.log(`✓ Healthcare careers ($50-100k): ${filtered.length} results`);

  const top5 = getTop(5, 'salary');
  console.log(`✓ Top 5 highest paid:`);
  for (const career of top5) {
    console.log(`  - ${career.title}: $${career.salary.toLocaleString()}`);
  }

  const randomTech = getRandom(3, { cluster: 'technology' });
  console.log(`✓ Random tech careers: ${randomTech.length} results`);

  if (searchResults.length > 0) {
    const similar = getSimilar(searchResults[0], 3);
    console.log(`✓ Similar to '${searchResults[0].title}': ${similar.length} results\n`);
  }

  // Test 3: Matchup Generator
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test 3: Matchup Generator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const [career1, career2] = generate({ mode: 'random' });
  console.log(`✓ Random matchup:`);
  console.log(`  A) ${career1.title} - $${career1.salary.toLocaleString()}`);
  console.log(`  B) ${career2.title} - $${career2.salary.toLocaleString()}`);
  const diff = Math.abs(career1.salary - career2.salary);
  const ratio = Math.max(career1.salary, career2.salary) / Math.min(career1.salary, career2.salary);
  console.log(`  Salary diff: $${diff.toLocaleString()}, Ratio: ${ratio.toFixed(2)}x`);

  const [c1, c2] = generateFromCluster('healthcare');
  console.log(`✓ Healthcare matchup:`);
  console.log(`  A) ${c1.title}`);
  console.log(`  B) ${c2.title}`);

  const matchups = generateMultiple(3, { cluster: 'technology' });
  console.log(`✓ Generated ${matchups.length} tech matchups`);
  for (let i = 0; i < matchups.length; i++) {
    console.log(`  ${i + 1}. ${matchups[i][0].title_short || matchups[i][0].title} vs ${matchups[i][1].title_short || matchups[i][1].title}`);
  }

  // Test 4: Data Quality
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test 4: Data Quality Checks');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const allCareers = loader.getCareers();
  const withSalary = allCareers.filter(c => c.salary && c.salary > 0);
  const withEducation = allCareers.filter(c => c.education && c.education.trim() !== '');
  const withCluster = allCareers.filter(c => c.metadata && c.metadata.cluster);
  const withTier = allCareers.filter(c => c.metadata && c.metadata.salary_tier);

  console.log(`✓ Careers with salary: ${withSalary.length}/${allCareers.length} (${(withSalary.length/allCareers.length*100).toFixed(1)}%)`);
  console.log(`✓ Careers with education: ${withEducation.length}/${allCareers.length} (${(withEducation.length/allCareers.length*100).toFixed(1)}%)`);
  console.log(`✓ Careers with cluster: ${withCluster.length}/${allCareers.length} (${(withCluster.length/allCareers.length*100).toFixed(1)}%)`);
  console.log(`✓ Careers with tier: ${withTier.length}/${allCareers.length} (${(withTier.length/allCareers.length*100).toFixed(1)}%)`);

  const salaries = withSalary.map(c => c.salary);
  const minSalary = Math.min(...salaries);
  const maxSalary = Math.max(...salaries);
  const avgSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);

  console.log(`✓ Salary range: $${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`);
  console.log(`✓ Average salary: $${avgSalary.toLocaleString()}`);

  console.log('\n✅ All backend tests passed!\n');
}

runTests().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
