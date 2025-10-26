# SalaryGame - Career Salary Comparison Game

A data-driven career education game built on authoritative BLS and O*NET datasets.

## What's Different?

Unlike the original CareerSkills that requires users to paste BLS URLs, SalaryGame pre-builds a complete careers library from authoritative datasets. Users search and select careers instead of scraping URLs.

## Features

- **60+ Pre-loaded Careers**: Complete data from BLS OOH, OES, O*NET
- **Search & Select**: Find careers by title or keywords
- **No Scraping**: All data pre-processed and validated
- **Offline-Ready**: Works without network calls during gameplay
- **Data Pipeline**: Automated scripts to refresh data annually

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Careers Data

```bash
npm run build:data
```

This runs the complete data pipeline:
- Seeds from O*NET occupation data
- Joins with BLS OOH narratives
- Adds OES wage data
- Adds employment projections
- Adds O*NET skills
- Applies fallbacks
- Validates and emits `public/careers.min.json`

### 3. Start the Server

```bash
npm start
```

Visit `http://localhost:3000` to play!

## Project Structure

```
SalaryGame/
├── schema/
│   └── occupation.schema.json       # JSON schema for validation
├── scripts/
│   ├── 01_seed_onet.js             # Seed from O*NET data
│   ├── 02_join_ooh.js              # Join OOH narratives
│   ├── 03_join_oes_wage.js         # Join wage data
│   ├── 04_join_ep_outlook.js       # Join employment projections
│   ├── 05_join_onet_skills.js      # Join skills data
│   ├── 06_fallbacks.js             # Apply fallbacks
│   ├── 07_validate_emit.js         # Validate and emit final JSON
│   └── report_coverage.js          # Data coverage report
├── data/
│   └── raw/                         # Raw data files (gitignored)
│       ├── onet/
│       ├── ooh/
│       ├── oes/
│       └── ep/
├── build/                           # Intermediate build files (gitignored)
│   ├── 01_onet_seed.json
│   ├── 02_with_ooh.json
│   ├── ...
│   └── careers_merged.json          # Full debug data
├── public/
│   └── careers.min.json             # Minified for app (committed)
├── docs/
│   └── DATA_PIPELINE.md             # Full pipeline documentation
├── index.html                       # Game frontend
├── script.js                        # Game logic with search
├── styles.css                       # Styling
├── server.js                        # Simple Express server
└── package.json                     # NPM scripts
```

## Data Pipeline

### Individual Scripts

Run any script independently:

```bash
npm run seed          # 01: Seed O*NET data
npm run join:ooh      # 02: Join OOH data
npm run join:wages    # 03: Join wages
npm run join:outlook  # 04: Join outlook
npm run join:skills   # 05: Join skills
npm run fallbacks     # 06: Apply fallbacks
npm run validate      # 07: Validate & emit
npm run report        # Coverage report
```

### Full Pipeline

```bash
npm run build:data
```

This runs all scripts in sequence and generates:
- `public/careers.min.json` (for app)
- `build/careers_merged.json` (for debugging)

### Data Sources

All data from authoritative U.S. government sources:

1. **O*NET** - Occupation codes, titles, alt titles, skills
   - https://www.onetcenter.org/database.html

2. **BLS OOH** - Job descriptions, education, work environment
   - https://www.bls.gov/ooh/

3. **BLS OES** - Median annual wages
   - https://www.bls.gov/oes/tables.htm

4. **BLS EP** - Employment projections, growth rates
   - https://www.bls.gov/emp/tables.htm

### Updating Data

1. Download updated files to `data/raw/`
2. Run `npm run build:data`
3. Review coverage report
4. Commit `public/careers.min.json`

**Recommended schedule**:
- **OES Wages**: Annually (April/May)
- **Employment Projections**: Biennial (September/October)
- **OOH Narratives**: Biennial (April/May)
- **O*NET**: Quarterly or annually

## Game Features

### Search & Select
- Type to search 60+ careers
- Search by title or alternative names
- View salary, education, and demand
- Add careers to your personal list

### Gameplay
- Compare two careers side-by-side
- Read descriptions, education, demand, environment, skills
- Guess which has the higher salary
- Learn real salary data from BLS

### Scoring
- 10 points per correct answer
- Streak bonuses (3+ streak: +5, 5+ streak: +10)
- Track accuracy and best streak

## Development

### Adding New Careers

1. Add SOC codes to `scripts/01_seed_onet.js`
2. Add OOH URL mappings to `scripts/02_join_ooh.js`
3. Add wage data to `scripts/03_join_oes_wage.js`
4. Add projections to `scripts/04_join_ep_outlook.js`
5. Add skills to `scripts/05_join_onet_skills.js`
6. Run `npm run build:data`

### Adding New Fields

1. Update `schema/occupation.schema.json`
2. Create new join script (e.g., `08_join_certifications.js`)
3. Update validation in `07_validate_emit.js`
4. Update minified output fields if needed
5. Update frontend to consume new fields

## License & Attribution

**Data**: Public domain (U.S. government sources)
**Code**: MIT License

**Attribution**:
"Data sources: U.S. Bureau of Labor Statistics (BLS), O*NET Online"

## Documentation

See `docs/DATA_PIPELINE.md` for complete pipeline documentation.

## Comparison to Original CareerSkills

| Feature | CareerSkills | SalaryGame |
|---------|--------------|------------|
| Data Source | URL scraping | Pre-built library |
| Add Careers | Paste BLS URL | Search & select |
| Network Calls | Every career add | Only on load |
| Data Quality | Variable | Validated |
| Coverage | User-dependent | 60+ careers |
| Refresh | N/A | Automated pipeline |

## Credits

Built with data from:
- U.S. Bureau of Labor Statistics (BLS)
- O*NET Online (Department of Labor)
