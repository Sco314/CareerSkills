// SalaryGame/scripts/utils/salary-tiers.js
// Salary tier classification utilities

/**
 * Classify salary into tier
 * @param {number} salary - Annual salary in USD
 * @returns {string} Tier name: 'entry', 'mid', 'upper-mid', 'high'
 */
function classifySalaryTier(salary) {
  if (salary < 40000) return 'entry';
  if (salary < 70000) return 'mid';
  if (salary < 100000) return 'upper-mid';
  return 'high';
}

/**
 * Get tier metadata (ranges and descriptions)
 * @param {string} tier - Tier name
 * @returns {object} Tier metadata
 */
function getTierMetadata(tier) {
  const tiers = {
    entry: {
      name: 'entry',
      label: 'Entry Level',
      min: 0,
      max: 40000,
      description: 'Entry-level positions, typically requiring less experience'
    },
    mid: {
      name: 'mid',
      label: 'Mid Range',
      min: 40000,
      max: 70000,
      description: 'Mid-range positions, typically requiring moderate experience'
    },
    'upper-mid': {
      name: 'upper-mid',
      label: 'Upper Mid Range',
      min: 70000,
      max: 100000,
      description: 'Upper mid-range positions, typically requiring significant experience'
    },
    high: {
      name: 'high',
      label: 'High Salary',
      min: 100000,
      max: Infinity,
      description: 'High-salary positions, typically requiring advanced education/experience'
    }
  };

  return tiers[tier] || null;
}

/**
 * Get all tier definitions
 * @returns {object} All tier definitions
 */
function getAllTiers() {
  return {
    entry: getTierMetadata('entry'),
    mid: getTierMetadata('mid'),
    'upper-mid': getTierMetadata('upper-mid'),
    high: getTierMetadata('high')
  };
}

/**
 * Group careers by salary tier
 * @param {Array<object>} careers - Array of career objects with salary field
 * @returns {object} Careers grouped by tier
 */
function groupCareersByTier(careers) {
  const grouped = {
    entry: { careers: [], count: 0, avgSalary: 0 },
    mid: { careers: [], count: 0, avgSalary: 0 },
    'upper-mid': { careers: [], count: 0, avgSalary: 0 },
    high: { careers: [], count: 0, avgSalary: 0 }
  };

  for (const career of careers) {
    const tier = career.metadata?.salary_tier || classifySalaryTier(career.salary);
    if (grouped[tier]) {
      grouped[tier].careers.push(career.id);
      grouped[tier].count++;
    }
  }

  for (const tier in grouped) {
    const tierCareers = careers.filter(c =>
      grouped[tier].careers.includes(c.id)
    );

    if (tierCareers.length > 0) {
      const totalSalary = tierCareers.reduce((sum, c) => sum + c.salary, 0);
      grouped[tier].avgSalary = Math.round(totalSalary / tierCareers.length);
    }
  }

  return grouped;
}

/**
 * Calculate salary statistics
 * @param {Array<number>} salaries - Array of salary values
 * @returns {object} Salary statistics
 */
function calculateSalaryStats(salaries) {
  if (!salaries || salaries.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0 };
  }

  const sorted = [...salaries].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: Math.round(sum / sorted.length),
    median: sorted[Math.floor(sorted.length / 2)]
  };
}

/**
 * Format salary for display
 * @param {number} salary - Annual salary
 * @param {boolean} compact - Use compact format (e.g., $75k)
 * @returns {string} Formatted salary string
 */
function formatSalary(salary, compact = false) {
  if (!salary || salary === 0) return '$0';

  if (compact && salary >= 1000) {
    const k = Math.round(salary / 1000);
    return `$${k}k`;
  }

  return `$${salary.toLocaleString('en-US')}`;
}

/**
 * Parse salary range string to object
 * @param {string} rangeStr - Range string (e.g., "$50,000 to $75,000")
 * @returns {object} Range object with min and max
 */
function parseSalaryRange(rangeStr) {
  if (!rangeStr) return { min: null, max: null };

  const matches = rangeStr.match(/\$?([\d,]+)\s*to\s*\$?([\d,]+)/i);
  if (matches) {
    return {
      min: parseInt(matches[1].replace(/,/g, ''), 10),
      max: parseInt(matches[2].replace(/,/g, ''), 10)
    };
  }

  return { min: null, max: null };
}

module.exports = {
  classifySalaryTier,
  getTierMetadata,
  getAllTiers,
  groupCareersByTier,
  calculateSalaryStats,
  formatSalary,
  parseSalaryRange
};
