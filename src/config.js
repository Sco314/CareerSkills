// src/config.js
// Game configuration and constants

/**
 * Game modes configuration
 */
const GAME_MODES = {
  classic: {
    name: 'classic',
    label: 'Classic Mode',
    description: 'Random career matchups from all careers',
    filters: {}
  },
  sameCluster: {
    name: 'sameCluster',
    label: 'Same Industry',
    description: 'Compare careers within the same industry cluster',
    filters: { sameCluster: true }
  },
  salaryRange: {
    name: 'salaryRange',
    label: 'Salary Range',
    description: 'Focus on a specific salary range',
    filters: { salaryRange: true }
  },
  highGrowth: {
    name: 'highGrowth',
    label: 'High Growth',
    description: 'Only careers with high growth potential',
    filters: { minGrowth: 10 }
  },
  sameTier: {
    name: 'sameTier',
    label: 'Same Tier',
    description: 'Compare careers in the same salary tier',
    filters: { sameTier: true }
  },
  education: {
    name: 'education',
    label: 'By Education',
    description: 'Compare careers with similar education requirements',
    filters: { sameEducation: true }
  }
};

/**
 * Matchup generation rules
 */
const MATCHUP_RULES = {
  minSalaryDiff: 5000,
  maxSalaryRatio: 3,
  avoidSameSubfield: true,
  preferDifferentClusters: false,
  maxAttempts: 100
};

/**
 * Filter presets for quick filtering
 */
const FILTER_PRESETS = {
  healthcare: {
    name: 'healthcare',
    label: 'Healthcare',
    cluster: 'healthcare'
  },
  technology: {
    name: 'technology',
    label: 'Technology',
    cluster: 'technology'
  },
  engineering: {
    name: 'engineering',
    label: 'Engineering',
    cluster: 'engineering'
  },
  education: {
    name: 'education',
    label: 'Education',
    cluster: 'education'
  },
  business: {
    name: 'business',
    label: 'Business',
    cluster: 'business'
  },
  trades: {
    name: 'trades',
    label: 'Skilled Trades',
    cluster: 'trades'
  },
  highSalary: {
    name: 'highSalary',
    label: 'High Salary ($100k+)',
    salaryMin: 100000
  },
  entryLevel: {
    name: 'entryLevel',
    label: 'Entry Level',
    salaryMax: 40000
  },
  fastGrowth: {
    name: 'fastGrowth',
    label: 'Fast Growth (10%+)',
    minGrowth: 10
  }
};

/**
 * Data file paths
 */
const DATA_PATHS = {
  careersGame: './data/game/careers-game.json',
  careersFull: './data/processed/careers-full.json',
  metadata: './data/game/metadata.json',
  careersPublic: './SalaryGame/public/careers.min.json'
};

/**
 * Scoring configuration
 */
const SCORING = {
  correctAnswer: 10,
  streakBonus: {
    3: 5,
    5: 10,
    10: 20
  },
  penaltyPerMistake: 0
};

/**
 * Get game mode configuration
 * @param {string} modeName - Mode name
 * @returns {object} Mode configuration
 */
function getGameMode(modeName) {
  return GAME_MODES[modeName] || GAME_MODES.classic;
}

/**
 * Get filter preset
 * @param {string} presetName - Preset name
 * @returns {object} Filter preset
 */
function getFilterPreset(presetName) {
  return FILTER_PRESETS[presetName] || null;
}

/**
 * Get all game mode names
 * @returns {Array<string>} Array of mode names
 */
function getAllGameModes() {
  return Object.keys(GAME_MODES);
}

/**
 * Get all filter preset names
 * @returns {Array<string>} Array of preset names
 */
function getAllFilterPresets() {
  return Object.keys(FILTER_PRESETS);
}

module.exports = {
  GAME_MODES,
  MATCHUP_RULES,
  FILTER_PRESETS,
  DATA_PATHS,
  SCORING,
  getGameMode,
  getFilterPreset,
  getAllGameModes,
  getAllFilterPresets
};
