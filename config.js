// Configuration settings for the application
(function() {
  'use strict';
  
  // Create configuration object with default values
  const defaultConfig = {
    // Remove hardcoded credentials for security
    auth: {
      requireLogin: false, // Set to true if login should be required
      loginEndpoint: '/api/login',
      loginTimeout: 60000, // 1 minute
    },
    
    // Application tabs
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
      { id: 'teams', label: 'Teams', icon: 'fa-users' },
      { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
      { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' },
      { id: 'planning', label: 'Planning', icon: 'fa-project-diagram' },
      { id: 'orgchart', label: 'Org Chart', icon: 'fa-sitemap' },
      { id: 'rolematrix', label: 'Role Matrix', icon: 'fa-th' },
      { id: 'skillsmatrix', label: 'Skills Matrix', icon: 'fa-cubes' },
      { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar' },
      { id: 'racimatrix', label: 'RACI Matrix', icon: 'fa-tasks' }
    ],
    
    // Color scheme
    colors: {
      bbv: '#00518A',
      add: '#CC2030',
      arb: '#4F46E5',
      shared: '#232323',
      root: '#333333'
    },
    
    // API endpoints (configured for local development by default)
    api: {
      base: './api',
      teams: '/teams',
      personnel: '/personnel',
      documents: '/documents'
    },
    
    // Default settings
    defaults: {
      pageSize: 10,
      initialTab: 'dashboard',
      theme: 'light'
    },

    // Extra settings for loading
    loading: {
      retryDelay: 1000,
      maxRetries: 3,
      enableFallback: true,
      timeout: 10000,
      showSpinner: true
    },
    
    // Debug settings
    debug: {
      enabled: false,
      logLevel: 'error', // 'error', 'warn', 'info', 'debug'
      showErrorsInUI: true
    },

    // New settings for analytics
    analytics: {
      autosaveInterval: 30000, // Autosave every 30 seconds
      maxHistoryItems: 50,     // Maximum items to keep in history
      cacheExpiration: 3600    // Cache expiration in seconds
    }
  };

  // Validate configuration function to ensure security
  function validateConfig(config) {
    if (!config || typeof config !== 'object') {
      console.error('Invalid configuration format');
      return defaultConfig;
    }
    
    const validated = { ...defaultConfig };
    
    // Only allow known top-level properties
    const allowedProperties = Object.keys(defaultConfig);
    
    for (const prop of allowedProperties) {
      if (config.hasOwnProperty(prop)) {
        // Deep validation of objects
        if (typeof defaultConfig[prop] === 'object' && !Array.isArray(defaultConfig[prop])) {
          validated[prop] = validateObjectProperties(config[prop], defaultConfig[prop]);
        } else if (Array.isArray(defaultConfig[prop])) {
          // Handle arrays specially based on their known contents
          if (prop === 'tabs') {
            validated[prop] = validateTabs(config[prop]);
          } else {
            // Default array handling
            validated[prop] = config[prop];
          }
        } else {
          // Value type validation
          if (typeof config[prop] === typeof defaultConfig[prop]) {
            validated[prop] = config[prop];
          }
        }
      }
    }
    
    return validated;
  }
  
  // Validate object properties
  function validateObjectProperties(obj, defaultObj) {
    if (!obj || typeof obj !== 'object') return defaultObj;
    
    const result = { ...defaultObj };
    const allowedKeys = Object.keys(defaultObj);
    
    for (const key of allowedKeys) {
      if (obj.hasOwnProperty(key)) {
        if (typeof defaultObj[key] === 'object' && !Array.isArray(defaultObj[key])) {
          result[key] = validateObjectProperties(obj[key], defaultObj[key]);
        } else {
          // Check type compatibility
          if (typeof obj[key] === typeof defaultObj[key]) {
            result[key] = obj[key];
          }
        }
      }
    }
    
    return result;
  }
  
  // Validate tabs array
  function validateTabs(tabs) {
    if (!Array.isArray(tabs)) return defaultConfig.tabs;
    
    return tabs.map(tab => {
      // Required properties
      if (!tab.id || !tab.label) {
        return null;
      }
      
      // Sanitize id and label
      const id = String(tab.id).replace(/[^a-z0-9-]/gi, '');
      const label = String(tab.label).substring(0, 50); // Limit label length
      
      return {
        id,
        label,
        icon: tab.icon && typeof tab.icon === 'string' ? tab.icon : 'fa-circle' // Default icon
      };
    }).filter(tab => tab !== null);
  }

  // Try to load from localStorage if available (for persistence)
  try {
    const savedConfig = localStorage.getItem('app_config');
    if (savedConfig) {
      try {
        // Parse saved config and validate it
        const parsedConfig = JSON.parse(savedConfig);
        window.config = validateConfig(parsedConfig);
        console.log('Loaded and validated config from localStorage');
      } catch (parseError) {
        console.error('Error parsing saved config:', parseError);
        window.config = defaultConfig;
      }
    } else {
      // Use default config
      window.config = defaultConfig;
    }
  } catch (error) {
    console.error('Error loading config from localStorage:', error);
    // Fall back to default config
    window.config = defaultConfig;
  }
  
  // Helper function for deep merging objects
  function deepMerge(target, source) {
    if (!isObject(target) || !isObject(source)) {
      return source;
    }
    
    const output = { ...target };
    
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
    
    return output;
  }
  
  // Helper to check if value is an object
  function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }
  
  // Set up config change listener to save changes
  window.updateConfig = function(newConfig) {
    if (!newConfig || typeof newConfig !== 'object') {
      console.error('Invalid configuration update');
      return window.config;
    }
    
    // Validate the new config before merging
    const validatedNewConfig = validateConfig(newConfig);
    
    // Merge with existing config
    window.config = deepMerge(window.config, validatedNewConfig);
    
    // Save to localStorage
    try {
      localStorage.setItem('app_config', JSON.stringify(window.config));
      console.log('Config updated and saved to localStorage');
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('configUpdated', { detail: window.config }));
    
    return window.config;
  };

  // Expose confirmation that config is loaded
  window.configLoaded = true;
  console.log('Config loaded successfully');
})();
