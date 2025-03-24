// Core application data structure
var appData = {
  state: {
    isLoggedIn: true,
    userName: "User",
    userRole: "Administrator",
    currentUser: 1,
    currentTab: 'dashboard'
  },
  teams: [
    {
      id: 1,
      name: 'BBV Quality Team',
      stream: 'bbv',
      description: 'Quality team supporting BBV product line',
      responsibilities: 'Manage quality assurance processes, perform audits, handle documentation',
      performance: 75,
      personnel: [
        { id: 1, name: 'John Smith', role: 'Quality Account Manager', client: 'Client 1' },
        { id: 2, name: 'Jane Doe', role: 'Quality Engineer', client: 'Client 1' },
        { id: 3, name: 'Michael Brown', role: 'Quality Coordinator', client: 'Client 2' }
      ]
    },
    {
      id: 2,
      name: 'ADD Quality Team',
      stream: 'add',
      description: 'Quality team supporting ADD product line',
      responsibilities: 'Handle documentation, support audits, manage CAPAs',
      performance: 82,
      personnel: [
        { id: 4, name: 'Sarah Johnson', role: 'Quality Account Manager', client: 'Client 3' },
        { id: 5, name: 'Robert Williams', role: 'Document Control Specialist', client: 'Client 3' }
      ]
    },
    {
      id: 3,
      name: 'ARB Quality Team',
      stream: 'arb',
      description: 'Quality team supporting ARB product line',
      responsibilities: 'Quality oversight, compliance management, audit support',
      performance: 90,
      personnel: [
        { id: 6, name: 'Emily Davis', role: 'Quality Lead', client: 'Client 4' },
        { id: 7, name: 'James Wilson', role: 'Quality Specialist', client: 'Client 5' }
      ]
    }
  ],
  activities: [
    { 
      id: 1,
      date: new Date().toISOString(),
      type: 'update',
      team: 'BBV Quality Team',
      description: 'Updated team structure',
      details: {
        changes: ['Added new team member'],
        impact: 'Improved capacity'
      }
    },
    { 
      id: 2,
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      type: 'create',
      team: 'ADD Quality Team',
      description: 'Created new SOP',
      details: {
        changes: ['Document created and approved'],
        impact: 'Enhanced compliance'
      }
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Complete quarterly audit',
      description: 'Perform quarterly audit of quality systems',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      priority: 'high',
      assignedTo: 'John Smith',
      progress: 25,
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Update SOP documentation',
      description: 'Review and update standard operating procedures',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      priority: 'medium',
      assignedTo: 'Sarah Johnson',
      progress: 60,
      status: 'in-progress'
    }
  ]
};

// Try to load data from localStorage first
try {
  const savedData = localStorage.getItem('appData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      
      // Deep merge the parsed data with default data to ensure all required fields exist
      const mergeObjects = (target, source) => {
        Object.keys(source).forEach(key => {
          if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
            mergeObjects(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        });
        return target;
      };
      
      // Create a deep clone of appData to prevent mutation of the default
      const defaultDataClone = JSON.parse(JSON.stringify(appData));
      
      // Merge saved data into the deep clone
      appData = mergeObjects(defaultDataClone, parsedData);
      
      // Always set isLoggedIn to true on load regardless of saved state
      if (appData.state) {
        appData.state.isLoggedIn = true;
      }
      
      console.log('Loaded data from localStorage');
    } catch (parseError) {
      console.error('Error parsing data from localStorage:', parseError);
      // Continue with default data and attempt to backup corrupt data
      try {
        localStorage.setItem('appData_corrupt_backup', savedData);
        console.log('Backed up corrupt appData');
      } catch (backupError) {
        console.error('Failed to backup corrupt data:', backupError);
      }
    }
  }
} catch (error) {
  console.error('Error accessing localStorage:', error);
  // Continue with default data
}

// Ensure global availability
window.appData = appData;

// Add safe wrapper for localStorage operations
window.safeStorage = {
  getItem: function(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  },
  setItem: function(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      // Try to clear some space if quota exceeded
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        try {
          // Attempt to remove non-critical data
          const nonCriticalKeys = ['searchHistory', 'recentViews', 'uiPreferences'];
          nonCriticalKeys.forEach(k => localStorage.removeItem(k));
          // Try again
          localStorage.setItem(key, value);
          return true;
        } catch (retryError) {
          console.error('Failed to save data after clearing space:', retryError);
          return false;
        }
      }
      return false;
    }
  },
  removeItem: function(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
      return false;
    }
  }
};

console.log('App data initialized successfully');

// Main application logic
console.log('Loading application...');

// Track loading state and errors
window.appLoaded = false;
window.appErrors = [];
window.debugMode = true;

// Error logging system
const logger = {
  // Log levels
  levels: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
  },
  
  // Current log level threshold
  currentLevel: 1, // Default to INFO
  
  // Maximum errors to keep in memory
  maxErrors: 50,
  
  // Initialize the logger
  init() {
    // Set log level from config if available
    if (window.config && window.config.debug) {
      const configLevel = window.config.debug.logLevel;
      if (configLevel) {
        switch (configLevel.toLowerCase()) {
          case 'debug':
            this.currentLevel = this.levels.DEBUG;
            break;
          case 'info':
            this.currentLevel = this.levels.INFO;
            break;
          case 'warn':
            this.currentLevel = this.levels.WARN;
            break;
          case 'error':
            this.currentLevel = this.levels.ERROR;
            break;
          default:
            this.currentLevel = this.levels.INFO;
        }
      }
    }
    
    // Set up global error handler
    window.onerror = (message, source, line, column, error) => {
      this.error('Uncaught exception', { message, source, line, column, stack: error?.stack });
      return false; // Let the default handler run as well
    };
    
    // Set up promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', { 
        reason: event.reason?.message || event.reason,
        stack: event.reason?.stack
      });
    });
    
    // Initialize error array if not exists
    window.appErrors = window.appErrors || [];
    
    this.info('Logger initialized');
  },
  
  // Log debug message
  debug(message, data) {
    if (this.currentLevel <= this.levels.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data || '');
      this._saveError(message, data, 'debug');
    }
  },
  
  // Log info message
  info(message, data) {
    if (this.currentLevel <= this.levels.INFO) {
      console.info(`[INFO] ${message}`, data || '');
      this._saveError(message, data, 'info');
    }
  },
  
  // Log warning message
  warn(message, data) {
    if (this.currentLevel <= this.levels.WARN) {
      console.warn(`[WARN] ${message}`, data || '');
      this._saveError(message, data, 'warn');
    }
  },
  
  // Log error message
  error(message, data) {
    if (this.currentLevel <= this.levels.ERROR) {
      console.error(`[ERROR] ${message}`, data || '');
      this._saveError(message, data, 'error');
      
      // Show UI error if configured
      this._showErrorInUI(message, data);
    }
  },
  
  // Log fatal error message
  fatal(message, data) {
    console.error(`[FATAL] ${message}`, data || '');
    this._saveError(message, data, 'fatal');
    
    // Always show fatal errors in UI
    this._showErrorInUI(`FATAL: ${message}`, data);
    
    // Attempt recovery
    if (typeof attemptRecovery === 'function') {
      attemptRecovery();
    }
  },
  
  // Save error to app errors array
  _saveError(message, data, level) {
    // Only save errors and warnings
    if (level === 'debug' || level === 'info') return;
    
    if (window.appErrors) {
      // Limit size of error array
      if (window.appErrors.length >= this.maxErrors) {
        window.appErrors.shift(); // Remove oldest
      }
      
      // Add new error
      window.appErrors.push({
        time: new Date().toISOString(),
        level,
        message,
        data,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      
      // Try to save to localStorage for persistence
      try {
        localStorage.setItem('app_errors', JSON.stringify(window.appErrors));
      } catch (e) {
        // Ignore storage errors
      }
    }
  },
  
  // Show error in UI if configured
  _showErrorInUI(message, data) {
    // Only show if UI errors are enabled
    if (window.config && window.config.debug && window.config.debug.showErrorsInUI && 
        window.ui && typeof window.ui.showToast === 'function') {
      const displayMessage = message.length > 100 ? 
        message.substring(0, 100) + '...' : 
        message;
      
      window.ui.showToast(displayMessage, 'error');
    }
  },
  
  // Get all logged errors
  getErrors() {
    return window.appErrors || [];
  },
  
  // Clear error log
  clearErrors() {
    window.appErrors = [];
    try {
      localStorage.removeItem('app_errors');
    } catch (e) {
      // Ignore storage errors
    }
  }
};

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize logger first
  logger.init();
  
  // Then initialize the app
  logger.info('DOM content loaded, initializing app');
  initApp();
});

/**
 * Main application initialization function.
 * Sets up the core application components and UI.
 */
function initApp() {
  logger.info('Running app initialization');
  
  try {
    // Track startup performance
    const startTime = performance.now();
    
    // Hide initial loader with a more reliable approach
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }
    
    // Make sure essential objects exist
    ensureAppObjects();
    
    // Initialize tabs - now using a more resilient approach
    if (typeof initTabs === 'function') {
      try {
        initTabs();
      } catch (error) {
        logger.error('Error initializing tabs:', error);
        // Fall back to emergency tab creation
        createTabsDirectly();
      }
    } else {
      logger.warn('initTabs function not found, using direct tab creation');
      createTabsDirectly();
    }
    
    // Load UI modules in parallel for better performance
    Promise.all([
      loadUiModule(),
      loadDataModule()
    ]).then(() => {
      logger.info('All modules loaded successfully');
      // Set global app state
      window.appLoaded = true;
      
      // Performance tracking
      const endTime = performance.now();
      logger.info(`App initialization completed in ${(endTime - startTime).toFixed(2)}ms`);
      
      // Set up periodic save to localStorage
      setUpAutosave();
      
      // Initialize search functionality
      initializeSearch();
      
      // Initialize notification system
      initializeNotifications();
    }).catch(error => {
      logger.error('Error loading modules:', error);
      attemptRecovery();
    });
  } catch (error) {
    logger.fatal('Critical error during app initialization:', error);
    window.appErrors.push({
      time: new Date().toISOString(),
      component: 'initApp',
      error: error.message
    });
    
    // Attempt recovery
    attemptRecovery();
  }
}

/**
 * Helper function to load UI module.
 * Initializes the UI and handles any errors that may occur.
 * 
 * @returns {Promise} Promise that resolves when UI is loaded
 */
function loadUiModule() {
  return new Promise((resolve, reject) => {
    if (window.ui && typeof window.ui.init === 'function') {
      try {
        window.ui.init();
        resolve();
      } catch (error) {
        logger.error('Error in UI initialization:', error);
        window.appErrors.push({
          time: new Date().toISOString(),
          component: 'ui.init',
          error: error.message
        });
        
        // Fall back to emergency tab loading but don't reject the promise
        logger.warn('Using emergency tab loading');
        if (window.forceSwitchTab) {
          window.forceSwitchTab('dashboard');
        }
        resolve(); // Resolve anyway to not block the app
      }
    } else {
      logger.warn('UI object or init method not found');
      // Fall back to direct tab initialization
      if (window.forceSwitchTab) {
        logger.info('Using forceSwitchTab for direct tab loading');
        window.forceSwitchTab('dashboard');
      }
      resolve(); // Resolve anyway to not block the app
    }
  });
}

/**
 * Helper function to load data module.
 * Currently a stub for future enhancement.
 * 
 * @returns {Promise} Promise that resolves when data is loaded
 */
function loadDataModule() {
  return new Promise((resolve) => {
    // No actual async loading needed yet, but this allows for future enhancement
    resolve();
  });
}

/**
 * Sets up periodic saving of application data to localStorage.
 */
function setUpAutosave() {
  logger.info('Setting up autosave functionality');
  
  // Set up throttled autosave function
  let autosaveTimeout = null;
  const throttleDelay = 2000; // 2 seconds delay between saves
  
  // Create the autosave function
  window.autosaveAppData = function() {
    // Clear any pending timeout
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }
    
    // Set a new timeout
    autosaveTimeout = setTimeout(() => {
      try {
        if (window.appData) {
          const dataToSave = JSON.stringify(window.appData);
          
          // Use safe storage wrapper instead of direct localStorage
          if (window.safeStorage) {
            const saved = window.safeStorage.setItem('appData', dataToSave);
            if (saved) {
              logger.debug('App data autosaved successfully');
            } else {
              logger.warn('App data autosave failed');
            }
          } else {
            // Fallback to direct localStorage if safeStorage is unavailable
            localStorage.setItem('appData', dataToSave);
            logger.debug('App data autosaved directly (safeStorage unavailable)');
          }
          
          // Also store a backup copy every 10 saves
          const saveCount = parseInt(localStorage.getItem('saveCount') || '0', 10);
          if (saveCount % 10 === 0) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            window.safeStorage?.setItem(`appData_backup_${timestamp}`, dataToSave);
          }
          localStorage.setItem('saveCount', (saveCount + 1).toString());
        }
      } catch (error) {
        logger.error('Error during autosave:', error);
      }
    }, throttleDelay);
  };
  
  // Set up event listeners to trigger autosave
  ['change', 'input', 'submit'].forEach(eventType => {
    document.addEventListener(eventType, function(e) {
      // Only autosave for form elements and editable content
      const target = e.target;
      if (target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA' || 
        target.hasAttribute('contenteditable')
      )) {
        window.autosaveAppData();
      }
    }, { passive: true });
  });
  
  // Save on tab change
  window.addEventListener('hashchange', window.autosaveAppData);
  
  // Save on page unload
  window.addEventListener('beforeunload', function() {
    // Bypass throttling for unload events
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }
    
    try {
      if (window.appData) {
        const dataToSave = JSON.stringify(window.appData);
        window.safeStorage?.setItem('appData', dataToSave) || 
          localStorage.setItem('appData', dataToSave);
      }
    } catch (error) {
      console.error('Error saving data on unload:', error);
    }
  });
  
  // Periodically save regardless of user interaction
  setInterval(window.autosaveAppData, 60000); // Every minute
  
  logger.info('Autosave set up complete');
}

/**
 * Ensures all essential application objects and data exist.
 * Creates and validates key data structures if missing or invalid.
 */
function ensureAppObjects() {
  logger.info('Ensuring essential app objects exist');
  
  // Create if missing
  window.appErrors = window.appErrors || [];
  
  // Ensure config object exists with proper format
  if (!window.config || typeof window.config !== 'object') {
    logger.warn('Config object missing or invalid, creating default');
    window.config = {
      tabs: [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'teams', label: 'Teams', icon: 'fa-users' },
        { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
        { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
      ],
      colors: {
        bbv: '#00518A',
        add: '#CC2030',
        arb: '#4F46E5',
        shared: '#232323'
      }
    };
  } else {
    // Ensure tabs exist in config
    if (!window.config.tabs || !Array.isArray(window.config.tabs) || window.config.tabs.length === 0) {
      logger.warn('Config tabs missing or invalid, setting defaults');
      window.config.tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'teams', label: 'Teams', icon: 'fa-users' },
        { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
        { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
      ];
    }
  }
  
  // Ensure appData exists with minimal validated structure
  if (!window.appData || typeof window.appData !== 'object') {
    logger.warn('AppData missing, creating default structure');
    window.appData = {
      state: {
        isLoggedIn: true,
        userName: "User",
        userRole: "Administrator",
        currentTab: 'dashboard',
        currentUser: 1
      },
      teams: [],
      activities: [],
      tasks: [],
      documents: []
    };
  } else {
    // Validate and fix appData structure if needed
    if (!window.appData.state || typeof window.appData.state !== 'object') {
      logger.warn('AppData state missing, creating default');
      window.appData.state = {
        isLoggedIn: true,
        userName: "User",
        userRole: "Administrator",
        currentTab: 'dashboard',
        currentUser: 1
      };
    }
    
    // Ensure all required arrays exist
    ['teams', 'activities', 'tasks', 'documents'].forEach(arrayName => {
      if (!window.appData[arrayName] || !Array.isArray(window.appData[arrayName])) {
        logger.warn(`AppData.${arrayName} missing or invalid, creating empty array`);
        window.appData[arrayName] = [];
      }
    });
    
    // Validate team structure
    window.appData.teams = (window.appData.teams || []).map(team => {
      // Ensure team has valid id
      if (!team.id || typeof team.id !== 'number') {
        team.id = generateUniqueId(window.appData.teams);
      }
      
      // Ensure team has necessary properties
      team.name = team.name || `Team ${team.id}`;
      team.stream = team.stream || 'bbv';
      team.personnel = Array.isArray(team.personnel) ? team.personnel : [];
      
      return team;
    });
  }
  
  // Ensure helper functions exist
  if (typeof window.generateUniqueId !== 'function') {
    window.generateUniqueId = function(array) {
      if (!array || !Array.isArray(array) || array.length === 0) {
        return 1;
      }
      const maxId = Math.max(...array.map(item => item.id || 0));
      return maxId + 1;
    };
  }
  
  logger.info('App objects validated and ensured');
}

/**
 * Generates a unique ID for a new object in a collection.
 * 
 * @param {Array} array - The collection to generate a unique ID for
 * @returns {number} A unique ID that's not used in the collection
 */
function generateUniqueId(array) {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return 1;
  }
  const maxId = Math.max(...array.map(item => item.id || 0));
  return maxId + 1;
}

/**
 * Initializes the application tabs based on configuration.
 * Creates tab buttons and sets up event handlers.
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  // Store references to event listeners so they can be removed later
  window.tabEventListeners = window.tabEventListeners || {};
  
  // Remove any existing event listeners first to prevent duplicates
  if (window.tabEventListeners.tabs) {
    window.tabEventListeners.tabs.forEach(({ element, listener }) => {
      element.removeEventListener('click', listener);
    });
  }
  
  // Create a new array to store current event listeners
  window.tabEventListeners.tabs = [];
  
  tabButtons.forEach(tab => {
    const clickHandler = function() {
      // Update active classes
      tabButtons.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Get the tab ID
      const tabId = this.getAttribute('data-tab');
      
      // Update URL hash
      window.location.hash = tabId;
      
      // Update application state
      if (window.appData && window.appData.state) {
        window.appData.state.currentTab = tabId;
      }
      
      // Show the tab content
      showTabContent(tabId);
    };
    
    // Add event listener
    tab.addEventListener('click', clickHandler);
    
    // Store reference to the event listener
    window.tabEventListeners.tabs.push({
      element: tab,
      listener: clickHandler
    });
  });
  
  // Set initial active tab based on URL hash or default
  const hash = window.location.hash.substring(1);
  const initialTab = hash || (window.appData?.state?.currentTab || 'dashboard');
  
  // Find and click the initial tab button
  const initialTabButton = document.querySelector(`.tab-btn[data-tab="${initialTab}"]`);
  
  if (initialTabButton) {
    // Only change if not already active
    if (!initialTabButton.classList.contains('active')) {
      initialTabButton.click();
    } else {
      // Just show content without clicking (prevents duplicate events)
      showTabContent(initialTab);
    }
  } else {
    // Fallback to dashboard if tab doesn't exist
    const dashboardTab = document.querySelector('.tab-btn[data-tab="dashboard"]');
    if (dashboardTab && !dashboardTab.classList.contains('active')) {
      dashboardTab.click();
    } else {
      showTabContent('dashboard');
    }
  }
}

/**
 * Creates tabs directly when the standard initialization fails.
 * This is a fallback mechanism to ensure basic navigation works.
 */
function createTabsDirectly() {
  logger.info('Creating tabs directly as fallback');
  
  const tabList = document.getElementById('tabList');
  if (!tabList) {
    logger.error('Tab list container not found');
    return;
  }
  
  // Get tab definitions (prefer config if available)
  const tabs = (window.config && window.config.tabs) ? 
    window.config.tabs : 
    [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
      { id: 'teams', label: 'Teams', icon: 'fa-users' },
      { id: 'personnel', label: 'Personnel', icon: 'fa-user' }
    ];
  
  // Create the tabs - use DOM methods instead of innerHTML for better security
  tabList.innerHTML = ''; // Clear existing tabs
  
  tabs.forEach((tab, index) => {
    // Sanitize the tab ID
    const safeId = typeof tab.id === 'string' ? 
      tab.id.replace(/[^a-z0-9-]/gi, '') : 
      `tab-${index}`;
      
    // Create button element
    const button = document.createElement('button');
    button.className = `tab-btn ${index === 0 ? 'active' : ''}`;
    button.id = `tab-${safeId}`;
    button.setAttribute('data-tab', safeId);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', `panel-${safeId}`);
    
    // Create icon
    const icon = document.createElement('i');
    // Validate icon name for security
    const safeIcon = (typeof tab.icon === 'string' && /^fa-[a-z0-9-]+$/i.test(tab.icon)) ? 
      tab.icon : 
      'fa-circle';
    icon.className = `fas ${safeIcon}`;
    icon.setAttribute('aria-hidden', 'true');
    
    // Create label
    const span = document.createElement('span');
    span.textContent = tab.label || safeId;
    
    // Append children
    button.appendChild(icon);
    button.appendChild(document.createTextNode(' '));
    button.appendChild(span);
    
    // Add click handler
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active state on all buttons
      tabList.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn === this);
        btn.setAttribute('aria-selected', btn === this ? 'true' : 'false');
      });
      
      // Try switching tab using UI method first
      if (window.ui && typeof window.ui.switchTab === 'function') {
        window.ui.switchTab(tabId);
      } else if (window.forceSwitchTab) {
        window.forceSwitchTab(tabId);
      } else {
        // Last resort - show simple content
        showSimpleTabContent(tabId);
      }
    });
    
    // Add to tab list
    tabList.appendChild(button);
  });
  
  logger.info('Fallback tabs created successfully');
}

/**
 * Shows simple tab content as a last resort when tab loaders are not available.
 * 
 * @param {string} tabId - The ID of the tab to show content for
 */
function showSimpleTabContent(tabId) {
  logger.info(`Showing simple content for tab: ${tabId}`);
  
  // Validate and sanitize tab ID
  if (!tabId || typeof tabId !== 'string') {
    logger.error('Invalid tab ID passed to showSimpleTabContent');
    tabId = 'dashboard';
  }
  
  // Sanitize tab ID
  const safeTabId = tabId.replace(/[^a-z0-9-]/gi, '');
  if (safeTabId !== tabId) {
    logger.warn(`Tab ID sanitized from "${tabId}" to "${safeTabId}"`);
    tabId = safeTabId;
  }
  
  const tabContent = document.getElementById('tabContent');
  if (!tabContent) {
    logger.error('Tab content container not found');
    return;
  }
  
  // Create content safely using DOM methods
  tabContent.innerHTML = '';
  
  // Create container
  const container = document.createElement('div');
  container.className = 'p-4';
  
  // Create warning banner
  const warningBanner = document.createElement('div');
  warningBanner.className = 'bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4';
  
  const warningText = document.createElement('p');
  warningText.className = 'text-yellow-700';
  
  const warningIcon = document.createElement('i');
  warningIcon.className = 'fas fa-exclamation-triangle mr-2';
  
  warningText.appendChild(warningIcon);
  warningText.appendChild(document.createTextNode('Emergency content mode active. Limited functionality available.'));
  warningBanner.appendChild(warningText);
  
  // Create heading
  const heading = document.createElement('h2');
  heading.className = 'text-2xl font-bold mb-6';
  heading.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
  
  // Create content card
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow p-6';
  
  const cardText = document.createElement('p');
  cardText.textContent = `Simple content for ${tabId} tab.`;
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'mt-4';
  
  const refreshButton = document.createElement('button');
  refreshButton.className = 'px-4 py-2 bg-blue-600 text-white rounded';
  refreshButton.onclick = () => location.reload();
  
  const refreshIcon = document.createElement('i');
  refreshIcon.className = 'fas fa-sync-alt mr-2';
  
  refreshButton.appendChild(refreshIcon);
  refreshButton.appendChild(document.createTextNode('Refresh Page'));
  
  // Assemble the DOM
  buttonContainer.appendChild(refreshButton);
  card.appendChild(cardText);
  card.appendChild(buttonContainer);
  
  container.appendChild(warningBanner);
  container.appendChild(heading);
  container.appendChild(card);
  
  tabContent.appendChild(container);
}

/**
 * Attempts to recover the application from a critical error.
 * Creates a minimal UI and tries to restore basic functionality.
 * 
 * @returns {boolean} True if recovery attempt was made, false if critical failure
 */
function attemptRecovery() {
  logger.info('Attempting application recovery...');
  
  // Track error information for debugging
  const errorCount = window.appErrors ? window.appErrors.length : 0;
  
  try {
    // Create error tracking element if it doesn't exist
    const errorTracking = document.createElement('div');
    errorTracking.id = 'errorTracking';
    errorTracking.style.display = 'none';
    errorTracking.setAttribute('data-error-count', errorCount);
    
    // Append to body if not already there
    if (!document.getElementById('errorTracking')) {
      document.body.appendChild(errorTracking);
    }
    
    // Create a fallback content container
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      // Safe cleanup of any existing content to avoid memory leaks
      while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
      }
      
      // Add simple fallback UI
      mainContent.innerHTML = `
        <div class="recovery-container p-4">
          <h2 class="text-xl font-bold mb-4">Application Recovery Mode</h2>
          <p class="mb-4">We encountered an issue while loading the application. Attempting to recover...</p>
          
          <div class="recovery-options space-y-4">
            <div class="recovery-option p-3 bg-gray-100 rounded">
              <h3 class="font-bold">Dashboard</h3>
              <p>View basic application information</p>
              <button id="recoverDashboard" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                Go to Dashboard
              </button>
            </div>
            
            <div class="recovery-option p-3 bg-gray-100 rounded">
              <h3 class="font-bold">Reset Application</h3>
              <p>Clear saved data and reset to default state</p>
              <button id="recoverReset" class="mt-2 px-4 py-2 bg-yellow-600 text-white rounded">
                Reset Application
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners to recovery buttons
      const dashboardBtn = document.getElementById('recoverDashboard');
      if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
          showSimpleTabContent('dashboard');
        });
      }
      
      const resetBtn = document.getElementById('recoverReset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          resetApplication();
        });
      }
    }
    
    // Check if we can load minimal UI features
    const tabContent = document.getElementById('tabContent');
    if (tabContent) {
      showSimpleTabContent('dashboard');
    }
    
    // Attempt to fix configuration issues
    if (!window.config) {
      logger.warn('Config missing, creating default');
      window.config = {
        tabs: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
          { id: 'teams', label: 'Teams', icon: 'fa-users' }
        ]
      };
    }
    
    // Create emergency tab navigation if needed
    const tabList = document.getElementById('tabList');
    if (tabList && tabList.children.length === 0) {
      logger.info('Creating emergency tabs');
      createTabsDirectly();
    }
    
    // Attempt to load dashboard-fix.js if it exists
    const dashboardFixScript = document.createElement('script');
    dashboardFixScript.src = 'dashboard-fix.js';
    dashboardFixScript.onerror = () => {
      logger.error('Failed to load dashboard-fix.js');
    };
    document.head.appendChild(dashboardFixScript);
    
    logger.info('Recovery attempt complete');
    
    // Notify the user
    showRecoveryNotification();
    
    return true;
  } catch (error) {
    logger.fatal('Critical failure during recovery:', error);
    
    // Last resort - show static message
    const root = document.documentElement;
    root.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1 style="color: #cc0000;">Application Error</h1>
        <p>A critical error has occurred. Please try refreshing the page.</p>
        <button onclick="location.reload()" style="padding: 10px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    
    return false;
  }
}

/**
 * Resets the application to its default state.
 * Clears all localStorage data and reloads the page.
 */
function resetApplication() {
  try {
    // Clear all localStorage data
    localStorage.removeItem('appData');
    localStorage.removeItem('app_config');
    localStorage.removeItem('user_preferences');
    
    logger.info('Application reset, reloading page');
    
    // Show confirmation
    alert('Application has been reset. The page will now reload.');
    
    // Reload the page
    window.location.reload();
  } catch (error) {
    logger.error('Error resetting application:', error);
    alert('Error resetting application. Please try refreshing the page manually.');
  }
}

/**
 * Shows a recovery notification to the user.
 * Creates a toast-like notification that can be dismissed.
 */
function showRecoveryNotification() {
  // Create or update notification element
  let notification = document.getElementById('recoveryNotification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'recoveryNotification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#f8d7da';
    notification.style.color = '#721c24';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
  }
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span>Application recovered from error</span>
      <button id="closeRecoveryNotification" style="background: none; border: none; cursor: pointer; margin-left: 10px;">✕</button>
    </div>
  `;
  
  // Add close button functionality
  const closeBtn = document.getElementById('closeRecoveryNotification');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      notification.style.display = 'none';
    });
  }
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (notification) {
      notification.style.display = 'none';
    }
  }, 10000);
}

// Expose debugging functions
window.appDebug = {
  forceTabs: function() {
    createTabsDirectly();
    return "Tabs created directly";
  },
  showTab: function(tabId) {
    if (window.forceSwitchTab) {
      window.forceSwitchTab(tabId);
      return `Showing tab: ${tabId}`;
    } else {
      showSimpleTabContent(tabId);
      return `Showing simple content for tab: ${tabId}`;
    }
  },
  getErrors: function() {
    return window.appErrors;
  },
  resetApp: function() {
    location.reload();
    return "Reloading application...";
  }
};

console.log('App.js loaded successfully');

// Initialize global search functionality
function initializeSearch() {
  const searchInput = document.createElement('div');
  searchInput.className = 'global-search';
  searchInput.innerHTML = `
    <div class="search-container">
      <input type="text" id="globalSearchInput" placeholder="Search across all sections...">
      <button id="globalSearchButton">
        <i class="fas fa-search"></i>
      </button>
    </div>
    <div id="searchResults" class="search-results"></div>
  `;
  
  document.querySelector('header').appendChild(searchInput);
  
  // Add event listeners
  document.getElementById('globalSearchInput').addEventListener('input', handleSearch);
  document.getElementById('globalSearchButton').addEventListener('click', handleSearchClick);
  
  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.global-search')) {
      document.getElementById('searchResults').style.display = 'none';
    }
  });
}

// Handle search input
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  if (query.length < 2) {
    document.getElementById('searchResults').style.display = 'none';
    return;
  }
  
  const results = performSearch(query);
  displaySearchResults(results);
}

// Handle search button click
function handleSearchClick() {
  const query = document.getElementById('globalSearchInput').value.toLowerCase();
  if (query.length < 2) return;
  
  const results = performSearch(query);
  displaySearchResults(results);
}

// Perform search across data
function performSearch(query) {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return [];
  }
  
  query = query.toLowerCase().trim();
  console.log(`Performing search for: "${query}"`);
  
  const results = [];
  
  // Prevent searches that are too short
  if (query.length < 2) {
    return [];
  }
  
  // Search teams
  if (window.appData && Array.isArray(window.appData.teams)) {
    window.appData.teams.forEach(team => {
      if (!team) return; // Skip null items
      
      // Search in team properties
      const teamNameMatch = (team.name || '').toLowerCase().includes(query);
      const teamDescMatch = (team.description || '').toLowerCase().includes(query);
      const teamRespMatch = (team.responsibilities || '').toLowerCase().includes(query);
      
      if (teamNameMatch || teamDescMatch || teamRespMatch) {
        results.push({
          type: 'team',
          id: team.id,
          title: team.name || 'Unnamed Team',
          description: team.description || '',
          match: teamNameMatch ? 'name' : teamDescMatch ? 'description' : 'responsibilities'
        });
      }
      
      // Search in team personnel
      if (Array.isArray(team.personnel)) {
        team.personnel.forEach(person => {
          if (!person) return; // Skip null items
          
          const nameMatch = (person.name || '').toLowerCase().includes(query);
          const roleMatch = (person.role || '').toLowerCase().includes(query);
          const clientMatch = (person.client || '').toLowerCase().includes(query);
          
          if (nameMatch || roleMatch || clientMatch) {
            results.push({
              type: 'personnel',
              id: person.id,
              teamId: team.id,
              title: person.name || 'Unnamed Person',
              description: `${person.role || 'No role'} - ${team.name || 'Unnamed Team'}`,
              match: nameMatch ? 'name' : roleMatch ? 'role' : 'client'
            });
          }
        });
      }
    });
  }
  
  // Search tasks
  if (window.appData && Array.isArray(window.appData.tasks)) {
    window.appData.tasks.forEach(task => {
      if (!task) return; // Skip null items
      
      const titleMatch = (task.title || '').toLowerCase().includes(query);
      const descMatch = (task.description || '').toLowerCase().includes(query);
      const assigneeMatch = (task.assignedTo || '').toLowerCase().includes(query);
      
      if (titleMatch || descMatch || assigneeMatch) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title || 'Unnamed Task',
          description: task.description || '',
          match: titleMatch ? 'title' : descMatch ? 'description' : 'assignee'
        });
      }
    });
  }
  
  // Limit results for performance
  const maxResults = 20;
  if (results.length > maxResults) {
    console.log(`Search returned ${results.length} results, limiting to ${maxResults}`);
    return results.slice(0, maxResults);
  }
  
  return results;
}

// Display search results
function displaySearchResults(results) {
  const resultsContainer = document.getElementById('searchResults');
  
  // Check if we have any results
  const hasResults = results.length > 0;
  
  if (!hasResults) {
    resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
    resultsContainer.style.display = 'block';
    return;
  }
  
  let html = '';
  
  // Teams results
  if (results.some(result => result.type === 'team')) {
    html += '<div class="result-category"><h4>Teams</h4>';
    results.filter(result => result.type === 'team').forEach(team => {
      html += `
        <div class="result-item" data-type="team" data-id="${team.id}">
          <i class="fas fa-users"></i>
          <div>
            <div class="result-title">${team.title}</div>
            <div class="result-subtitle">${team.description}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  // Personnel results
  if (results.some(result => result.type === 'personnel')) {
    html += '<div class="result-category"><h4>Personnel</h4>';
    results.filter(result => result.type === 'personnel').forEach(person => {
      html += `
        <div class="result-item" data-type="person" data-id="${person.id}">
          <i class="fas fa-user"></i>
          <div>
            <div class="result-title">${person.title}</div>
            <div class="result-subtitle">${person.description}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  // Tasks results
  if (results.some(result => result.type === 'task')) {
    html += '<div class="result-category"><h4>Tasks</h4>';
    results.filter(result => result.type === 'task').forEach(task => {
      html += `
        <div class="result-item" data-type="task" data-id="${task.id}">
          <i class="fas fa-tasks"></i>
          <div>
            <div class="result-title">${task.title}</div>
            <div class="result-subtitle">${task.description}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  resultsContainer.innerHTML = html;
  resultsContainer.style.display = 'block';
  
  // Add event listeners to results
  document.querySelectorAll('.result-item').forEach(item => {
    item.addEventListener('click', handleResultClick);
  });
}

// Handle clicking a search result
function handleResultClick(e) {
  const item = e.currentTarget;
  const type = item.getAttribute('data-type');
  const id = parseInt(item.getAttribute('data-id'));
  
  // Hide results
  document.getElementById('searchResults').style.display = 'none';
  
  // Clear search input
  document.getElementById('globalSearchInput').value = '';
  
  // Navigate to the appropriate section
  switch (type) {
    case 'team':
      ui.switchTab('teams');
      setTimeout(() => ui.showTeamDetails(id), 500);
      break;
    case 'person':
      ui.switchTab('personnel');
      // Highlight the person in the list
      setTimeout(() => {
        const personRow = document.querySelector(`tr[data-person-id="${id}"]`);
        if (personRow) {
          personRow.classList.add('highlight-row');
          personRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => personRow.classList.remove('highlight-row'), 3000);
        }
      }, 500);
      break;
    case 'document':
      ui.switchTab('documentation');
      setTimeout(() => ui.viewDocument(id), 500);
      break;
    case 'task':
      ui.switchTab('planning');
      break;
  }
}

// Initialize notification system
function initializeNotifications() {
  if (!window.appData.notifications) {
    window.appData.notifications = [];
  }
  
  const notificationBell = document.createElement('div');
  notificationBell.className = 'notification-bell';
  notificationBell.innerHTML = `
    <button id="notificationButton">
      <i class="fas fa-bell"></i>
      <span id="notificationCount" class="notification-count">0</span>
    </button>
    <div id="notificationPanel" class="notification-panel">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button id="markAllReadBtn">Mark all as read</button>
      </div>
      <div id="notificationList" class="notification-list"></div>
    </div>
  `;
  
  document.querySelector('header').appendChild(notificationBell);
  
  // Add event listeners
  document.getElementById('notificationButton').addEventListener('click', toggleNotifications);
  document.getElementById('markAllReadBtn').addEventListener('click', markAllNotificationsRead);
  
  // Hide panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-bell')) {
      document.getElementById('notificationPanel').classList.remove('show');
    }
  });
  
  // Update notification count
  updateNotificationCount();
  
  // Check for new notifications every minute
  setInterval(checkForNewNotifications, 60000);
}

// Toggle notification panel
function toggleNotifications() {
  const panel = document.getElementById('notificationPanel');
  panel.classList.toggle('show');
  
  if (panel.classList.contains('show')) {
    renderNotifications();
  }
}

// Render notifications in the panel
function renderNotifications() {
  const notificationList = document.getElementById('notificationList');
  
  if (!window.appData.notifications || window.appData.notifications.length === 0) {
    notificationList.innerHTML = '<div class="no-notifications">No notifications</div>';
    return;
  }
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...window.appData.notifications].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  notificationList.innerHTML = sortedNotifications.map(notification => `
    <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
      <div class="notification-icon">
        <i class="fas ${getNotificationIcon(notification.type)}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${formatNotificationTime(notification.date)}</div>
      </div>
      <button class="notification-mark-read" title="Mark as read">
        <i class="fas fa-check"></i>
      </button>
    </div>
  `).join('');
  
  // Add event listeners to mark individual notifications as read
  document.querySelectorAll('.notification-mark-read').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const notificationId = parseInt(e.currentTarget.closest('.notification-item').getAttribute('data-id'));
      markNotificationRead(notificationId);
    });
  });
  
  // Add event listeners to notification items to navigate
  document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-mark-read')) {
        const notificationId = parseInt(item.getAttribute('data-id'));
        handleNotificationClick(notificationId);
      }
    });
  });
}

// Mark a notification as read
function markNotificationRead(id) {
  const notification = window.appData.notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    renderNotifications();
    updateNotificationCount();
    saveNotifications();
  }
}

// Mark all notifications as read
function markAllNotificationsRead() {
  window.appData.notifications.forEach(notification => {
    notification.read = true;
  });
  
  renderNotifications();
  updateNotificationCount();
  saveNotifications();
}

// Update the notification count badge
function updateNotificationCount() {
  const unreadCount = window.appData.notifications.filter(n => !n.read).length;
  const countElement = document.getElementById('notificationCount');
  
  countElement.textContent = unreadCount;
  countElement.style.display = unreadCount > 0 ? 'block' : 'none';
}

// Save notifications to localStorage
function saveNotifications() {
  localStorage.setItem('notifications', JSON.stringify(window.appData.notifications));
}

// Check for new notifications
function checkForNewNotifications() {
  // Here you would typically make API calls or check for new data
  // For demonstration, we'll just add random notifications occasionally
  if (Math.random() < 0.3) {  // 30% chance to add a notification
    addRandomNotification();
  }
}

// Add a random notification for demo purposes
function addRandomNotification() {
  const types = ['info', 'warning', 'success', 'error'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const titles = [
    'New team member added',
    'Document updated',
    'Milestone completed',
    'Task assigned',
    'Performance review scheduled'
  ];
  
  const messages = [
    'A new member has been added to your team.',
    'An important document has been updated.',
    'A project milestone has been completed.',
    'You have been assigned a new task.',
    'Your performance review is scheduled for next week.'
  ];
  
  const randomIndex = Math.floor(Math.random() * titles.length);
  
  const notification = {
    id: Date.now(),
    type: type,
    title: titles[randomIndex],
    message: messages[randomIndex],
    date: new Date().toISOString(),
    read: false,
    actionType: 'navigate',
    actionTarget: 'dashboard'
  };
  
  window.appData.notifications.push(notification);
  updateNotificationCount();
  saveNotifications();
  
  // Show toast notification
  ui.showToast(notification.title, 'info');
}

// Handle clicking on a notification
function handleNotificationClick(id) {
  const notification = window.appData.notifications.find(n => n.id === id);
  if (!notification) return;
  
  // Mark as read
  markNotificationRead(id);
  
  // Close panel
  document.getElementById('notificationPanel').classList.remove('show');
  
  // Navigate based on action
  if (notification.actionType === 'navigate' && notification.actionTarget) {
    ui.switchTab(notification.actionTarget);
  }
}

// Get icon class for notification type
function getNotificationIcon(type) {
  switch (type) {
    case 'info': return 'fa-info-circle';
    case 'warning': return 'fa-exclamation-triangle';
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-times-circle';
    default: return 'fa-bell';
  }
}

// Format notification time in a user-friendly way
function formatNotificationTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

// Display loading error
function displayLoadingError(error) {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Application Error</h2>
        <p>There was a problem loading the application:</p>
        <div class="error-message">${error.message || 'Unknown error'}</div>
        <button class="btn-primary mt-4" onclick="location.reload()">
          <i class="fas fa-sync-alt mr-2"></i> Retry
        </button>
      </div>
    `;
  }
} 