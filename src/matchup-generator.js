// src/matchup-generator.js
// Generate balanced career matchups for gameplay

const { getInstanceSync } = require('./data-loader');
const { filter, getRandom } = require('./career-query');
const { MATCHUP_RULES } = require('./config');

/**
 * Check if two careers make a balanced matchup
 * @param {object} career1 - First career
 * @param {object} career2 - Second career
 * @param {object} rules - Matchup rules
 * @returns {boolean} True if balanced
 */
function isBalanced(career1, career2, rules = MATCHUP_RULES) {
  const salaryDiff = Math.abs(career1.salary - career2.salary);
  if (salaryDiff < rules.minSalaryDiff) {
    return false;
  }

  const higherSalary = Math.max(career1.salary, career2.salary);
  const lowerSalary = Math.min(career1.salary, career2.salary);
  const salaryRatio = higherSalary / lowerSalary;

  if (salaryRatio > rules.maxSalaryRatio) {
    return false;
  }

  if (rules.avoidSameSubfield && career1.soc === career2.soc) {
    return false;
  }

  if (career1.id === career2.id) {
    return false;
  }

  return true;
}

/**
 * Generate random matchup
 * @param {object} config - Configuration
 * @param {string} config.mode - Matchup mode
 * @param {string} config.cluster - Cluster filter
 * @param {number} config.salaryMin - Minimum salary
 * @param {number} config.salaryMax - Maximum salary
 * @param {number} config.minGrowth - Minimum growth rate
 * @returns {Array<object>} Pair of careers [career1, career2]
 */
function generate(config = {}) {
  const {
    mode = 'random',
    cluster,
    salaryMin,
    salaryMax,
    minGrowth,
    tier,
    education
  } = config;

  const loader = getInstanceSync();

  let pool = loader.getCareers();

  const criteria = {};
  if (cluster) criteria.cluster = cluster;
  if (salaryMin) criteria.salaryMin = salaryMin;
  if (salaryMax) criteria.salaryMax = salaryMax;
  if (minGrowth !== undefined) criteria.growthMin = minGrowth;
  if (tier) criteria.tier = tier;
  if (education) criteria.education = education;

  if (Object.keys(criteria).length > 0) {
    pool = filter(criteria);
  }

  if (pool.length < 2) {
    throw new Error('Not enough careers in pool to generate matchup');
  }

  let career1, career2;
  let attempts = 0;
  const maxAttempts = MATCHUP_RULES.maxAttempts;

  do {
    [career1, career2] = getRandom(2, criteria);
    attempts++;

    if (attempts >= maxAttempts) {
      throw new Error('Could not generate balanced matchup after maximum attempts');
    }
  } while (!isBalanced(career1, career2));

  return [career1, career2];
}

/**
 * Generate matchup from specific cluster
 * @param {string} cluster - Cluster name
 * @returns {Array<object>} Pair of careers
 */
function generateFromCluster(cluster) {
  return generate({ mode: 'cluster', cluster });
}

/**
 * Generate matchup from salary range
 * @param {number} min - Minimum salary
 * @param {number} max - Maximum salary
 * @returns {Array<object>} Pair of careers
 */
function generateFromSalaryRange(min, max) {
  return generate({ mode: 'salary-range', salaryMin: min, salaryMax: max });
}

/**
 * Generate matchup from same tier
 * @param {string} tier - Tier name
 * @returns {Array<object>} Pair of careers
 */
function generateFromTier(tier) {
  return generate({ mode: 'same-tier', tier });
}

/**
 * Generate high growth matchup
 * @param {number} minGrowth - Minimum growth rate (default 10)
 * @returns {Array<object>} Pair of careers
 */
function generateHighGrowth(minGrowth = 10) {
  return generate({ mode: 'high-growth', minGrowth });
}

/**
 * Generate matchup with similar education requirements
 * @param {string} education - Education requirement
 * @returns {Array<object>} Pair of careers
 */
function generateByEducation(education) {
  return generate({ mode: 'education', education });
}

/**
 * Generate multiple matchups
 * @param {number} count - Number of matchups
 * @param {object} config - Configuration
 * @returns {Array<Array<object>>} Array of matchup pairs
 */
function generateMultiple(count, config = {}) {
  const matchups = [];
  const usedIds = new Set();

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let matchup;

    do {
      matchup = generate(config);
      attempts++;

      if (attempts >= MATCHUP_RULES.maxAttempts) {
        break;
      }
    } while (
      usedIds.has(matchup[0].id) ||
      usedIds.has(matchup[1].id)
    );

    if (attempts < MATCHUP_RULES.maxAttempts) {
      matchups.push(matchup);
      usedIds.add(matchup[0].id);
      usedIds.add(matchup[1].id);
    }
  }

  return matchups;
}

/**
 * Validate matchup configuration
 * @param {object} config - Configuration to validate
 * @returns {object} Validation result
 */
function validateConfig(config) {
  const errors = [];

  if (config.salaryMin && config.salaryMax && config.salaryMin > config.salaryMax) {
    errors.push('salaryMin cannot be greater than salaryMax');
  }

  if (config.minGrowth !== undefined && (config.minGrowth < -100 || config.minGrowth > 100)) {
    errors.push('minGrowth must be between -100 and 100');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get recommended matchup configuration for difficulty level
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @returns {object} Configuration
 */
function getRecommendedConfig(difficulty = 'medium') {
  const configs = {
    easy: {
      mode: 'same-tier',
      tier: 'entry'
    },
    medium: {
      mode: 'random'
    },
    hard: {
      mode: 'salary-range',
      salaryMin: 50000,
      salaryMax: 150000
    }
  };

  return configs[difficulty] || configs.medium;
}

module.exports = {
  generate,
  generateFromCluster,
  generateFromSalaryRange,
  generateFromTier,
  generateHighGrowth,
  generateByEducation,
  generateMultiple,
  isBalanced,
  validateConfig,
  getRecommendedConfig
};
