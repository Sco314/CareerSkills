// SalaryGame/scripts/utils/xml-parser.js
// XML parsing utilities for BLS OOH data

const xml2js = require('xml2js');

/**
 * Strip HTML tags from text content
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
function stripHtml(html) {
  if (!html) return '';

  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Safely extract nested value from XML object
 * @param {object} obj - XML object
 * @param {string} path - Dot-separated path (e.g., 'quick_facts.qf_median_pay_annual.value')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Extracted value or default
 */
function safeExtract(obj, path, defaultValue = null) {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object') {
      if (Array.isArray(current[key]) && current[key].length > 0) {
        current = current[key][0];
      } else if (current[key] !== undefined) {
        current = current[key];
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Extract text from XML field (handles arrays and objects)
 * @param {*} field - XML field
 * @returns {string} Extracted text
 */
function extractText(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (Array.isArray(field) && field.length > 0) {
    if (typeof field[0] === 'string') return field[0];
    if (typeof field[0] === 'object' && field[0]._) return field[0]._;
  }
  if (typeof field === 'object' && field._) return field._;
  return '';
}

/**
 * Parse number from string (handles commas, dollar signs)
 * @param {string|number} value - Value to parse
 * @returns {number|null} Parsed number or null
 */
function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (!value) return null;

  const cleaned = String(value).replace(/[$,]/g, '');
  const num = parseFloat(cleaned);

  return isNaN(num) ? null : num;
}

/**
 * Parse integer from string (handles commas)
 * @param {string|number} value - Value to parse
 * @returns {number|null} Parsed integer or null
 */
function parseInt10(value) {
  const num = parseNumber(value);
  return num !== null ? Math.round(num) : null;
}

/**
 * Extract growth rate from employment outlook text
 * @param {string} text - Outlook text (e.g., "6% (2024-2034)")
 * @returns {number|null} Growth rate percentage
 */
function extractGrowthRate(text) {
  if (!text) return null;

  const match = String(text).match(/(-?\d+)%/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Categorize demand based on growth rate
 * @param {number} growthRate - Growth rate percentage
 * @returns {string} Demand category
 */
function categorizeDemand(growthRate) {
  if (growthRate === null) return 'Unknown';
  if (growthRate < 0) return 'Declining';
  if (growthRate < 2) return 'Low';
  if (growthRate < 5) return 'Moderate';
  if (growthRate < 10) return 'High';
  return 'Very High';
}

/**
 * Format demand string for frontend
 * @param {number} growthRate - Growth rate percentage
 * @param {string} projectionYear - Projection year (e.g., '2034')
 * @returns {string} Formatted demand string
 */
function formatDemand(growthRate, projectionYear = '2034') {
  const category = categorizeDemand(growthRate);
  const sign = growthRate >= 0 ? '' : '';
  const currentYear = new Date().getFullYear();

  return `${category} – ${sign}${growthRate}% (${currentYear}–${projectionYear})`;
}

/**
 * Extract similar occupations as array of titles
 * @param {object} similarOccupations - Similar occupations XML object
 * @returns {Array<string>} Array of occupation titles
 */
function extractSimilarOccupations(similarOccupations) {
  if (!similarOccupations) return [];

  const similar = [];

  if (Array.isArray(similarOccupations)) {
    for (const item of similarOccupations) {
      if (item.similar_occupation) {
        const occupations = Array.isArray(item.similar_occupation)
          ? item.similar_occupation
          : [item.similar_occupation];

        for (const occ of occupations) {
          const title = safeExtract(occ, 'occupation_name', null);
          if (title) similar.push(title);
        }
      }
    }
  }

  return similar;
}

/**
 * Parse XML string to JavaScript object
 * @param {string} xmlString - XML content
 * @returns {Promise<object>} Parsed XML object
 */
async function parseXmlString(xmlString) {
  const parser = new xml2js.Parser({
    explicitArray: true,
    mergeAttrs: false,
    explicitCharkey: true
  });

  return await parser.parseStringPromise(xmlString);
}

module.exports = {
  stripHtml,
  safeExtract,
  extractText,
  parseNumber,
  parseInt10,
  extractGrowthRate,
  categorizeDemand,
  formatDemand,
  extractSimilarOccupations,
  parseXmlString
};
