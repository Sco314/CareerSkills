// SalaryGame/scripts/utils/cluster-detector.js
// Career cluster detection utilities

/**
 * Cluster keywords for automatic classification
 */
const CLUSTER_KEYWORDS = {
  healthcare: [
    'nurse', 'doctor', 'physician', 'therapist', 'dental', 'medical',
    'health', 'hygienist', 'assistant', 'pharmacist', 'veterinarian',
    'surgeon', 'anesthesiologist', 'radiologist', 'sonographer',
    'phlebotomist', 'emergency', 'patient', 'clinical'
  ],
  technology: [
    'software', 'developer', 'programmer', 'engineer', 'web', 'data',
    'information', 'security', 'analyst', 'computer', 'technology',
    'tech', 'digital', 'coding', 'systems', 'database', 'network',
    'cybersecurity', 'it'
  ],
  engineering: [
    'engineer', 'mechanical', 'civil', 'electrical', 'aerospace',
    'chemical', 'petroleum', 'industrial', 'robotics', 'manufacturing',
    'structural', 'construction', 'design', 'technical'
  ],
  education: [
    'teacher', 'educator', 'professor', 'instructor', 'librarian',
    'school', 'elementary', 'secondary', 'education', 'training',
    'academic', 'tutor'
  ],
  business: [
    'manager', 'accountant', 'analyst', 'financial', 'marketing',
    'sales', 'business', 'executive', 'director', 'consultant',
    'administrator', 'human resources', 'hr', 'loan officer',
    'real estate', 'broker', 'event planner'
  ],
  trades: [
    'electrician', 'plumber', 'welder', 'mechanic', 'technician',
    'hvac', 'carpenter', 'construction', 'installer', 'repair',
    'maintenance', 'automotive', 'service'
  ],
  arts: [
    'designer', 'artist', 'graphic', 'photographer', 'fashion',
    'interior', 'creative', 'visual', 'architect', 'illustrator',
    'animator'
  ],
  legal: [
    'lawyer', 'attorney', 'paralegal', 'legal', 'counsel', 'judge',
    'law', 'court'
  ],
  science: [
    'scientist', 'chemist', 'biologist', 'physicist', 'researcher',
    'laboratory', 'research', 'zoologist', 'wildlife', 'environmental'
  ],
  service: [
    'chef', 'cook', 'hairdresser', 'stylist', 'cosmetologist',
    'cashier', 'teller', 'service', 'hospitality', 'food',
    'customer service'
  ],
  protective: [
    'police', 'officer', 'firefighter', 'security', 'detective',
    'law enforcement', 'emergency', 'safety', 'corrections'
  ],
  social: [
    'social worker', 'counselor', 'psychologist', 'therapist',
    'community', 'family', 'case manager', 'mental health'
  ],
  media: [
    'producer', 'director', 'actor', 'writer', 'author', 'journalist',
    'editor', 'broadcaster', 'media', 'entertainment', 'film'
  ],
  transportation: [
    'pilot', 'air traffic', 'controller', 'driver', 'transportation',
    'logistics', 'dispatcher'
  ],
  agriculture: [
    'farmer', 'agricultural', 'agriculture', 'farm', 'crop', 'livestock'
  ]
};

/**
 * Detect career cluster based on title and description
 * @param {string} title - Career title
 * @param {string} description - Career description
 * @returns {string} Detected cluster name
 */
function detectCluster(title, description = '') {
  const combinedText = `${title} ${description}`.toLowerCase();

  const scores = {};

  for (const [cluster, keywords] of Object.entries(CLUSTER_KEYWORDS)) {
    scores[cluster] = 0;

    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = combinedText.match(regex);
      if (matches) {
        scores[cluster] += matches.length;
      }
    }
  }

  let maxScore = 0;
  let detectedCluster = 'other';

  for (const [cluster, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedCluster = cluster;
    }
  }

  return detectedCluster;
}

/**
 * Get cluster metadata
 * @param {string} cluster - Cluster name
 * @returns {object} Cluster metadata
 */
function getClusterMetadata(cluster) {
  const metadata = {
    healthcare: {
      name: 'healthcare',
      label: 'Healthcare',
      description: 'Medical and health services',
      icon: '🏥'
    },
    technology: {
      name: 'technology',
      label: 'Technology',
      description: 'Computer and information technology',
      icon: '💻'
    },
    engineering: {
      name: 'engineering',
      label: 'Engineering',
      description: 'Engineering and technical design',
      icon: '⚙️'
    },
    education: {
      name: 'education',
      label: 'Education',
      description: 'Teaching and training',
      icon: '📚'
    },
    business: {
      name: 'business',
      label: 'Business',
      description: 'Business and financial operations',
      icon: '💼'
    },
    trades: {
      name: 'trades',
      label: 'Skilled Trades',
      description: 'Skilled trades and technical work',
      icon: '🔧'
    },
    arts: {
      name: 'arts',
      label: 'Arts & Design',
      description: 'Creative and design fields',
      icon: '🎨'
    },
    legal: {
      name: 'legal',
      label: 'Legal',
      description: 'Legal services',
      icon: '⚖️'
    },
    science: {
      name: 'science',
      label: 'Science',
      description: 'Scientific research and analysis',
      icon: '🔬'
    },
    service: {
      name: 'service',
      label: 'Service',
      description: 'Customer and personal services',
      icon: '🍽️'
    },
    protective: {
      name: 'protective',
      label: 'Protective Services',
      description: 'Public safety and security',
      icon: '👮'
    },
    social: {
      name: 'social',
      label: 'Social Services',
      description: 'Social and human services',
      icon: '🤝'
    },
    media: {
      name: 'media',
      label: 'Media & Entertainment',
      description: 'Media, entertainment, and communications',
      icon: '🎬'
    },
    transportation: {
      name: 'transportation',
      label: 'Transportation',
      description: 'Transportation and logistics',
      icon: '✈️'
    },
    agriculture: {
      name: 'agriculture',
      label: 'Agriculture',
      description: 'Agriculture and natural resources',
      icon: '🌾'
    },
    other: {
      name: 'other',
      label: 'Other',
      description: 'Other occupations',
      icon: '📋'
    }
  };

  return metadata[cluster] || metadata.other;
}

/**
 * Group careers by cluster
 * @param {Array<object>} careers - Array of career objects
 * @returns {object} Careers grouped by cluster
 */
function groupCareersByCluster(careers) {
  const grouped = {};

  for (const career of careers) {
    const cluster = career.metadata?.cluster || detectCluster(career.title, career.description);

    if (!grouped[cluster]) {
      grouped[cluster] = {
        careers: [],
        count: 0,
        metadata: getClusterMetadata(cluster)
      };
    }

    grouped[cluster].careers.push(career.id);
    grouped[cluster].count++;
  }

  return grouped;
}

/**
 * Get all cluster names
 * @returns {Array<string>} Array of cluster names
 */
function getAllClusterNames() {
  return Object.keys(CLUSTER_KEYWORDS);
}

module.exports = {
  detectCluster,
  getClusterMetadata,
  groupCareersByCluster,
  getAllClusterNames,
  CLUSTER_KEYWORDS
};
