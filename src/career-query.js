// src/career-query.js
// Career filtering and search utilities

const { getInstanceSync } = require('./data-loader');

/**
 * Filter careers by criteria
 * @param {object} criteria - Filter criteria
 * @param {string} criteria.cluster - Filter by cluster
 * @param {number} criteria.salaryMin - Minimum salary
 * @param {number} criteria.salaryMax - Maximum salary
 * @param {string} criteria.education - Filter by education level
 * @param {number} criteria.growthMin - Minimum growth rate
 * @param {string} criteria.tier - Filter by salary tier
 * @returns {Array<object>} Filtered careers
 */
function filter(criteria = {}) {
  const loader = getInstanceSync();
  let careers = loader.getCareers();

  if (criteria.cluster) {
    careers = careers.filter(c => c.metadata?.cluster === criteria.cluster);
  }

  if (criteria.salaryMin !== undefined) {
    careers = careers.filter(c => c.salary >= criteria.salaryMin);
  }

  if (criteria.salaryMax !== undefined) {
    careers = careers.filter(c => c.salary <= criteria.salaryMax);
  }

  if (criteria.education) {
    careers = careers.filter(c =>
      c.education?.toLowerCase().includes(criteria.education.toLowerCase())
    );
  }

  if (criteria.growthMin !== undefined) {
    careers = careers.filter(c => c.growth_rate >= criteria.growthMin);
  }

  if (criteria.tier) {
    careers = careers.filter(c => c.metadata?.salary_tier === criteria.tier);
  }

  if (criteria.educationLevel !== undefined) {
    careers = careers.filter(c => c.metadata?.education_level === criteria.educationLevel);
  }

  return careers;
}

/**
 * Search careers by query string
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @param {Array<string>} options.fields - Fields to search in
 * @param {number} options.limit - Maximum results
 * @param {boolean} options.caseSensitive - Case sensitive search
 * @returns {Array<object>} Matching careers
 */
function search(query, options = {}) {
  const {
    fields = ['title', 'title_short', 'description', 'education'],
    limit = 50,
    caseSensitive = false
  } = options;

  const loader = getInstanceSync();
  const careers = loader.getCareers();

  const searchTerm = caseSensitive ? query : query.toLowerCase();

  const results = careers.filter(career => {
    for (const field of fields) {
      const value = career[field];
      if (value) {
        const searchValue = caseSensitive ? value : value.toLowerCase();
        if (searchValue.includes(searchTerm)) {
          return true;
        }
      }
    }

    if (career.metadata?.search_text) {
      const searchText = caseSensitive
        ? career.metadata.search_text
        : career.metadata.search_text.toLowerCase();

      if (searchText.includes(searchTerm)) {
        return true;
      }
    }

    return false;
  });

  return results.slice(0, limit);
}

/**
 * Get careers by IDs
 * @param {Array<number>} ids - Array of career IDs
 * @returns {Array<object>} Array of careers
 */
function getByIds(ids) {
  const loader = getInstanceSync();
  return loader.getCareersByIds(ids);
}

/**
 * Sort careers by field
 * @param {Array<object>} careers - Careers to sort
 * @param {string} field - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array<object>} Sorted careers
 */
function sortBy(careers, field, order = 'asc') {
  return [...careers].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });
}

/**
 * Get top N careers by field
 * @param {number} count - Number of careers to get
 * @param {string} field - Field to sort by
 * @param {object} criteria - Optional filter criteria
 * @returns {Array<object>} Top N careers
 */
function getTop(count, field, criteria = {}) {
  let careers = filter(criteria);
  careers = sortBy(careers, field, 'desc');
  return careers.slice(0, count);
}

/**
 * Get bottom N careers by field
 * @param {number} count - Number of careers to get
 * @param {string} field - Field to sort by
 * @param {object} criteria - Optional filter criteria
 * @returns {Array<object>} Bottom N careers
 */
function getBottom(count, field, criteria = {}) {
  let careers = filter(criteria);
  careers = sortBy(careers, field, 'asc');
  return careers.slice(0, count);
}

/**
 * Get careers in salary range
 * @param {number} min - Minimum salary
 * @param {number} max - Maximum salary
 * @returns {Array<object>} Careers in range
 */
function getBySalaryRange(min, max) {
  return filter({ salaryMin: min, salaryMax: max });
}

/**
 * Get careers by cluster
 * @param {string} cluster - Cluster name
 * @returns {Array<object>} Careers in cluster
 */
function getByCluster(cluster) {
  const loader = getInstanceSync();
  return loader.getCareersByCluster(cluster);
}

/**
 * Get careers by tier
 * @param {string} tier - Tier name
 * @returns {Array<object>} Careers in tier
 */
function getByTier(tier) {
  const loader = getInstanceSync();
  return loader.getCareersByTier(tier);
}

/**
 * Get careers by education level
 * @param {string} educationLevel - Education level name
 * @returns {Array<object>} Careers
 */
function getByEducation(educationLevel) {
  const loader = getInstanceSync();
  return loader.getCareersByEducation(educationLevel);
}

/**
 * Get random subset of careers
 * @param {number} count - Number of careers
 * @param {object} criteria - Optional filter criteria
 * @returns {Array<object>} Random careers
 */
function getRandom(count, criteria = {}) {
  let careers = filter(criteria);

  if (careers.length === 0) {
    return [];
  }

  const shuffled = [...careers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get similar careers (same cluster or similar salary)
 * @param {object} career - Reference career
 * @param {number} count - Number of similar careers
 * @returns {Array<object>} Similar careers
 */
function getSimilar(career, count = 5) {
  const loader = getInstanceSync();
  const allCareers = loader.getCareers();

  const similar = allCareers
    .filter(c => c.id !== career.id)
    .map(c => {
      let score = 0;

      if (c.metadata?.cluster === career.metadata?.cluster) {
        score += 10;
      }

      if (c.metadata?.salary_tier === career.metadata?.salary_tier) {
        score += 5;
      }

      const salaryDiff = Math.abs(c.salary - career.salary);
      if (salaryDiff < 10000) score += 5;
      else if (salaryDiff < 20000) score += 3;
      else if (salaryDiff < 30000) score += 1;

      if (c.metadata?.education_level === career.metadata?.education_level) {
        score += 3;
      }

      return { career: c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.career);

  return similar;
}

module.exports = {
  filter,
  search,
  getByIds,
  sortBy,
  getTop,
  getBottom,
  getBySalaryRange,
  getByCluster,
  getByTier,
  getByEducation,
  getRandom,
  getSimilar
};
