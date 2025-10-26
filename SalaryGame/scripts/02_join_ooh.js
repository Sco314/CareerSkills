#!/usr/bin/env node
/**
 * Script 02: Join OOH (Occupational Outlook Handbook) Data
 *
 * Purpose: Enrich occupations with BLS OOH narrative data
 * Input: build/01_onet_seed.json
 * Output: build/02_with_ooh.json
 *
 * OOH Data includes:
 * - description (What They Do section)
 * - workEnvironment
 * - education (typical entry-level education)
 * - jobOutlookText
 * - oohUrl (canonical URL)
 */

const fs = require('fs');
const path = require('path');
const { OOH_DATA_MAP } = require('./ooh_data_map');

const INPUT_FILE = path.join(__dirname, '../build/01_onet_seed.json');
const OUTPUT_FILE = path.join(__dirname, '../build/02_with_ooh.json');

// SOC to OOH URL mapping
// Format: https://www.bls.gov/ooh/{category}/{slug}.htm
const SOC_TO_OOH_URL = {
  '29-1141': 'healthcare/registered-nurses.htm',
  '15-1252': 'computer-and-information-technology/software-developers.htm',
  '25-2021': 'education-training-and-library/kindergarten-and-elementary-school-teachers.htm',
  '47-2111': 'construction-and-extraction/electricians.htm',
  '17-2141': 'architecture-and-engineering/mechanical-engineers.htm',
  '29-1292': 'healthcare/dental-hygienists.htm',
  '11-2021': 'management/advertising-promotions-and-marketing-managers.htm',
  '47-2152': 'construction-and-extraction/plumbers-pipefitters-and-steamfitters.htm',
  '29-1123': 'healthcare/physical-therapists.htm',
  '27-1024': 'arts-and-design/graphic-designers.htm',
  '15-2051': 'math/data-scientists.htm',
  '23-2011': 'legal/paralegals-and-legal-assistants.htm',
  '29-1131': 'healthcare/veterinarians.htm',
  '15-1254': 'computer-and-information-technology/web-developers.htm',
  '33-3051': 'protective-service/police-and-detectives.htm',
  '13-2011': 'business-and-financial/accountants-and-auditors.htm',
  '49-9021': 'installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm',
  '29-1122': 'healthcare/occupational-therapists.htm',
  '17-2051': 'architecture-and-engineering/civil-engineers.htm',
  '35-1011': 'food-preparation-and-serving/chefs-and-head-cooks.htm',
  '29-1071': 'healthcare/physician-assistants.htm',
  '41-9021': 'sales/real-estate-brokers-and-sales-agents.htm',
  '29-1051': 'healthcare/pharmacists.htm',
  '15-1212': 'computer-and-information-technology/information-security-analysts.htm',
  '21-1029': 'community-and-social-service/social-workers.htm',
  '17-2011': 'architecture-and-engineering/aerospace-engineers.htm',
  '31-9091': 'healthcare/dental-assistants.htm',
  '13-2051': 'business-and-financial/financial-analysts.htm',
  '11-9021': 'management/construction-managers.htm',
  '31-9092': 'healthcare/medical-assistants.htm',
  '17-1011': 'architecture-and-engineering/architects.htm',
  '33-2011': 'protective-service/firefighters.htm',
  '11-3121': 'management/human-resources-managers.htm',
  '29-1124': 'healthcare/radiation-therapists.htm',
  '13-2072': 'business-and-financial/loan-officers.htm',
  '17-2199': 'architecture-and-engineering/engineers.htm',
  '29-2032': 'healthcare/diagnostic-medical-sonographers.htm',
  '13-1121': 'business-and-financial/meeting-convention-and-event-planners.htm',
  '29-1211': 'healthcare/physicians-and-surgeons.htm',
  '29-1021': 'healthcare/dentists.htm',
  '51-4121': 'production/welders-cutters-solderers-and-brazers.htm',
  '27-1025': 'arts-and-design/interior-designers.htm',
  '27-1022': 'arts-and-design/fashion-designers.htm',
  '53-2021': 'transportation-and-material-moving/air-traffic-controllers.htm',
  '29-2042': 'healthcare/emts-and-paramedics.htm',
  '17-2041': 'architecture-and-engineering/chemical-engineers.htm',
  '19-2031': 'life-physical-and-social-science/chemists-and-materials-scientists.htm',
  '23-1011': 'legal/lawyers.htm',
  '17-2171': 'architecture-and-engineering/petroleum-engineers.htm',
  '51-8013': 'production/power-plant-operators-distributors-and-dispatchers.htm',
  '19-1023': 'life-physical-and-social-science/zoologists-and-wildlife-biologists.htm',
  '25-2031': 'education-training-and-library/high-school-teachers.htm',
  '31-9097': 'healthcare/phlebotomists.htm',
  '39-5012': 'personal-care-and-service/barbers-hairstylists-and-cosmetologists.htm',
  '41-2011': 'sales/retail-sales-workers.htm',
  '15-1251': 'computer-and-information-technology/computer-programmers.htm',
  '27-2021': 'entertainment-and-sports/athletes-and-sports-competitors.htm',
  '43-3071': 'office-and-administrative-support/tellers.htm',
  '49-3023': 'installation-maintenance-and-repair/automotive-service-technicians-and-mechanics.htm',
  '27-4021': 'media-and-communication/photographers.htm',
  '27-2012': 'entertainment-and-sports/producers-and-directors.htm',
  '27-2011': 'entertainment-and-sports/actors.htm',
  '25-4021': 'education-training-and-library/librarians.htm',
  '27-3043': 'media-and-communication/writers-and-authors.htm',
  '15-2021': 'math/mathematicians-and-statisticians.htm',
  '11-3031': 'management/financial-managers.htm'
};

function joinOohData() {
  console.log('🔗 Joining OOH data to occupations...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.error('   Run script 01 first!');
    process.exit(1);
  }

  const occupations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  const enriched = occupations.map(occ => {
    const oohPath = SOC_TO_OOH_URL[occ.soc];
    const oohUrl = oohPath ? `https://www.bls.gov/ooh/${oohPath}` : null;

    // Get career-specific OOH data from mapping
    const oohData = OOH_DATA_MAP[occ.soc];

    if (!oohData) {
      console.warn(`⚠️  No OOH data found for ${occ.title} (${occ.soc})`);
    }

    return {
      ...occ,
      description: oohData?.description || 'Description not available',
      workEnvironment: oohData?.workEnvironment || 'Work environment not available',
      education: oohData?.education || 'Education requirements not available',
      jobOutlookText: oohData?.jobOutlookText || 'Job outlook not available',
      oohUrl,
      source: `BLS OOH ${occ.soc}`
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log(`✅ Enriched ${enriched.length} occupations with OOH data`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log('');

  return enriched;
}

// Run if called directly
if (require.main === module) {
  try {
    joinOohData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error joining OOH data:', error);
    process.exit(1);
  }
}

module.exports = { joinOohData };
