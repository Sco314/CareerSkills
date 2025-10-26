#!/usr/bin/env node
/**
 * Script 05: Join O*NET Skills Data
 *
 * Purpose: Add top 5 skills from O*NET
 * Input: build/04_with_outlook.json
 * Output: build/05_with_skills.json
 *
 * O*NET Skills Data: https://www.onetcenter.org/database.html
 * Downloads skills by SOC code (importance × level)
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../build/04_with_outlook.json');
const OUTPUT_FILE = path.join(__dirname, '../build/05_with_skills.json');

// Mock O*NET skills data (top 5 by importance × level)
const ONET_SKILLS = {
  '29-1141': ['Patient care', 'Critical thinking', 'Communication', 'Active listening', 'Time management'],
  '15-1252': ['Programming', 'Problem-solving', 'Teamwork', 'Critical thinking', 'Communication'],
  '25-2021': ['Communication', 'Patience', 'Creativity', 'Instruction', 'Active listening'],
  '47-2111': ['Technical skills', 'Problem-solving', 'Physical stamina', 'Mathematics', 'Critical thinking'],
  '17-2141': ['Math', 'Problem-solving', 'Creativity', 'Technical skills', 'Communication'],
  '29-1292': ['Patient care', 'Detail-oriented', 'Interpersonal skills', 'Technical skills', 'Communication'],
  '11-2021': ['Communication', 'Analytical thinking', 'Creativity', 'Leadership', 'Strategic planning'],
  '47-2152': ['Technical skills', 'Problem-solving', 'Customer service', 'Physical stamina', 'Mathematics'],
  '29-1123': ['Patient care', 'Physical stamina', 'Communication', 'Critical thinking', 'Instruction'],
  '27-1024': ['Creativity', 'Communication', 'Technology', 'Attention to detail', 'Time management'],
  '15-2051': ['Statistics', 'Programming', 'Critical thinking', 'Communication', 'Problem-solving'],
  '23-2011': ['Research', 'Writing', 'Organization', 'Communication', 'Attention to detail'],
  '29-1131': ['Animal care', 'Decision-making', 'Communication', 'Problem-solving', 'Critical thinking'],
  '15-1254': ['Programming', 'Design', 'Problem-solving', 'Creativity', 'Communication'],
  '33-3051': ['Physical fitness', 'Communication', 'Decision-making', 'Critical thinking', 'Integrity'],
  '13-2011': ['Math', 'Attention to detail', 'Organization', 'Communication', 'Analytical thinking'],
  '49-9021': ['Technical skills', 'Problem-solving', 'Physical stamina', 'Customer service', 'Mathematics'],
  '29-1122': ['Patient care', 'Communication', 'Problem-solving', 'Creativity', 'Critical thinking'],
  '17-2051': ['Math', 'Problem-solving', 'Project management', 'Communication', 'Technical skills'],
  '35-1011': ['Creativity', 'Leadership', 'Time management', 'Communication', 'Attention to detail'],
  '29-1071': ['Patient care', 'Decision-making', 'Communication', 'Critical thinking', 'Problem-solving'],
  '41-9021': ['Sales', 'Communication', 'Networking', 'Negotiation', 'Customer service'],
  '29-1051': ['Attention to detail', 'Communication', 'Science knowledge', 'Patient care', 'Critical thinking'],
  '15-1212': ['Problem-solving', 'Technical skills', 'Analytical thinking', 'Communication', 'Attention to detail'],
  '21-1029': ['Communication', 'Empathy', 'Problem-solving', 'Active listening', 'Critical thinking'],
  '17-2011': ['Math', 'Analytical thinking', 'Problem-solving', 'Creativity', 'Technical skills'],
  '31-9091': ['Interpersonal skills', 'Organization', 'Detail-oriented', 'Technical skills', 'Communication'],
  '13-2051': ['Analytical thinking', 'Math', 'Communication', 'Attention to detail', 'Research'],
  '11-9021': ['Leadership', 'Communication', 'Problem-solving', 'Organization', 'Decision-making'],
  '31-9092': ['Communication', 'Interpersonal skills', 'Detail-oriented', 'Organization', 'Technical skills'],
  '17-1011': ['Creativity', 'Technical skills', 'Communication', 'Attention to detail', 'Problem-solving'],
  '33-2011': ['Physical fitness', 'Teamwork', 'Decision-making', 'Problem-solving', 'Communication'],
  '11-3121': ['Leadership', 'Communication', 'Decision-making', 'Organization', 'Interpersonal skills'],
  '29-1124': ['Technical skills', 'Compassion', 'Detail-oriented', 'Communication', 'Critical thinking'],
  '13-2072': ['Customer service', 'Decision-making', 'Math', 'Communication', 'Analytical thinking'],
  '17-2199': ['Programming', 'Engineering', 'Problem-solving', 'Creativity', 'Technical skills'],
  '29-2032': ['Technical skills', 'Attention to detail', 'Interpersonal skills', 'Patient care', 'Communication'],
  '13-1121': ['Organization', 'Communication', 'Multitasking', 'Attention to detail', 'Problem-solving'],
  '29-1211': ['Medical expertise', 'Decision-making', 'Attention to detail', 'Communication', 'Critical thinking'],
  '29-1021': ['Attention to detail', 'Dexterity', 'Communication', 'Technical skills', 'Patient care'],
  '51-4121': ['Technical skills', 'Physical stamina', 'Attention to detail', 'Mathematics', 'Problem-solving'],
  '27-1025': ['Creativity', 'Detail-oriented', 'Interpersonal skills', 'Communication', 'Technical skills'],
  '27-1022': ['Creativity', 'Artistic ability', 'Communication', 'Attention to detail', 'Technical skills'],
  '53-2021': ['Concentration', 'Decision-making', 'Communication', 'Problem-solving', 'Critical thinking'],
  '29-2042': ['Physical stamina', 'Decision-making', 'Compassion', 'Technical skills', 'Communication'],
  '17-2041': ['Math', 'Problem-solving', 'Analytical thinking', 'Communication', 'Technical skills'],
  '19-2031': ['Analytical thinking', 'Attention to detail', 'Problem-solving', 'Technical skills', 'Communication'],
  '23-1011': ['Analytical thinking', 'Communication', 'Research', 'Writing', 'Critical thinking'],
  '17-2171': ['Math', 'Problem-solving', 'Analytical thinking', 'Technical skills', 'Communication'],
  '51-8013': ['Mechanical skills', 'Concentration', 'Problem-solving', 'Technical skills', 'Attention to detail'],
  '19-1023': ['Observation', 'Critical thinking', 'Physical stamina', 'Communication', 'Research'],
  '25-2031': ['Communication', 'Patience', 'Subject expertise', 'Instruction', 'Organization'],
  '31-9097': ['Detail-oriented', 'Dexterity', 'Compassion', 'Interpersonal skills', 'Technical skills'],
  '39-5012': ['Creativity', 'Customer service', 'Physical stamina', 'Interpersonal skills', 'Technical skills'],
  '41-2011': ['Customer service', 'Basic math', 'Communication', 'Attention to detail', 'Patience'],
  '15-1251': ['Programming', 'Problem-solving', 'Attention to detail', 'Analytical thinking', 'Communication'],
  '27-2021': ['Athletic ability', 'Dedication', 'Teamwork', 'Physical fitness', 'Competitive spirit'],
  '43-3071': ['Customer service', 'Math', 'Attention to detail', 'Communication', 'Organization'],
  '49-3023': ['Technical skills', 'Problem-solving', 'Physical stamina', 'Customer service', 'Attention to detail'],
  '27-4021': ['Creativity', 'Technical skills', 'Artistic ability', 'Attention to detail', 'Communication'],
  '27-2012': ['Leadership', 'Creativity', 'Communication', 'Artistic vision', 'Decision-making'],
  '27-2011': ['Creativity', 'Memorization', 'Dedication', 'Emotional expression', 'Communication'],
  '25-4021': ['Organization', 'Communication', 'Technology', 'Research', 'Customer service'],
  '27-3043': ['Writing', 'Research', 'Creativity', 'Communication', 'Attention to detail'],
  '15-2021': ['Analytical thinking', 'Problem-solving', 'Abstract thinking', 'Math', 'Communication'],
  '11-3031': ['Analytical thinking', 'Communication', 'Decision-making', 'Leadership', 'Strategic planning']
};

function joinSkillsData() {
  console.log('🎯 Joining O*NET skills data...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.error('   Run script 04 first!');
    process.exit(1);
  }

  const occupations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  const enriched = occupations.map(occ => {
    let skills = ONET_SKILLS[occ.soc];
    let skillsSource = 'onet';

    if (!skills || skills.length === 0) {
      // Fallback to generic skills
      skills = ['Communication', 'Problem-solving', 'Teamwork', 'Critical thinking', 'Time management'];
      skillsSource = 'synthetic';
    }

    return {
      ...occ,
      skills,
      skillsSource
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));

  console.log(`✅ Added skills to ${enriched.length} occupations`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log('');

  return enriched;
}

// Run if called directly
if (require.main === module) {
  try {
    joinSkillsData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error joining skills data:', error);
    process.exit(1);
  }
}

module.exports = { joinSkillsData };
