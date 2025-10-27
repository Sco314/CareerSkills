// SalaryGame/scripts/utils/education-levels.js
// Education level parsing and classification utilities

/**
 * Education level mappings for numeric classification
 */
const EDUCATION_LEVELS = {
  1: {
    level: 1,
    name: 'high_school',
    label: 'High School Diploma',
    keywords: ['high school', 'diploma', 'ged', 'no formal']
  },
  2: {
    level: 2,
    name: 'postsecondary',
    label: 'Postsecondary Nondegree Award',
    keywords: ['postsecondary', 'certificate', 'award', 'some college']
  },
  3: {
    level: 3,
    name: 'associate',
    label: "Associate's Degree",
    keywords: ['associate']
  },
  4: {
    level: 4,
    name: 'bachelor',
    label: "Bachelor's Degree",
    keywords: ['bachelor']
  },
  5: {
    level: 5,
    name: 'master',
    label: "Master's Degree",
    keywords: ['master']
  },
  6: {
    level: 6,
    name: 'doctoral',
    label: 'Doctoral or Professional Degree',
    keywords: ['doctoral', 'doctorate', 'phd', 'professional degree', 'md', 'jd']
  }
};

/**
 * Parse education string to numeric level
 * @param {string} education - Education requirement string
 * @returns {number} Education level (1-6)
 */
function parseEducationLevel(education) {
  if (!education) return 0;

  const eduLower = education.toLowerCase();

  for (const [level, data] of Object.entries(EDUCATION_LEVELS)) {
    for (const keyword of data.keywords) {
      if (eduLower.includes(keyword)) {
        return parseInt(level, 10);
      }
    }
  }

  return 0;
}

/**
 * Get education level metadata
 * @param {number} level - Education level (1-6)
 * @returns {object} Education level metadata
 */
function getEducationMetadata(level) {
  return EDUCATION_LEVELS[level] || {
    level: 0,
    name: 'unknown',
    label: 'Unknown',
    keywords: []
  };
}

/**
 * Format education level for display
 * @param {string|number} education - Education string or level number
 * @returns {string} Formatted education string
 */
function formatEducation(education) {
  if (typeof education === 'number') {
    const metadata = getEducationMetadata(education);
    return metadata.label;
  }

  return education || 'Not specified';
}

/**
 * Group careers by education level
 * @param {Array<object>} careers - Array of career objects
 * @returns {object} Careers grouped by education level
 */
function groupCareersByEducation(careers) {
  const grouped = {};

  for (let i = 1; i <= 6; i++) {
    const metadata = getEducationMetadata(i);
    grouped[metadata.name] = {
      level: i,
      label: metadata.label,
      careers: [],
      count: 0
    };
  }

  grouped.unknown = {
    level: 0,
    label: 'Unknown',
    careers: [],
    count: 0
  };

  for (const career of careers) {
    const level = career.metadata?.education_level || parseEducationLevel(career.education);
    const metadata = getEducationMetadata(level);
    const key = metadata.name;

    if (grouped[key]) {
      grouped[key].careers.push(career.id);
      grouped[key].count++;
    } else {
      grouped.unknown.careers.push(career.id);
      grouped.unknown.count++;
    }
  }

  return grouped;
}

/**
 * Compare education levels
 * @param {number} level1 - First education level
 * @param {number} level2 - Second education level
 * @returns {number} -1 if level1 < level2, 0 if equal, 1 if level1 > level2
 */
function compareEducationLevels(level1, level2) {
  if (level1 < level2) return -1;
  if (level1 > level2) return 1;
  return 0;
}

/**
 * Check if education meets minimum requirement
 * @param {number} actualLevel - Actual education level
 * @param {number} requiredLevel - Required education level
 * @returns {boolean} True if meets requirement
 */
function meetsEducationRequirement(actualLevel, requiredLevel) {
  return actualLevel >= requiredLevel;
}

/**
 * Get all education level names
 * @returns {Array<string>} Array of education level names
 */
function getAllEducationLevelNames() {
  return Object.values(EDUCATION_LEVELS).map(level => level.name);
}

module.exports = {
  EDUCATION_LEVELS,
  parseEducationLevel,
  getEducationMetadata,
  formatEducation,
  groupCareersByEducation,
  compareEducationLevels,
  meetsEducationRequirement,
  getAllEducationLevelNames
};
