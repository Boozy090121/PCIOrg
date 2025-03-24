/**
 * Script Diagnostic & Repair Tool
 * Helps identify and fix script loading issues
 */

console.log('Script diagnostic tool loading...');

// Create diagnostic namespace
const ScriptDiagnostic = {
  // Configuration
  config: {
    criticalScripts: [
      'app.js', 
      'ui.js', 
      'data.js', 
      'config.js'
    ],
    fixScripts: [
      'fix-loading-sequence.js',
      'fix-tabs.js',
      'fix-critical.js',
      'force-content.js'
    ]
  },
  
  // Keep track of diagnostics
  results: {
    scriptsChecked: [],
    scriptsMissing: [],
    scriptsWithErrors: [],
    objectsMissing: [],
    diagnosticComplete: false,
    startTime: null,
    endTime: null
  },
  
  /**
   * Initialize the diagnostic
   */
  init() {
    console.log('Script diagnostic starting...');
    this.results.startTime = new Date();
    
    // Check script loading status
    this.checkScriptStatus();
    
    // Check for required global objects
    this.checkRequiredObjects();
    
    // Apply fixes if needed
    this.applyFixes();
    
    // Complete diagnostic
    this.completeDiagnostic();
  },
  
  /**
   * Check if all required scripts are loaded
   */
  checkScriptStatus() {
    console.log('Checking script loading status...');
    
    // Get all scripts in the document
    const loadedScripts = Array.from(document.scripts).map(script => {
      // Extract script name from src url
      if (script.src) {
        const parts = script.src.split('/');
        return parts[parts.length - 1];
      }
      return null;
    }).filter(name => name !== null);
    
    this.results.scriptsChecked = loadedScripts;
    
    // Check critical scripts
    this.config.criticalScripts.forEach(scriptName => {
      if (!loadedScripts.some(name => name.includes(scriptName))) {
        console.warn(`Critical script missing: ${scriptName}`);
        this.results.scriptsMissing.push(scriptName);
      }
    });
    
    // Check fix scripts
    this.config.fixScripts.forEach(scriptName => {
      if (!loadedScripts.some(name => name.includes(scriptName))) {
        console.warn(`Fix script missing: ${scriptName}`);
        this.results.scriptsMissing.push(scriptName);
      }
    });
    
    // Check for script errors
    if (window.appErrors && Array.isArray(window.appErrors)) {
      window.appErrors.forEach(error => {
        if (error.source) {
          // Extract script name from source url
          const parts = error.source.split('/');
          const scriptName = parts[parts.length - 1];
          
          if (scriptName && !this.results.scriptsWithErrors.includes(scriptName)) {
            this.results.scriptsWithErrors.push(scriptName);
          }
        }
      });
    }
  },
  
  /**
   * Check if required global objects are available
   */
  checkRequiredObjects() {
    console.log('Checking required global objects...');
    
    // List of required global objects
    const requiredObjects = [
      { name: 'appData', fallback: this.createFallbackAppData },
      { name: 'ui', fallback: this.createFallbackUI },
      { name: 'config', fallback: this.createFallbackConfig }
    ];
    
    // Check each object
    requiredObjects.forEach(obj => {
      if (!window[obj.name]) {
        console.warn(`Required global object missing: ${obj.name}`);
        this.results.objectsMissing.push(obj.name);
        
        // Create fallback object
        if (typeof obj.fallback === 'function') {
          window[obj.name] = obj.fallback();
          console.log(`Created fallback for ${obj.name}`);
        }
      }
    });
  },
  
  /**
   * Apply fixes based on diagnostic results
   */
  applyFixes() {
    console.log('Applying fixes based on diagnostic results...');
    
    // If critical scripts are missing, load them dynamically
    if (this.results.scriptsMissing.length > 0) {
      this.dynamicallyLoadMissingScripts();
    }
    
    // If ui object is missing, create fallback
    if (this.results.objectsMissing.includes('ui')) {
      this.patchUIFunctions();
    }
    
    // Fix any broken tab functionality
    this.fixTabFunctionality();
    
    // Set up backup content rendering
    this.setupBackupContentRendering();
  },
  
  /**
   * Dynamically load missing scripts
   */
  dynamicallyLoadMissingScripts() {
    console.log('Attempting to load missing scripts...');
    
    // Focus on fix scripts first
    const fixScripts = this.results.scriptsMissing.filter(name => 
      this.config.fixScripts.some(fixName => name.includes(fixName))
    );
    
    // Load fix scripts
    fixScripts.forEach(scriptName => {
      this.loadScript(scriptName);
    });
    
    // After a delay, check if we need to load emergency fix script
    setTimeout(() => {
      if (!window.emergencyUI && !window.FixCoordinator) {
        console.warn('Emergency functionality still not available, loading fallback...');
        this.loadScript('fix-critical.js');
      }
    }, 2000);
  },
  
  /**
   * Load a script dynamically
   */
  loadScript(scriptName) {
    const script = document.createElement('script');
    script.src = scriptName;
    script.async = true;
    script.onerror = () => {
      console.error(`Failed to load script: ${scriptName}`);
    };
    document.head.appendChild(script);
    console.log(`Dynamically loaded script: ${scriptName}`);
  },
  
  /**
   * Create fallback appData
   */
  createFallbackAppData() {
    return {
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
      ]
    };
  },
  
  /**
   * Create fallback UI object
   */
  createFallbackUI() {
    return {
      init() {
        console.log('Fallback UI initialization');
        const tabList = document.getElementById('tabList');
        const tabContent = document.getElementById('tabContent');
        
        if (!tabList || !tabContent) {
          console.error('Required DOM elements missing');
          return;
        }
        
        // Set up tabs from config
        if (window.config && window.config.tabs) {
          this.setupTabs();
        }
      },
      
      setupTabs() {
        const tabList = document.getElementById('tabList');
        if (!tabList) return;
        
        // Only create tabs if not already present
        if (tabList.children.length === 0) {
          const tabs = window.config.tabs || [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'teams', label: 'Teams', icon: 'fa-users' },
            { id: 'personnel', label: 'Personnel', icon: 'fa-user' }
          ];
          
          let tabsHTML = '';
          tabs.forEach((tab, index) => {
            tabsHTML += `
              <button class="tab-btn ${index === 0 ? 'active' : ''}" 
                   id="tab-${tab.id}" 
                   data-tab="${tab.id}" 
                   role="tab" 
                   aria-selected="${index === 0 ? 'true' : 'false'}" 
                   aria-controls="panel-${tab.id}">
                <i class="fas ${tab.icon}" aria-hidden="true"></i>
                <span>${tab.label}</span>
              </button>
            `;
          });
          
          tabList.innerHTML = tabsHTML;
          
          // Add event listeners to tabs
          tabList.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const tabId = btn.getAttribute('data-tab');
              this.switchTab(tabId);
            });
          });
        }
      },
      
      switchTab(tabId) {
        console.log(`Fallback switch to tab: ${tabId}`);
        
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
          const isActive = btn.getAttribute('data-tab') === tabId;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        
        // Get tab content
        const tabContent = document.getElementById('tabContent');
        if (!tabContent) return;
        
        // Show loading indicator
        tabContent.innerHTML = `
          <div class="flex items-center justify-center p-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p class="ml-3">Loading ${tabId}...</p>
          </div>
        `;
        
        // Attempt to load content
        setTimeout(() => {
          // Check if content is still loading
          if (tabContent.innerText.includes('Loading')) {
            // Use emergency content
            if (window.forceContent && window.forceContent[tabId]) {
              window.forceContent[tabId]();
            } else if (window.FixCoordinator && window.FixCoordinator.generateBasicContent) {
              window.FixCoordinator.generateBasicContent(tabId);
            } else if (window.emergencyUI && window.emergencyUI.showEmergencyTabContent) {
              window.emergencyUI.showEmergencyTabContent(tabId);
            } else {
              // Last resort - show error
              tabContent.innerHTML = `
                <div class="p-6">
                  <h2 class="text-xl font-semibold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
                  <p>Unable to load content. Please try refreshing the page.</p>
                  <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                    Refresh
                  </button>
                </div>
              `;
            }
          }
        }, 1000);
      }
    };
  },
  
  /**
   * Create fallback config
   */
  createFallbackConfig() {
    return {
      tabs: [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'teams', label: 'Teams', icon: 'fa-users' },
        { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
        { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' },
        { id: 'planning', label: 'Planning', icon: 'fa-project-diagram' },
        { id: 'orgchart', label: 'Org Chart', icon: 'fa-sitemap' },
        { id: 'rolematrix', label: 'Role Matrix', icon: 'fa-th' },
        { id: 'skillsmatrix', label: 'Skills Matrix', icon: 'fa-cubes' },
        { id: 'racimatrix', label: 'RACI Matrix', icon: 'fa-list-alt' }
      ],
      colors: {
        bbv: '#00518A',
        add: '#CC2030',
        arb: '#4F46E5',
        shared: '#232323',
        root: '#333333'
      }
    };
  },
  
  /**
   * Patch UI functions
   */
  patchUIFunctions() {
    console.log('Patching UI functions...');
    
    // Ensure we have the ui object
    if (!window.ui) {
      window.ui = this.createFallbackUI();
    }
    
    // Make sure switchTab exists and is working
    if (!window.ui.switchTab || typeof window.ui.switchTab !== 'function') {
      window.ui.switchTab = function(tabId) {
        console.log(`Patched switch to tab: ${tabId}`);
        
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
          const isActive = btn.getAttribute('data-tab') === tabId;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        
        // Handle content loading based on available methods
        if (window.forceContent && window.forceContent[tabId]) {
          window.forceContent[tabId]();
        } else if (window.FixCoordinator && window.FixCoordinator.generateBasicContent) {
          window.FixCoordinator.generateBasicContent(tabId);
        } else if (window.emergencyUI && window.emergencyUI.showEmergencyTabContent) {
          window.emergencyUI.showEmergencyTabContent(tabId);
        }
      };
    }
    
    // Patch init method if it's broken
    if (!window.ui.init || typeof window.ui.init !== 'function') {
      window.ui.init = function() {
        console.log('Patched UI initialization');
        if (window.ui.setupTabs && typeof window.ui.setupTabs === 'function') {
          window.ui.setupTabs();
        }
      };
    }
    
    // Make init and switchTab available globally as a fallback
    window.initUI = function() {
      if (window.ui && typeof window.ui.init === 'function') {
        window.ui.init();
      }
    };
    
    window.switchTab = function(tabId) {
      if (window.ui && typeof window.ui.switchTab === 'function') {
        window.ui.switchTab(tabId);
      }
    };
  },
  
  /**
   * Fix tab functionality
   */
  fixTabFunctionality() {
    console.log('Fixing tab functionality...');
    
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // If no tab buttons, create them
    if (tabButtons.length === 0) {
      if (window.emergencyTabFunctions && typeof window.emergencyTabFunctions.ensureAllTabs === 'function') {
        window.emergencyTabFunctions.ensureAllTabs();
      } else if (window.ui && typeof window.ui.setupTabs === 'function') {
        window.ui.setupTabs();
      } else {
        this.createEmergencyTabs();
      }
    } else {
      // Fix tab buttons event listeners
      tabButtons.forEach(button => {
        // Check if button has a click event listener
        if (!button.onclick && !button._hasClickListener) {
          const tabId = button.getAttribute('data-tab');
          button.addEventListener('click', () => {
            // Update active state
            tabButtons.forEach(btn => {
              btn.classList.toggle('active', btn === button);
              btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
            });
            
            // Try using all available tab switching methods
            if (window.ui && typeof window.ui.switchTab === 'function') {
              window.ui.switchTab(tabId);
            } else if (window.forceSwitchTab && typeof window.forceSwitchTab === 'function') {
              window.forceSwitchTab(tabId);
            } else if (window.emergencyTabFunctions && typeof window.emergencyTabFunctions.switchToTab === 'function') {
              window.emergencyTabFunctions.switchToTab(tabId, button);
            }
          });
          
          // Mark button as fixed
          button._hasClickListener = true;
        }
      });
    }
  },
  
  /**
   * Create emergency tabs
   */
  createEmergencyTabs() {
    console.log('Creating emergency tabs');
    
    const tabList = document.getElementById('tabList');
    if (!tabList) return;
    
    // Only proceed if tabList is empty
    if (tabList.children.length > 0) return;
    
    // Get tabs from config or use defaults
    const tabs = window.config && window.config.tabs ? window.config.tabs : [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
      { id: 'teams', label: 'Teams', icon: 'fa-users' },
      { id: 'personnel', label: 'Personnel', icon: 'fa-user' }
    ];
    
    // Create tabs HTML
    let tabsHTML = '';
    tabs.forEach((tab, index) => {
      tabsHTML += `
        <button class="tab-btn ${index === 0 ? 'active' : ''}" 
             id="tab-${tab.id}" 
             data-tab="${tab.id}" 
             role="tab" 
             aria-selected="${index === 0 ? 'true' : 'false'}" 
             aria-controls="panel-${tab.id}">
          <i class="fas ${tab.icon}" aria-hidden="true"></i>
          <span>${tab.label}</span>
        </button>
      `;
    });
    
    // Set tab list content
    tabList.innerHTML = tabsHTML;
    
    // Add event listeners
    tabList.querySelectorAll('.tab-btn').forEach(button => {
      const tabId = button.getAttribute('data-tab');
      
      button.addEventListener('click', () => {
        // Update active state
        tabList.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.toggle('active', btn === button);
          btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
        });
        
        // Try using all available tab switching methods
        if (window.ui && typeof window.ui.switchTab === 'function') {
          window.ui.switchTab(tabId);
        } else if (window.forceSwitchTab && typeof window.forceSwitchTab === 'function') {
          window.forceSwitchTab(tabId);
        } else {
          // Fallback - show basic content
          const tabContent = document.getElementById('tabContent');
          if (tabContent) {
            tabContent.innerHTML = `
              <div class="p-6">
                <h2 class="text-xl font-semibold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
                <p>Basic content for ${tabId} tab.</p>
              </div>
            `;
          }
        }
      });
      
      // Mark button as fixed
      button._hasClickListener = true;
    });
    
    console.log('Emergency tabs created');
  },
  
  /**
   * Set up backup content rendering
   */
  setupBackupContentRendering() {
    console.log('Setting up backup content rendering...');
    
    // Check if we need to render content now
    const tabContent = document.getElementById('tabContent');
    if (tabContent && (tabContent.innerHTML.trim() === '' || tabContent.innerText.includes('Loading'))) {
      // Find active tab
      const activeTab = document.querySelector('.tab-btn.active');
      const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
      
      console.log(`Rendering backup content for ${tabId}`);
      
      // Try using various content loading methods
      if (window.forceContent && window.forceContent[tabId]) {
        window.forceContent[tabId]();
      } else if (window.FixCoordinator && window.FixCoordinator.generateBasicContent) {
        window.FixCoordinator.generateBasicContent(tabId);
      } else if (window.emergencyUI && window.emergencyUI.showEmergencyTabContent) {
        window.emergencyUI.showEmergencyTabContent(tabId);
      } else if (window.LoadingSequenceFix && window.LoadingSequenceFix.forceLoadContent) {
        window.LoadingSequenceFix.forceLoadContent();
      } else {
        // Last resort - show basic content
        tabContent.innerHTML = `
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
            <p>Basic content for ${tabId} tab.</p>
            <p class="mt-4">Application is in recovery mode due to script loading issues.</p>
            <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Refresh Page
            </button>
          </div>
        `;
      }
    }
    
    // Set up a continuous check for empty content
    setInterval(() => {
      const tabContent = document.getElementById('tabContent');
      if (tabContent && (tabContent.innerHTML.trim() === '' || tabContent.innerText.includes('Loading'))) {
        // Get active tab
        const activeTab = document.querySelector('.tab-btn.active');
        const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
        
        console.log(`Content still loading for ${tabId}, applying backup`);
        
        // Force content
        if (window.forceContent && window.forceContent[tabId]) {
          window.forceContent[tabId]();
        } else if (window.LoadingSequenceFix && window.LoadingSequenceFix.forceLoadContent) {
          window.LoadingSequenceFix.forceLoadContent();
        }
      }
    }, 3000); // Check every 3 seconds
  },
  
  /**
   * Complete the diagnostic
   */
  completeDiagnostic() {
    this.results.endTime = new Date();
    this.results.diagnosticComplete = true;
    
    const duration = (this.results.endTime - this.results.startTime) / 1000;
    console.log(`Script diagnostic complete in ${duration} seconds`);
    console.log('Results:', this.results);
    
    // Trigger an event to notify other scripts
    window.dispatchEvent(new CustomEvent('scriptDiagnosticComplete', { detail: this.results }));
    
    // Hide the loader if it's still visible
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }
  },
  
  /**
   * Show diagnostic results in the UI
   */
  showDiagnosticResults() {
    if (!this.results.diagnosticComplete) return;
    
    console.log('Showing diagnostic results in UI');
    
    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'diagnosticResults';
    resultsContainer.className = 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg';
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'absolute top-0 right-0 transform -translate-y-full bg-white px-4 py-2 rounded-t border border-gray-200 text-sm font-medium';
    toggleButton.textContent = 'Show Diagnostic';
    toggleButton.onclick = function() {
      const content = document.getElementById('diagnosticResultsContent');
      const isVisible = content.style.display !== 'none';
      content.style.display = isVisible ? 'none' : 'block';
      this.textContent = isVisible ? 'Show Diagnostic' : 'Hide Diagnostic';
    };
    
    // Create content
    const content = document.createElement('div');
    content.id = 'diagnosticResultsContent';
    content.style.display = 'none';
    content.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">Script Diagnostic Results</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 class="font-medium">Scripts Checked</h4>
          <ul class="list-disc pl-4">
            ${this.results.scriptsChecked.map(script => `<li>${script}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h4 class="font-medium">Issues Found</h4>
          <ul class="list-disc pl-4">
            ${this.results.scriptsMissing.map(script => `<li class="text-red-600">Missing: ${script}</li>`).join('')}
            ${this.results.scriptsWithErrors.map(script => `<li class="text-orange-600">Error in: ${script}</li>`).join('')}
            ${this.results.objectsMissing.map(obj => `<li class="text-yellow-600">Missing object: ${obj}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h4 class="font-medium">Actions Taken</h4>
          <ul class="list-disc pl-4">
            ${this.results.scriptsMissing.length > 0 ? '<li>Dynamically loaded missing scripts</li>' : ''}
            ${this.results.objectsMissing.includes('ui') ? '<li>Created fallback UI object</li>' : ''}
            <li>Fixed tab functionality</li>
            <li>Set up backup content rendering</li>
          </ul>
        </div>
      </div>
    `;
    
    // Add toggle button and content to container
    resultsContainer.appendChild(toggleButton);
    resultsContainer.appendChild(content);
    
    // Add to body
    document.body.appendChild(resultsContainer);
  }
};

// Run the diagnostic
document.addEventListener('DOMContentLoaded', () => {
  ScriptDiagnostic.init();
  setTimeout(() => ScriptDiagnostic.showDiagnosticResults(), 2000);
});

// Also run if we've already loaded but had errors
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  setTimeout(() => {
    if (!ScriptDiagnostic.results.diagnosticComplete) {
      ScriptDiagnostic.init();
      setTimeout(() => ScriptDiagnostic.showDiagnosticResults(), 2000);
    }
  }, 1000);
}

// Make diagnostic available globally
window.ScriptDiagnostic = ScriptDiagnostic;

console.log('Script diagnostic tool loaded');

// CORS Diagnostic Tool
(function() {
  console.log('CORS Diagnostic Tool loaded');
  
  // Create a global diagnostic object
  window.corsDiagnostic = {
    // Check all scripts for CORS issues
    checkScripts: function() {
      console.log("Running CORS script diagnostics...");
      
      const scripts = document.querySelectorAll('script[src]');
      const results = {
        total: scripts.length,
        withCrossOrigin: 0,
        withoutCrossOrigin: 0,
        external: 0,
        internal: 0,
        potentialIssues: []
      };
      
      scripts.forEach(script => {
        const isExternal = script.src.startsWith('http') || script.src.startsWith('//');
        const hasCrossOrigin = script.hasAttribute('crossorigin');
        
        if (isExternal) {
          results.external++;
          
          if (hasCrossOrigin) {
            results.withCrossOrigin++;
          } else {
            results.withoutCrossOrigin++;
            results.potentialIssues.push({
              type: 'script',
              src: script.src,
              issue: 'Missing crossorigin attribute'
            });
          }
        } else {
          results.internal++;
        }
      });
      
      console.table({
        'Total Scripts': results.total,
        'External Scripts': results.external,
        'Internal Scripts': results.internal,
        'With crossorigin': results.withCrossOrigin,
        'Without crossorigin': results.withoutCrossOrigin
      });
      
      if (results.potentialIssues.length > 0) {
        console.log("Potential CORS issues found:");
        console.table(results.potentialIssues);
      } else {
        console.log("No obvious CORS issues found in scripts");
      }
      
      return results;
    },
    
    // Check all stylesheets for CORS issues
    checkStylesheets: function() {
      console.log("Running CORS stylesheet diagnostics...");
      
      const links = document.querySelectorAll('link[rel="stylesheet"][href]');
      const results = {
        total: links.length,
        withCrossOrigin: 0,
        withoutCrossOrigin: 0,
        external: 0,
        internal: 0,
        potentialIssues: []
      };
      
      links.forEach(link => {
        const isExternal = link.href.startsWith('http') || link.href.startsWith('//');
        const hasCrossOrigin = link.hasAttribute('crossorigin');
        
        if (isExternal) {
          results.external++;
          
          if (hasCrossOrigin) {
            results.withCrossOrigin++;
          } else {
            results.withoutCrossOrigin++;
            results.potentialIssues.push({
              type: 'stylesheet',
              href: link.href,
              issue: 'Missing crossorigin attribute'
            });
          }
        } else {
          results.internal++;
        }
      });
      
      console.table({
        'Total Stylesheets': results.total,
        'External Stylesheets': results.external,
        'Internal Stylesheets': results.internal,
        'With crossorigin': results.withCrossOrigin,
        'Without crossorigin': results.withoutCrossOrigin
      });
      
      if (results.potentialIssues.length > 0) {
        console.log("Potential CORS issues found:");
        console.table(results.potentialIssues);
      } else {
        console.log("No obvious CORS issues found in stylesheets");
      }
      
      return results;
    },
    
    // Fix a specific script or all scripts
    fixScript: function(src) {
      if (src) {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script && !script.hasAttribute('crossorigin')) {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          newScript.crossOrigin = 'anonymous';
          
          // Copy all other attributes
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'src' && attr.name !== 'crossorigin') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          
          script.parentNode.replaceChild(newScript, script);
          console.log(`Fixed script: ${src}`);
          return true;
        } else {
          console.log(`Script not found or already has crossorigin: ${src}`);
          return false;
        }
      } else {
        // Fix all scripts
        let fixedCount = 0;
        document.querySelectorAll('script[src^="http"], script[src^="//"]').forEach(script => {
          if (!script.hasAttribute('crossorigin')) {
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.crossOrigin = 'anonymous';
            
            // Copy all other attributes
            Array.from(script.attributes).forEach(attr => {
              if (attr.name !== 'src' && attr.name !== 'crossorigin') {
                newScript.setAttribute(attr.name, attr.value);
              }
            });
            
            script.parentNode.replaceChild(newScript, script);
            fixedCount++;
          }
        });
        console.log(`Fixed ${fixedCount} scripts`);
        return fixedCount;
      }
    },
    
    // Show error tracking info
    showErrors: function() {
      console.log("Script errors captured:");
      if (window.scriptErrors && window.scriptErrors.length > 0) {
        console.table(window.scriptErrors);
      } else {
        console.log("No script errors have been captured yet");
      }
    },
    
    // Run all diagnostic checks
    runFullDiagnostic: function() {
      console.log("Running full CORS diagnostic...");
      
      this.checkScripts();
      this.checkStylesheets();
      this.showErrors();
      
      // Check credentials setup for fetch
      const fetchOverridden = window.fetch !== globalThis.fetch;
      console.log(`Fetch API override status: ${fetchOverridden ? 'Active' : 'Not active'}`);
      
      // Check XHR override
      const xhrOverridden = XMLHttpRequest.prototype.open !== globalThis.XMLHttpRequest.prototype.open;
      console.log(`XMLHttpRequest override status: ${xhrOverridden ? 'Active' : 'Not active'}`);
      
      console.log("Diagnostic complete. To fix CORS issues, run corsDiagnostic.fixAll()");
      
      return {
        scripts: this.checkScripts(),
        stylesheets: this.checkStylesheets(),
        errors: window.scriptErrors || [],
        fetchOverridden,
        xhrOverridden
      };
    },
    
    // Fix all CORS issues
    fixAll: function() {
      console.log("Attempting to fix all CORS issues...");
      
      // Fix scripts
      const scriptsFixed = this.fixScript();
      
      // Fix stylesheets
      let stylesheetsFixed = 0;
      document.querySelectorAll('link[rel="stylesheet"][href^="http"], link[rel="stylesheet"][href^="//"]').forEach(link => {
        if (!link.hasAttribute('crossorigin')) {
          const newLink = document.createElement('link');
          newLink.href = link.href;
          newLink.rel = 'stylesheet';
          newLink.crossOrigin = 'anonymous';
          
          // Copy all other attributes
          Array.from(link.attributes).forEach(attr => {
            if (attr.name !== 'href' && attr.name !== 'rel' && attr.name !== 'crossorigin') {
              newLink.setAttribute(attr.name, attr.value);
            }
          });
          
          link.parentNode.replaceChild(newLink, link);
          stylesheetsFixed++;
        }
      });
      
      console.log(`Fixed ${scriptsFixed} scripts and ${stylesheetsFixed} stylesheets`);
      console.log("Page may need to be refreshed for changes to take effect");
      
      return {
        scriptsFixed,
        stylesheetsFixed
      };
    }
  };
  
  // Run basic diagnostic on load
  window.addEventListener('load', function() {
    // Delay to allow other scripts to load
    setTimeout(function() {
      console.log("Running automatic CORS diagnostic check...");
      window.corsDiagnostic.checkScripts();
      window.corsDiagnostic.checkStylesheets();
      
      // Show help message in console
      console.log("");
      console.log("%cCORS Diagnostic Help", "font-size: 14px; font-weight: bold;");
      console.log("%cUse these commands to diagnose and fix CORS issues:", "font-style: italic;");
      console.log("%c - window.corsDiagnostic.runFullDiagnostic()", "color: blue");
      console.log("%c - window.corsDiagnostic.fixAll()", "color: green");
      console.log("%c - window.corsDiagnostic.showErrors()", "color: orange");
      console.log("");
    }, 2000);
  });
})(); 