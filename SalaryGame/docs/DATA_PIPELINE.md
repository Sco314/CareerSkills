# Data Pipeline Documentation

## Overview

The SalaryGame data pipeline automatically builds a complete careers library from authoritative government and industry sources. This eliminates the need for manual URL scraping and provides consistent, validated career data.

## Architecture

### Data Flow

```
Raw Data Sources → Processing Scripts → Intermediate Builds → Final Output
     ↓                    ↓                    ↓                  ↓
  O*NET              01_seed_onet        01_onet_seed       careers.min.json
  OOH                02_join_ooh         02_with_ooh        (public)
  OES                03_join_oes         03_with_wages
  EP                 04_join_ep          04_with_outlook    careers_merged.json
  O*NET Skills       05_join_skills      05_with_skills     (build/debug)
                     06_fallbacks        06_with_fallbacks
                     07_validate_emit
```

## Data Sources

### 1. O*NET (Occupational Information Network)
- **Source**: https://www.onetcenter.org/database.html
- **Download**: Occupation Data (CSV/Excel)
- **Provides**: SOC codes, occupation titles, alternative titles
- **Update Frequency**: Annually

### 2. BLS OOH (Occupational Outlook Handbook)
- **Source**: https://www.bls.gov/ooh/
- **Provides**: Job descriptions, work environment, education requirements, outlook text
- **Update Frequency**: Every 2 years (even years)

### 3. BLS OES (Occupational Employment Statistics)
- **Source**: https://www.bls.gov/oes/tables.htm
- **Download**: National employment and wage estimates
- **Provides**: Median annual wages by SOC code
- **Update Frequency**: Annually (May reference period)

### 4. BLS EP (Employment Projections)
- **Source**: https://www.bls.gov/emp/tables.htm
- **Download**: Occupational projections and workforce statistics
- **Provides**: Growth rates, annual openings, demand trends
- **Update Frequency**: Every 2 years (even years)

## Pipeline Scripts

### Script 01: Seed O*NET (`01_seed_onet.js`)

**Purpose**: Create master occupation list from O*NET data

**Input**:
- `data/raw/onet/occupations.csv` (downloaded from O*NET)
- OR built-in seed data (66 common occupations)

**Output**: `build/01_onet_seed.json`

**Fields Added**:
- `soc`: Standard Occupational Classification code
- `title`: Official occupation title
- `altTitles`: Alternative job titles for search

**Usage**:
```bash
node scripts/01_seed_onet.js
```

### Script 02: Join OOH Data (`02_join_ooh.js`)

**Purpose**: Enrich with BLS Occupational Outlook Handbook narrative data

**Input**: `build/01_onet_seed.json`

**Output**: `build/02_with_ooh.json`

**Fields Added**:
- `description`: What the occupation does
- `workEnvironment`: Typical work settings
- `education`: Entry-level education required
- `jobOutlookText`: Job outlook summary
- `oohUrl`: Canonical BLS OOH URL
- `source`: Data source identifier

**Usage**:
```bash
node scripts/02_join_ooh.js
```

### Script 03: Join OES Wages (`03_join_oes_wage.js`)

**Purpose**: Add salary information from OES data

**Input**: `build/02_with_ooh.json`

**Output**: `build/03_with_wages.json`

**Fields Added**:
- `salary`: Median annual wage (USD)
- `salaryEstimated`: Flag if salary was estimated

**Fallback Logic**:
- If exact SOC match: Use OES wage
- If no match: Average wages from same 5-digit SOC group
- If no group: Default to $50,000 and flag as estimated

**Usage**:
```bash
node scripts/03_join_oes_wage.js
```

### Script 04: Join Employment Projections (`04_join_ep_outlook.js`)

**Purpose**: Add job outlook and demand information

**Input**: `build/03_with_wages.json`

**Output**: `build/04_with_outlook.json`

**Fields Added**:
- `demand`: Formatted demand string (e.g., "High – 7% (2024–34)")
- `growthRate`: Projected growth percentage
- `openingsPerYear`: Average annual job openings

**Demand Categories**:
- **Very High**: ≥20% growth
- **High**: 10-19% growth
- **Moderate**: 5-9% growth
- **Low**: 0-4% growth
- **Declining**: Negative growth

**Usage**:
```bash
node scripts/04_join_ep_outlook.js
```

### Script 05: Join O*NET Skills (`05_join_onet_skills.js`)

**Purpose**: Add top 5 skills from O*NET

**Input**: `build/04_with_outlook.json`

**Output**: `build/05_with_skills.json`

**Fields Added**:
- `skills`: Array of 3-5 key skills
- `skillsSource`: Source indicator ("onet", "ooh", or "synthetic")

**Skill Selection**:
- Top 5 skills by importance × level score
- If unavailable: Fallback to generic skills

**Usage**:
```bash
node scripts/05_join_onet_skills.js
```

### Script 06: Fallbacks (`06_fallbacks.js`)

**Purpose**: Fill missing data with sensible defaults

**Input**: `build/05_with_skills.json`

**Output**: `build/06_with_fallbacks.json`

**Fallback Rules**:
- Missing description → Generic description based on title
- Missing workEnvironment → "Various settings..."
- Missing education → "Varies by position"
- Missing demand → "Moderate – 3% (2024–34)"
- Missing salary → $50,000 (flagged as estimated)
- Missing skills → ["Communication", "Problem-solving", "Teamwork"]
- Missing source → "BLS OOH {soc}"

**Fields Added**:
- `lastUpdated`: ISO timestamp of data refresh

**Usage**:
```bash
node scripts/06_fallbacks.js
```

### Script 07: Validate & Emit (`07_validate_emit.js`)

**Purpose**: Validate against schema and emit final JSON files

**Input**: `build/06_with_fallbacks.json`

**Output**:
- `public/careers.min.json` (minified for app)
- `build/careers_merged.json` (full data for debugging)

**Validation**:
- SOC code format: `XX-XXXX`
- Title: Not empty
- Description: ≥10 characters
- Education: Not empty
- Demand: Not empty
- Salary: ≥0
- Skills: 3-5 items
- Source: Not empty

**Minified Output**:
Only includes fields needed by frontend:
```json
{
  "id": 1,
  "soc": "29-1141",
  "title": "Registered Nurses",
  "description": "...",
  "education": "Bachelor's degree",
  "demand": "High – 6% (2024–34)",
  "salary": 81220,
  "workEnvironment": "...",
  "skills": ["...", "...", "..."],
  "source": "BLS OOH 29-1141"
}
```

**Usage**:
```bash
node scripts/07_validate_emit.js
```

## Build Commands

### Full Pipeline

Run all scripts in sequence:

```bash
npm run build:data
```

This executes:
```bash
node scripts/01_seed_onet &&
node scripts/02_join_ooh &&
node scripts/03_join_oes_wage &&
node scripts/04_join_ep_outlook &&
node scripts/05_join_onet_skills &&
node scripts/06_fallbacks &&
node scripts/07_validate_emit &&
node scripts/report_coverage
```

### Individual Scripts

Run any script independently:
```bash
node scripts/01_seed_onet.js
node scripts/02_join_ooh.js
# ... etc
```

## Coverage Report

Run `scripts/report_coverage.js` to generate a coverage report:

```bash
node scripts/report_coverage.js
```

**Sample Output**:
```
📊 Data Coverage Report
═══════════════════════════════════════

Total Occupations: 66

Field Coverage:
  ✓ soc:             66/66 (100.0%)
  ✓ title:           66/66 (100.0%)
  ✓ description:     66/66 (100.0%)
  ✓ salary:          66/66 (100.0%)
  ⚠ salaryEstimated:  5/66 (7.6%)
  ✓ skills:          66/66 (100.0%)
  ⚠ skillsSource:    12/66 synthetic (18.2%)

Quality Metrics:
  ✓ All occupations have complete data
  ✓ 95% have exact salary matches
  ✓ 82% have O*NET-sourced skills
```

## Refresh Schedule

### Recommended Update Frequency

1. **OES Wages** (Annual - May data)
   - Download: Late March/Early April
   - Update: April-May

2. **Employment Projections** (Biennial - Even years)
   - Download: September
   - Update: October

3. **OOH Narratives** (Biennial - Even years)
   - Download: April
   - Update: May

4. **O*NET Data** (Quarterly updates, full annual)
   - Download: Any quarter
   - Update: Quarterly or annually

### Quick Refresh Workflow

1. Download updated source files to `data/raw/`
2. Run `npm run build:data`
3. Review coverage report
4. Commit updated `public/careers.min.json`

## Extending the Pipeline

### Adding New Occupations

1. Add SOC codes to O*NET seed data in `01_seed_onet.js`
2. Add OOH URL mappings in `02_join_ooh.js`
3. Add wage data in `03_join_oes_wage.js`
4. Add projections in `04_join_ep_outlook.js`
5. Add skills in `05_join_onet_skills.js`
6. Run full pipeline

### Adding New Fields

1. Update schema in `schema/occupation.schema.json`
2. Create new join script (e.g., `08_join_certifications.js`)
3. Update validation in `07_validate_emit.js`
4. Update minified output fields if needed
5. Update frontend to consume new fields

## Troubleshooting

### Script Fails

- **Check input file exists**: Each script depends on previous script's output
- **Run scripts in order**: 01 → 02 → 03 → 04 → 05 → 06 → 07
- **Check Node.js version**: Requires Node.js 14+

### Validation Errors

- Review `build/careers_merged.json` for problematic records
- Check SOC code format (must be `XX-XXXX`)
- Ensure all required fields are present
- Verify array lengths (skills must be 3-5 items)

### Missing Data

- Check source file locations in `data/raw/`
- Review fallback logic in script 06
- Run coverage report to identify gaps

## License & Attribution

All data sourced from public U.S. government sources:
- **O*NET**: Public domain, developed under Department of Labor
- **BLS Data**: Public domain, no copyright restrictions
- **Attribution**: "Data sources: U.S. Bureau of Labor Statistics (BLS), O*NET Online"

## Contact & Support

For issues with the data pipeline:
1. Check this documentation
2. Review script comments
3. Run coverage report
4. Check source data files
