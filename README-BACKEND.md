# CareerSkills SalaryGame Backend Documentation

Complete backend system for parsing BLS Occupational Outlook Handbook XML data and providing game APIs.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Data Pipeline](#data-pipeline)
- [Backend API](#backend-api)
- [File Structure](#file-structure)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Overview

The SalaryGame backend system provides:

1. **Data Pipeline**: Parse 14MB BLS XML file into optimized game data
2. **Backend Modules**: Query, filter, and generate career matchups
3. **Metadata System**: Auto-classify careers by salary tier, cluster, education
4. **Validation**: Ensure data quality and completeness

**Key Features**:
- 300+ careers from real BLS data (vs 66 mock careers)
- Automatic career clustering (healthcare, technology, etc.)
- Salary tier classification (entry, mid, upper-mid, high)
- Education level parsing
- Game-optimized data formats

---

## Quick Start

### 1. Install Dependencies

```bash
cd SalaryGame
npm install
```

### 2. Build Data Pipeline

```bash
npm run build:data
```

This runs the complete pipeline:
1. Parse XML (1-parse-xml.js)
2. Validate data (2-validate-data.js)
3. Generate metadata (3-generate-metadata.js)
4. Optimize for game (4-optimize-for-game.js)

### 3. Use Backend API

```javascript
const { getInstance } = require('./src/data-loader');
const { search, filter } = require('./src/career-query');
const { generate } = require('./src/matchup-generator');

// Load data
const loader = await getInstance();

// Search careers
const results = search('nurse');

// Filter by cluster
const techCareers = filter({ cluster: 'technology' });

// Generate matchup
const [career1, career2] = generate({ mode: 'random' });
```

---

## Data Pipeline

### Pipeline Steps

```
data/source/bls-ooh-full.xml (14MB)
  ↓
[1. Parse XML] → data/processed/careers-full.json
  ↓
[2. Validate] → data/processed/validation-report.json
  ↓
[3. Generate Metadata] → data/game/metadata.json
  ↓
[4. Optimize] → data/game/careers-game.json
             → SalaryGame/public/careers.min.json
```

### Script 1: Parse XML

**File**: `SalaryGame/scripts/1-parse-xml.js`

**Purpose**: Extract career data from BLS XML

**Output**: `data/processed/careers-full.json`

**Run**:
```bash
npm run parse
```

**What it extracts**:
- Title, SOC code, description
- Salary (annual, hourly, range)
- Education requirements
- Work experience
- Growth rate and job outlook
- Work environment
- What they do (duties)
- Similar occupations

### Script 2: Validate Data

**File**: `SalaryGame/scripts/2-validate-data.js`

**Purpose**: Validate extracted data

**Output**: `data/processed/validation-report.json`

**Run**:
```bash
npm run validate
```

**Checks**:
- Required fields present
- SOC code format (XX-XXXX)
- Salary range ($0-$500k)
- Description length (≥10 chars)
- Duplicate SOC codes

### Script 3: Generate Metadata

**File**: `SalaryGame/scripts/3-generate-metadata.js`

**Purpose**: Auto-classify and index careers

**Output**: `data/game/metadata.json`

**Run**:
```bash
npm run metadata
```

**Generates**:
- **Salary Tiers**: entry (<$40k), mid ($40-70k), upper-mid ($70-100k), high ($100k+)
- **Clusters**: healthcare, technology, engineering, education, business, trades, etc.
- **Education Levels**: 1=HS, 2=Postsecondary, 3=Associate, 4=Bachelor, 5=Master, 6=Doctoral
- **Keywords**: Top 8 keywords per career
- **Search Text**: Optimized searchable text

### Script 4: Optimize for Game

**File**: `SalaryGame/scripts/4-optimize-for-game.js`

**Purpose**: Create game-optimized data files

**Output**:
- `data/game/careers-game.json` (full game version)
- `SalaryGame/public/careers.min.json` (minified public version)

**Run**:
```bash
npm run optimize
```

**Optimizations**:
- Truncate descriptions (250 chars)
- Remove unnecessary fields
- Compress for minimal file size
- ~70% size reduction

### Script 5: Build All

**File**: `SalaryGame/scripts/5-build-all.js`

**Purpose**: Run complete pipeline

**Run**:
```bash
npm run build:data
```

---

## Backend API

### DataLoader

**File**: `src/data-loader.js`

Singleton for loading and caching game data.

```javascript
const { getInstance } = require('./src/data-loader');

// Get instance (loads data)
const loader = await getInstance();

// Get all careers
const careers = loader.getCareers();

// Get metadata
const metadata = loader.getMetadata();

// Get career by ID
const career = loader.getCareerById(42);

// Get careers by cluster
const techCareers = loader.getCareersByCluster('technology');

// Get careers by salary tier
const highSalary = loader.getCareersByTier('high');

// Get random career
const random = loader.getRandomCareer();
```

### CareerQuery

**File**: `src/career-query.js`

Filter and search careers.

```javascript
const { filter, search, getTop, getRandom } = require('./src/career-query');

// Filter by criteria
const filtered = filter({
  cluster: 'healthcare',
  salaryMin: 50000,
  salaryMax: 100000,
  growthMin: 5
});

// Search by query
const results = search('software engineer', {
  fields: ['title', 'description'],
  limit: 10
});

// Get top 10 highest paid
const topPaid = getTop(10, 'salary');

// Get random careers matching criteria
const randomTech = getRandom(5, { cluster: 'technology' });

// Get similar careers
const similar = getSimilar(someCareer, 5);
```

### MatchupGenerator

**File**: `src/matchup-generator.js`

Generate balanced career matchups for gameplay.

```javascript
const { generate, generateFromCluster } = require('./src/matchup-generator');

// Generate random matchup
const [career1, career2] = generate({ mode: 'random' });

// Generate from specific cluster
const [c1, c2] = generateFromCluster('healthcare');

// Generate from salary range
const [a, b] = generate({ salaryMin: 50000, salaryMax: 100000 });

// Generate from same tier
const matchup = generate({ tier: 'high' });

// Generate multiple matchups
const matchups = generateMultiple(10, { cluster: 'technology' });
```

### Config

**File**: `src/config.js`

Game configuration and constants.

```javascript
const { GAME_MODES, MATCHUP_RULES, FILTER_PRESETS } = require('./src/config');

// Game modes
console.log(GAME_MODES.classic);
console.log(GAME_MODES.sameCluster);

// Matchup rules
console.log(MATCHUP_RULES.minSalaryDiff); // 5000
console.log(MATCHUP_RULES.maxSalaryRatio); // 3

// Filter presets
console.log(FILTER_PRESETS.healthcare);
console.log(FILTER_PRESETS.highSalary);
```

---

## File Structure

```
CareerSkills/
├── data/
│   ├── source/
│   │   └── bls-ooh-full.xml              # 14MB BLS XML data
│   ├── processed/
│   │   ├── careers-full.json             # All careers with metadata
│   │   └── validation-report.json        # Data quality report
│   └── game/
│       ├── careers-game.json             # Game-optimized careers
│       └── metadata.json                 # Clusters, tiers, indexes
│
├── src/                                  # Backend API modules
│   ├── config.js                         # Game configuration
│   ├── data-loader.js                    # Data loading singleton
│   ├── career-query.js                   # Filtering and search
│   └── matchup-generator.js              # Matchup generation
│
├── SalaryGame/
│   ├── scripts/
│   │   ├── utils/
│   │   │   ├── xml-parser.js             # XML parsing utilities
│   │   │   ├── salary-tiers.js           # Salary classification
│   │   │   ├── cluster-detector.js       # Career clustering
│   │   │   └── education-levels.js       # Education parsing
│   │   ├── 1-parse-xml.js                # Step 1: Parse XML
│   │   ├── 2-validate-data.js            # Step 2: Validate
│   │   ├── 3-generate-metadata.js        # Step 3: Generate metadata
│   │   ├── 4-optimize-for-game.js        # Step 4: Optimize
│   │   └── 5-build-all.js                # Run full pipeline
│   ├── public/
│   │   └── careers.min.json              # Minified for frontend
│   └── package.json                      # NPM scripts
│
└── README-BACKEND.md                     # This file
```

---

## Usage Examples

### Example 1: Search and Filter

```javascript
const { getInstance } = require('./src/data-loader');
const { search, filter } = require('./src/career-query');

async function searchTechJobs() {
  await getInstance();

  // Search for software careers
  const results = search('software');

  // Filter tech careers with high salary
  const highPayTech = filter({
    cluster: 'technology',
    salaryMin: 100000
  });

  console.log(`Found ${highPayTech.length} high-paying tech careers`);
  for (const career of highPayTech) {
    console.log(`- ${career.title}: $${career.salary.toLocaleString()}`);
  }
}

searchTechJobs();
```

### Example 2: Generate Matchups

```javascript
const { getInstance } = require('./src/data-loader');
const { generate } = require('./src/matchup-generator');

async function playGame() {
  await getInstance();

  // Generate 5 random matchups
  for (let i = 0; i < 5; i++) {
    const [career1, career2] = generate({ mode: 'random' });

    console.log(`\nRound ${i + 1}:`);
    console.log(`A) ${career1.title} - ${career1.education}`);
    console.log(`B) ${career2.title} - ${career2.education}`);
    console.log(`Which has higher salary?`);

    // Reveal answer
    const higher = career1.salary > career2.salary ? 'A' : 'B';
    console.log(`Answer: ${higher}`);
    console.log(`A: $${career1.salary.toLocaleString()}, B: $${career2.salary.toLocaleString()}`);
  }
}

playGame();
```

### Example 3: Analyze Clusters

```javascript
const { getInstance } = require('./src/data-loader');
const { calculateSalaryStats } = require('./SalaryGame/scripts/utils/salary-tiers');

async function analyzeHealthcare() {
  const loader = await getInstance();
  const metadata = loader.getMetadata();

  const healthcareCluster = metadata.clusters.healthcare;
  const careers = loader.getCareersByIds(healthcareCluster.careers);

  const salaries = careers.map(c => c.salary);
  const stats = calculateSalaryStats(salaries);

  console.log('Healthcare Cluster Analysis:');
  console.log(`Total careers: ${careers.length}`);
  console.log(`Avg salary: $${stats.avg.toLocaleString()}`);
  console.log(`Range: $${stats.min.toLocaleString()} - $${stats.max.toLocaleString()}`);

  // Top 5 highest paid
  const top5 = careers
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 5);

  console.log('\nTop 5 highest paid:');
  for (const career of top5) {
    console.log(`- ${career.title}: $${career.salary.toLocaleString()}`);
  }
}

analyzeHealthcare();
```

---

## Configuration

### Environment Variables

None required. All configuration in `src/config.js`.

### Customizing Matchup Rules

Edit `src/config.js`:

```javascript
const MATCHUP_RULES = {
  minSalaryDiff: 5000,      // Minimum $5k difference
  maxSalaryRatio: 3,        // Max 3x salary difference
  avoidSameSubfield: true,  // Don't match same SOC
  maxAttempts: 100          // Max retries
};
```

### Adding New Game Modes

Edit `src/config.js`:

```javascript
const GAME_MODES = {
  myCustomMode: {
    name: 'myCustomMode',
    label: 'My Custom Mode',
    description: 'Description here',
    filters: { cluster: 'healthcare', salaryMin: 50000 }
  }
};
```

### Adding New Clusters

Edit `SalaryGame/scripts/utils/cluster-detector.js`:

```javascript
const CLUSTER_KEYWORDS = {
  myNewCluster: [
    'keyword1', 'keyword2', 'keyword3'
  ]
};
```

Then rebuild:
```bash
npm run build:data
```

---

## Troubleshooting

### Error: XML file not found

**Problem**: `data/source/bls-ooh-full.xml` doesn't exist

**Solution**:
```bash
cp SalaryGame/xml-compilation.xml data/source/bls-ooh-full.xml
npm run build:data
```

### Error: Data not loaded

**Problem**: Backend modules called before data loaded

**Solution**:
```javascript
const { getInstance } = require('./src/data-loader');
await getInstance(); // Make sure to await!
```

### Error: Not enough careers in pool

**Problem**: Filter criteria too restrictive

**Solution**: Broaden filters or use smaller matchup count

```javascript
// Too restrictive
const matchup = generate({
  cluster: 'agriculture',
  salaryMin: 200000
}); // May fail

// Better
const matchup = generate({ cluster: 'agriculture' });
```

### Validation Errors

**Problem**: Validation fails during build

**Solution**: Check `data/processed/validation-report.json`

```bash
cat data/processed/validation-report.json | grep -A 5 "errors"
```

### Build Performance

**Problem**: Build takes too long

**Solution**: XML parsing is one-time cost. Subsequent runs use cached data.

**Benchmarks**:
- Parse XML: ~3-5 seconds
- Validate: ~1 second
- Generate metadata: ~1-2 seconds
- Optimize: ~1 second
- **Total**: ~7-10 seconds

---

## Data Updates

### Updating BLS Data

When new BLS OOH data is released:

1. Download new `xml-compilation.xml`
2. Replace `data/source/bls-ooh-full.xml`
3. Rebuild:
```bash
npm run build:data
```

### Manual Data Edits

To manually edit career data:

1. Edit `data/processed/careers-full.json`
2. Re-run optimization:
```bash
npm run metadata
npm run optimize
```

---

## API Reference

### DataLoader Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getInstance()` | - | `Promise<DataLoader>` | Get singleton instance |
| `getCareers()` | - | `Array<Career>` | Get all careers |
| `getMetadata()` | - | `Metadata` | Get metadata |
| `getCareerById(id)` | `id: number` | `Career \| null` | Get career by ID |
| `getCareersByCluster(cluster)` | `cluster: string` | `Array<Career>` | Get careers in cluster |
| `getCareersByTier(tier)` | `tier: string` | `Array<Career>` | Get careers in tier |

### CareerQuery Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `filter(criteria)` | `criteria: object` | `Array<Career>` | Filter careers |
| `search(query, options)` | `query: string, options: object` | `Array<Career>` | Search careers |
| `getTop(count, field)` | `count: number, field: string` | `Array<Career>` | Get top N by field |
| `getRandom(count, criteria)` | `count: number, criteria: object` | `Array<Career>` | Get random careers |
| `getSimilar(career, count)` | `career: Career, count: number` | `Array<Career>` | Get similar careers |

### MatchupGenerator Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `generate(config)` | `config: object` | `[Career, Career]` | Generate matchup |
| `generateFromCluster(cluster)` | `cluster: string` | `[Career, Career]` | Generate from cluster |
| `generateMultiple(count, config)` | `count: number, config: object` | `Array<[Career, Career]>` | Generate multiple |

---

## License & Attribution

**Data Source**: U.S. Bureau of Labor Statistics (BLS) Occupational Outlook Handbook

**License**: MIT (code), Public Domain (data)

**Attribution**: "Data sources: U.S. Bureau of Labor Statistics (BLS)"

---

## Support

For issues or questions:

1. Check this documentation
2. Review `SalaryGame/docs/DATA_PIPELINE.md`
3. Inspect `data/processed/validation-report.json`
4. Check console output during build

---

**Last Updated**: October 27, 2025
**Version**: 2.0.0
**Data Source**: BLS OOH 2024-2034 Projections
