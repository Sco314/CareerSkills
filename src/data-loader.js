// src/data-loader.js
// Singleton data loader for career game data

const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('./config');

/**
 * DataLoader singleton class
 */
class DataLoader {
  constructor() {
    this.careers = null;
    this.metadata = null;
    this.loaded = false;
    this.loadPromise = null;
  }

  /**
   * Load all game data
   * @returns {Promise<DataLoader>} This instance
   */
  async load() {
    if (this.loaded) {
      return this;
    }

    if (this.loadPromise) {
      await this.loadPromise;
      return this;
    }

    this.loadPromise = this._performLoad();
    await this.loadPromise;
    return this;
  }

  /**
   * Internal load implementation
   * @private
   */
  async _performLoad() {
    try {
      const careersPath = path.resolve(DATA_PATHS.careersGame);
      const metadataPath = path.resolve(DATA_PATHS.metadata);

      if (!fs.existsSync(careersPath)) {
        throw new Error(`Careers file not found at ${careersPath}`);
      }

      if (!fs.existsSync(metadataPath)) {
        throw new Error(`Metadata file not found at ${metadataPath}`);
      }

      const careersData = fs.readFileSync(careersPath, 'utf8');
      this.careers = JSON.parse(careersData);

      const metadataData = fs.readFileSync(metadataPath, 'utf8');
      this.metadata = JSON.parse(metadataData);

      this.loaded = true;

      console.log(`✅ Loaded ${this.careers.length} careers with metadata`);
    } catch (error) {
      console.error('❌ Error loading game data:', error.message);
      throw error;
    }
  }

  /**
   * Get all careers
   * @returns {Array<object>} Array of careers
   */
  getCareers() {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }
    return this.careers;
  }

  /**
   * Get metadata
   * @returns {object} Metadata object
   */
  getMetadata() {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }
    return this.metadata;
  }

  /**
   * Get career by ID
   * @param {number} id - Career ID
   * @returns {object|null} Career object or null
   */
  getCareerById(id) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }
    return this.careers.find(c => c.id === id) || null;
  }

  /**
   * Get careers by IDs
   * @param {Array<number>} ids - Array of career IDs
   * @returns {Array<object>} Array of careers
   */
  getCareersByIds(ids) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }
    return this.careers.filter(c => ids.includes(c.id));
  }

  /**
   * Get careers by SOC code
   * @param {string} soc - SOC code
   * @returns {Array<object>} Array of careers with matching SOC
   */
  getCareersBySoc(soc) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }
    return this.careers.filter(c => c.soc === soc);
  }

  /**
   * Get careers by cluster
   * @param {string} cluster - Cluster name
   * @returns {Array<object>} Array of careers in cluster
   */
  getCareersByCluster(cluster) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }

    const clusterData = this.metadata.clusters[cluster];
    if (!clusterData) {
      return [];
    }

    return this.getCareersByIds(clusterData.careers);
  }

  /**
   * Get careers by salary tier
   * @param {string} tier - Tier name (entry, mid, upper-mid, high)
   * @returns {Array<object>} Array of careers in tier
   */
  getCareersByTier(tier) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }

    const tierData = this.metadata.salary_tiers[tier];
    if (!tierData) {
      return [];
    }

    return this.getCareersByIds(tierData.careers);
  }

  /**
   * Get careers by education level
   * @param {string} educationLevel - Education level name
   * @returns {Array<object>} Array of careers
   */
  getCareersByEducation(educationLevel) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }

    const eduData = this.metadata.education_levels[educationLevel];
    if (!eduData) {
      return [];
    }

    return this.getCareersByIds(eduData.careers);
  }

  /**
   * Get random career
   * @returns {object} Random career
   */
  getRandomCareer() {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }

    const randomIndex = Math.floor(Math.random() * this.careers.length);
    return this.careers[randomIndex];
  }

  /**
   * Get N random careers
   * @param {number} count - Number of careers to get
   * @returns {Array<object>} Array of random careers
   */
  getRandomCareers(count) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call load() first.');
    }

    const shuffled = [...this.careers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Reset and reload data
   */
  async reload() {
    this.careers = null;
    this.metadata = null;
    this.loaded = false;
    this.loadPromise = null;
    return await this.load();
  }
}

let instance = null;

/**
 * Get singleton instance
 * @returns {Promise<DataLoader>} DataLoader instance
 */
async function getInstance() {
  if (!instance) {
    instance = new DataLoader();
    await instance.load();
  }
  return instance;
}

/**
 * Get singleton instance synchronously (must be loaded first)
 * @returns {DataLoader} DataLoader instance
 */
function getInstanceSync() {
  if (!instance || !instance.loaded) {
    throw new Error('DataLoader not initialized. Call getInstance() first.');
  }
  return instance;
}

module.exports = {
  DataLoader,
  getInstance,
  getInstanceSync
};
