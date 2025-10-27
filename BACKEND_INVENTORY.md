# SalaryGame Backend Inventory & Architecture Analysis

**Date**: October 27, 2025
**Branch**: claude/rebuild-salary-game-backend-011CUWk2orQUesRRVRUqaJww
**Purpose**: Phase 1 analysis for rebuilding backend system with real BLS data

---

## Existing Files Analysis

### /data Folder
**Location**: `/home/user/CareerSkills/data/`
**Contents**:
- `careers.json` (36 KB) - Original CareerSkills app data, different format
- No subdirectories (raw/, processed/, game/ don't exist)

**Purpose**: Used by the original CareerSkills app (separate from SalaryGame)

**Status**: ✅ Keep as-is (separate system)

---

### /SalaryGame/scripts Folder
**Location**: `/home/user/CareerSkills/SalaryGame/scripts/`
**Existing Scripts** (7 total + 1 report):

1. **01_seed_onet.js** (114 lines)
   - Seeds 66 occupations from hardcoded O*NET data
   - Includes SOC codes, titles, alternative titles
   - ⚠️ Uses mock data, not actual O*NET CSV

2. **02_join_ooh.js** (80+ lines)
   - Mock OOH data - hardcoded URL mappings
   - ⚠️ Generates generic descriptions, NOT parsing xml-compilation.xml
   - All descriptions say "Provide and coordinate patient care..."

3. **03_join_oes_wage.js**
   - Mock wage data from hardcoded values
   - ⚠️ Not using real OES data

4. **04_join_ep_outlook.js**
   - Mock employment projections
   - ⚠️ Not using real EP data

5. **05_join_onet_skills.js**
   - Mock skills from hardcoded values
   - ⚠️ Not using real O*NET skills database

6. **06_fallbacks.js**
   - Applies fallback values for missing fields
   - ✅ Logic is good, can be adapted

7. **07_validate_emit.js**
   - Validates against JSON schema
   - Emits careers.min.json and careers_merged.json
   - ✅ Validation logic is good, can be adapted

8. **report_coverage.js**
   - Generates coverage report
   - ✅ Useful for QA

**Current Pipeline**:
```bash
npm run build:data
# Runs: 01 → 02 → 03 → 04 → 05 → 06 → 07 → report
```

**Critical Issue**: 🚨 The existing pipeline uses **MOCK DATA** throughout. The xml-compilation.xml file exists but is **NOT being parsed**!

---

### xml-compilation.xml - THE GOLD MINE! 💎
**Location**: `/home/user/CareerSkills/SalaryGame/xml-compilation.xml`
**Size**: 14 MB (14,000,000 bytes)
**Type**: BLS Occupational Outlook Handbook XML compilation

**Structure** (verified):
```xml
<?xml version="1.0" encoding="utf-8"?>
<ooh>
  <publication_title>Occupational Outlook Handbook</publication_title>
  <current_year>2024</current_year>
  <projection_year>2034</projection_year>
  <last_updated>9/29/2025</last_updated>

  <occupation>
    <title>Accountants and Auditors</title>
    <description>Accountants and auditors prepare and examine financial records.</description>
    <occupation_code>B047</occupation_code>
    <soc_coverage>
      <soc_code>13-2011</soc_code>
    </soc_coverage>
    <occupation_name_short_singular>Accountant or Auditor</occupation_name_short_singular>

    <quick_facts>
      <qf_median_pay_annual>
        <value>81680</value>
        <range>$75,000 to $99,999</range>
      </qf_median_pay_annual>
      <qf_median_pay_hourly>
        <value>39.27</value>
      </qf_median_pay_hourly>
      <qf_entry_level_education>
        <value>Bachelor's degree</value>
      </qf_entry_level_education>
      <qf_work_experience>
        <value>None</value>
      </qf_work_experience>
      <!-- ... more quick_facts fields -->
    </quick_facts>

    <!-- Rich narrative sections with HTML content -->
    <what_they_do>...</what_they_do>
    <summary_work_environment>...</summary_work_environment>
    <how_to_become_one>...</how_to_become_one>
    <qf_employment_outlook>...</qf_employment_outlook>
    <similar_occupations>...</similar_occupations>
  </occupation>

  <!-- Hundreds more occupations... -->
</ooh>
```

**Data Available**:
- ✅ Title (multiple formats)
- ✅ Description
- ✅ SOC code (13-2011 format)
- ✅ Median salary (annual + hourly + range)
- ✅ Education requirements
- ✅ Work experience required
- ✅ Job count (qf_number_of_jobs)
- ✅ Growth rate (qf_employment_outlook with percent)
- ✅ Work environment (narrative text)
- ✅ Duties (what_they_do section with HTML)
- ✅ Similar occupations list
- ✅ How to become one (education paths)

**Status**: 🎯 **PRIMARY DATA SOURCE - NOT CURRENTLY BEING USED!**

---

### /SalaryGame/schema Folder
**Location**: `/home/user/CareerSkills/SalaryGame/schema/`
**Contents**:
- `occupation.schema.json` (98 lines)

**Schema Fields**:
```json
{
  "required": ["soc", "title", "description", "education", "demand", "salary", "skills", "source"],
  "properties": {
    "soc": "XX-XXXX format",
    "title": "string",
    "altTitles": "array",
    "description": "string (min 10 chars)",
    "education": "string",
    "demand": "string (e.g., 'High – 7% (2024–34)')",
    "salary": "number (≥0)",
    "salaryEstimated": "boolean",
    "workEnvironment": "string",
    "skills": "array (3-5 items)",
    "skillsSource": "enum: onet, ooh, synthetic",
    "source": "string",
    "oohUrl": "uri",
    "growthRate": "number",
    "openingsPerYear": "number",
    "lastUpdated": "date-time"
  }
}
```

**Status**: ✅ Good schema, can be adapted for XML-sourced data

---

### /SalaryGame/build Folder
**Location**: `/home/user/CareerSkills/SalaryGame/build/`
**Contents** (intermediate pipeline outputs):
- `01_onet_seed.json` (9 KB)
- `02_with_ooh.json` (38 KB)
- `03_with_wages.json` (42 KB)
- `04_with_outlook.json` (48 KB)
- `05_with_skills.json` (59 KB)
- `06_with_fallbacks.json` (62 KB)
- `careers_merged.json` (62 KB) - Full debug data

**Purpose**: Intermediate build artifacts showing progressive enrichment

**Status**: ✅ Keep folder structure, regenerate files with real data

---

### /SalaryGame/docs Folder
**Location**: `/home/user/CareerSkills/SalaryGame/docs/`
**Contents**:
- `DATA_PIPELINE.md` (368 lines) - Comprehensive pipeline documentation

**Status**: ✅ Excellent documentation, update to reflect XML parsing

---

### /SalaryGame/public Folder
**Location**: `/home/user/CareerSkills/SalaryGame/public/`
**Contents**:
- `careers.min.json` (32 KB) - Final minified output for frontend

**Current Data**: 66 careers with mock descriptions

**Status**: ✅ Keep folder, regenerate with real XML data

---

### Other SalaryGame Files

**Frontend (Keep as-is per requirements)**:
- `index.html` - Game interface
- `script.js` - Game logic with search
- `styles.css` - Styling

**Infrastructure**:
- `package.json` - NPM scripts for pipeline
- `server.js` - Dev server
- `README.md` - Project documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation notes

**Dependencies**: Only Express & CORS (no xml2js yet!)

---

## Architecture Decisions

### KEEP (Use as-is) ✅

1. **Frontend Files** - Per requirements, keep UI/UX unchanged:
   - `index.html`
   - `script.js`
   - `styles.css`

2. **Schema** - Good validation structure:
   - `schema/occupation.schema.json`

3. **Documentation** - Well-written, update to reflect changes:
   - `docs/DATA_PIPELINE.md`
   - `README.md`
   - `IMPLEMENTATION_SUMMARY.md`

4. **Infrastructure**:
   - `package.json` (add xml2js dependency)
   - `server.js`
   - `build/` folder structure
   - `public/` folder structure

5. **Original CareerSkills** - Separate system:
   - `/data/careers.json`

---

### REFACTOR (Rebuild with real data) 🔄

1. **All 7 pipeline scripts** - Current scripts use mock data:
   - ❌ **01_seed_onet.js** → Hardcoded 66 careers
   - ❌ **02_join_ooh.js** → Mock descriptions (NOT parsing XML!)
   - ❌ **03_join_oes_wage.js** → Mock wages
   - ❌ **04_join_ep_outlook.js** → Mock outlook
   - ❌ **05_join_onet_skills.js** → Mock skills
   - ⚠️ **06_fallbacks.js** → Logic OK, adapt for XML
   - ⚠️ **07_validate_emit.js** → Validation OK, keep
   - ✅ **report_coverage.js** → Keep as-is

**Why refactor?**
- The xml-compilation.xml contains ALL the data we need!
- Current scripts don't parse the XML at all
- Descriptions are generic/wrong
- We can get 300+ careers instead of 66

---

### DELETE (Obsolete/redundant) 🗑️

**Nothing to delete!** The existing structure is good, we're just rebuilding the data source.

---

### CREATE NEW 🆕

1. **XML Parser Module**:
   - `scripts/utils/xml-parser.js` - Parse xml-compilation.xml

2. **Data Classification Modules**:
   - `scripts/utils/salary-tiers.js` - Classify by salary
   - `scripts/utils/cluster-detector.js` - Detect career clusters
   - `scripts/utils/education-levels.js` - Parse education requirements

3. **Backend API Modules** (for frontend integration):
   - `src/data-loader.js` - Load and cache game data
   - `src/career-query.js` - Filter/search careers
   - `src/matchup-generator.js` - Generate career pairs
   - `src/config.js` - Game configuration

4. **New Data Folders**:
   - `data/source/` - Copy xml-compilation.xml here
   - `data/processed/` - careers-full.json, validation-report.json
   - `data/game/` - careers-game.json, metadata.json

5. **Documentation**:
   - `README-BACKEND.md` - New backend API documentation

---

## Recommended File Structure (Final)

```
CareerSkills/ (branch: claude/rebuild-salary-game-backend-011CUWk2orQUesRRVRUqaJww)
│
├── data/
│   ├── careers.json                      # [KEEP] Original CareerSkills data
│   ├── source/                           # [NEW]
│   │   └── bls-ooh-full.xml             # [NEW] Copy of xml-compilation.xml
│   ├── processed/                        # [NEW]
│   │   ├── careers-full.json            # [NEW] All careers, normalized
│   │   └── validation-report.json       # [NEW] Data quality checks
│   └── game/                             # [NEW]
│       ├── careers-game.json            # [NEW] Game-optimized (~500KB)
│       ├── metadata.json                # [NEW] Clusters, filters (~50KB)
│       └── matchups-featured.json       # [NEW] Optional curated pairs
│
├── src/                                  # [NEW] Backend modules
│   ├── data-loader.js                   # [NEW] Load & cache game data
│   ├── career-query.js                  # [NEW] Filter/search careers
│   ├── matchup-generator.js             # [NEW] Generate career pairs
│   └── config.js                        # [NEW] Game configuration
│
├── SalaryGame/
│   ├── schema/
│   │   └── occupation.schema.json       # [KEEP] May need minor updates
│   │
│   ├── scripts/
│   │   ├── 1-parse-xml.js               # [REBUILD] Parse XML → careers-full.json
│   │   ├── 2-validate-data.js           # [REBUILD] Check data quality
│   │   ├── 3-generate-metadata.js       # [REBUILD] Auto-tag & cluster
│   │   ├── 4-optimize-for-game.js       # [REBUILD] Create game-ready files
│   │   ├── 5-build-all.js               # [REBUILD] Run entire pipeline
│   │   ├── report_coverage.js           # [KEEP] Coverage report
│   │   └── utils/                       # [NEW]
│   │       ├── xml-parser.js            # [NEW] XML parsing utilities
│   │       ├── salary-tiers.js          # [NEW] Salary classification
│   │       ├── cluster-detector.js      # [NEW] Career clustering
│   │       └── education-levels.js      # [NEW] Education parsing
│   │
│   ├── build/                            # [KEEP] Regenerate contents
│   │   ├── 01_parsed_xml.json           # [NEW] Raw parsed XML
│   │   ├── 02_validated.json            # [NEW] After validation
│   │   ├── 03_with_metadata.json        # [NEW] With tiers/clusters
│   │   └── 04_game_ready.json           # [NEW] Optimized for game
│   │
│   ├── public/
│   │   └── careers.min.json             # [REGENERATE] With real data
│   │
│   ├── docs/
│   │   └── DATA_PIPELINE.md             # [UPDATE] Reflect XML parsing
│   │
│   ├── index.html                       # [KEEP] Frontend unchanged
│   ├── script.js                        # [KEEP] Frontend unchanged
│   ├── styles.css                       # [KEEP] Frontend unchanged
│   ├── server.js                        # [KEEP]
│   ├── package.json                     # [UPDATE] Add xml2js
│   ├── README.md                        # [UPDATE]
│   ├── IMPLEMENTATION_SUMMARY.md        # [UPDATE]
│   └── xml-compilation.xml              # [KEEP] Source data (14MB)
│
├── README-BACKEND.md                     # [NEW] Backend documentation
└── BACKEND_INVENTORY.md                  # [THIS FILE]
```

---

## Critical Findings

### 🎯 Main Discovery: XML File Not Being Used!

The 14MB `xml-compilation.xml` file contains rich, real BLS data but **none of the scripts parse it**. The current pipeline generates mock data instead.

**What the XML provides** (that we're not using):
1. ✅ Real occupation descriptions (not "Provide and coordinate patient care..." for everyone!)
2. ✅ Actual salary data with ranges
3. ✅ Real education requirements
4. ✅ Growth rates and employment projections
5. ✅ Work environment details
6. ✅ What They Do sections (rich HTML content)
7. ✅ Similar occupations mappings
8. ✅ 300+ occupations (vs current 66 hardcoded)

### 📊 Current System Stats

- **Occupations**: 66 (hardcoded seed data)
- **Data Source**: Mock data in scripts
- **careers.min.json**: 32 KB (mock descriptions)
- **Build time**: ~5 seconds (no real processing)
- **Data quality**: Mock/generic descriptions

### 🎯 Target System Stats (After Rebuild)

- **Occupations**: 300+ (from XML parsing)
- **Data Source**: xml-compilation.xml (14 MB real BLS data)
- **careers.min.json**: ~500 KB (real data, optimized)
- **Build time**: ~10-15 seconds (XML parsing + processing)
- **Data quality**: Real BLS OOH data with validation

---

## Data Transformation Pipeline (Proposed)

### Old Pipeline (Current - Mock Data)
```
Hardcoded arrays → Mock descriptions → Mock wages → Mock skills → Emit
```

### New Pipeline (Proposed - Real XML Data)
```
xml-compilation.xml (14MB)
  ↓
1. Parse XML → Extract all <occupation> nodes
  ↓
2. Validate → Check required fields, data types
  ↓
3. Generate Metadata → Auto-tag (tiers, clusters, education levels)
  ↓
4. Optimize for Game → Strip HTML, truncate descriptions, compress
  ↓
5. Emit → careers-game.json (~500KB), metadata.json (~50KB)
```

---

## Key Implementation Notes

### 1. XML Parsing Strategy

**Use Node.js built-in or xml2js**:
```javascript
const xml2js = require('xml2js');
const fs = require('fs');

async function parseXML() {
  const xmlContent = fs.readFileSync('xml-compilation.xml', 'utf8');
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlContent);
  return result.ooh.occupation; // Array of all occupations
}
```

### 2. Field Extraction

**Map XML structure to our schema**:
```javascript
{
  id: incrementing_id,
  soc: occupation.soc_coverage[0].soc_code[0],
  title: occupation.title[0],
  title_short: occupation.occupation_name_short_singular[0],
  description: stripHtml(occupation.description[0]),
  salary: {
    annual: parseInt(occupation.quick_facts[0].qf_median_pay_annual[0].value[0]),
    hourly: parseFloat(occupation.quick_facts[0].qf_median_pay_hourly[0].value[0]),
    range: occupation.quick_facts[0].qf_median_pay_annual[0].range[0]
  },
  education: occupation.quick_facts[0].qf_entry_level_education[0].value[0],
  work_experience: occupation.quick_facts[0].qf_work_experience[0].value[0],
  // ... etc
}
```

### 3. Data Quality Checks

**Validation rules**:
- ✅ SOC code format: `XX-XXXX`
- ✅ Salary: numeric, > 0, < $500,000
- ✅ Title: not empty
- ✅ Description: ≥ 10 characters
- ✅ Education: valid education level
- ❌ Flag any missing required fields

### 4. Metadata Generation

**Auto-classify careers**:
```javascript
// Salary tiers
const tier =
  salary < 40000 ? 'entry' :
  salary < 70000 ? 'mid' :
  salary < 100000 ? 'upper-mid' : 'high';

// Cluster detection (keyword-based)
const cluster = detectCluster(title, description);
// → 'healthcare', 'technology', 'education', etc.

// Education level (numeric for sorting)
const educationLevel = parseEducationLevel(education);
// → 1 (HS), 2 (Associate), 3 (Bachelor's), 4 (Master's), 5 (Doctoral)
```

### 5. Optimization for Game

**Strip unnecessary data**:
- Remove HTML tags from descriptions
- Truncate descriptions to 150 chars for list view
- Remove detailed "how to become" sections
- Keep only essential gameplay fields
- Compress similar_occupations to just IDs

**Target**: Reduce from 3MB full data to ~500KB game data

---

## Dependencies to Add

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "xml2js": "^0.6.2"  // [ADD] For XML parsing
  }
}
```

---

## Risks & Considerations

### 1. XML Parsing Performance
- **Risk**: 14MB XML file may be slow to parse
- **Mitigation**: Cache parsed results, only rebuild when needed
- **Estimate**: ~2-5 seconds parse time acceptable

### 2. Data Quality Variance
- **Risk**: XML may have inconsistent field presence
- **Mitigation**: Robust fallback logic, validation reporting

### 3. HTML Content in XML
- **Risk**: Description fields contain HTML tags
- **Mitigation**: Strip HTML tags, preserve plain text

### 4. SOC Code Mismatches
- **Risk**: Some SOC codes in XML may not match frontend expectations
- **Mitigation**: Validate SOC format, flag anomalies

### 5. Frontend Compatibility
- **Risk**: New data structure may break existing frontend
- **Mitigation**: Keep same output format in careers.min.json

---

## Success Criteria

✅ **Phase 1 Complete** (This Document):
- Inventory all existing files
- Identify xml-compilation.xml as primary data source
- Document current vs. target architecture
- Get approval for Phase 2

🎯 **Phase 2 Success** (Implementation):
1. Parse xml-compilation.xml successfully (300+ occupations)
2. Generate real descriptions (not mock "patient care" text)
3. Validate 100% of extracted data
4. Create game-optimized files (~500KB total)
5. Backend modules load data efficiently
6. Frontend works unchanged with new data
7. Build pipeline runs in < 15 seconds
8. Documentation updated

---

## Questions for Approval

Before proceeding to Phase 2, please confirm:

1. ✅ **Use xml-compilation.xml as primary source?** (vs. current mock data)
2. ✅ **Target 300+ careers?** (vs. current 66)
3. ✅ **Rebuild all 7 scripts?** (vs. trying to adapt existing)
4. ✅ **Add xml2js dependency?** (for parsing)
5. ✅ **Create new /src backend modules?** (for frontend integration)
6. ✅ **Keep existing schema?** (with minor additions)

---

## Estimated Effort (Phase 2)

**Script Development**:
- 1-parse-xml.js: ~200 lines (XML parsing + field extraction)
- 2-validate-data.js: ~150 lines (validation + reporting)
- 3-generate-metadata.js: ~200 lines (clustering + tagging)
- 4-optimize-for-game.js: ~150 lines (compression + optimization)
- 5-build-all.js: ~50 lines (pipeline orchestration)
- utils/*.js: ~300 lines total (parsing helpers)

**Backend Modules**:
- data-loader.js: ~100 lines
- career-query.js: ~150 lines
- matchup-generator.js: ~200 lines
- config.js: ~100 lines

**Documentation**:
- README-BACKEND.md: ~200 lines
- Update DATA_PIPELINE.md: ~100 lines
- Update README.md: ~50 lines

**Total**: ~1,600 lines of production code + documentation

---

## Next Steps (Awaiting Approval)

⏸️  **PHASE 1 COMPLETE - WAITING FOR APPROVAL**

Once approved, Phase 2 will:
1. Install xml2js dependency
2. Create folder structure (data/source, data/processed, data/game, src/)
3. Build 5 pipeline scripts + utilities
4. Build 4 backend modules
5. Generate documentation
6. Run full build and validate
7. Commit and push to branch

---

**Status**: ✅ Phase 1 Complete - Ready for Review
**Next Action**: Wait for developer approval to proceed to Phase 2
