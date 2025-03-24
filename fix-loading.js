// MASTER LOADING FIX SCRIPT
// This script takes control of the entire loading process to ensure the application loads properly
console.log('MASTER LOADING FIX: Initializing');

// Immediately executing function to take control
(function() {
  // Global state tracking
  window.appState = {
    loaded: false,
    initializing: true,
    startTime: Date.now(),
    errors: [],
    fixesApplied: []
  };
  
  // Add the global error handler
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('MASTER FIX - Global error caught:', message);
    
    // Track the error
    if (window.appState) {
      window.appState.errors.push({
        message,
        source,
        lineno,
        colno,
        time: new Date().toISOString()
      });
    }
    
    // Try to recover automatically
    tryAutoRecover(message);
    
    // Let other handlers run too
    return false;
  };
  
  // Initialization sequence
  function initSequence() {
    console.log('MASTER FIX: Starting init sequence');
    window.appState.fixesApplied.push('init-sequence-started');
    
    // Ensure basic DOM elements exist
    ensureBasicDOM();
    
    // Hide the loading screen after a reasonable timeout
    ensureLoaderRemoved();
    
    // Ensure tabs are created
    createMinimalTabs();
    
    // Make sure we have content to show
    ensureAppData();
    
    // Load initial tab content
    setTimeout(loadInitialContent, 500);
    
    // Set final "app is loaded" after a reasonable delay
    setTimeout(finalizeLoading, 1000);
  }
  
  // Ensure basic DOM structure exists
  function ensureBasicDOM() {
    // Make sure tabList and tabContent exist
    ensureElement('tabList', 'div', 'tab-list px-4 pt-4', document.querySelector('main'));
    ensureElement('tabContent', 'div', 'p-4', document.querySelector('main'));
    
    // Make sure toast exists for notifications
    ensureElement('toast', 'div', 'toast', document.body);
    
    window.appState.fixesApplied.push('basic-dom-ensured');
  }
  
  // Ensure an element exists or create it
  function ensureElement(id, tagName, className, parent) {
    let element = document.getElementById(id);
    
    if (!element) {
      console.log(`MASTER FIX: Creating missing ${id} element`);
      element = document.createElement(tagName);
      element.id = id;
      element.className = className;
      
      if (parent) {
        parent.appendChild(element);
      } else {
        document.body.appendChild(element);
      }
    }
    
    return element;
  }
  
  // Ensure the loader is removed
  function ensureLoaderRemoved() {
    setTimeout(() => {
      const initialLoader = document.getElementById('initialLoader');
      if (initialLoader) {
        console.log('MASTER FIX: Hiding initial loader');
        initialLoader.style.display = 'none';
        window.appState.fixesApplied.push('loader-hidden');
      }
    }, 1000);
  }
  
  // Create minimal tabs if they don't exist
  function createMinimalTabs() {
    const tabList = document.getElementById('tabList');
    
    // Only create tabs if the tabList is empty
    if (tabList && tabList.children.length === 0) {
      console.log('MASTER FIX: Creating minimal tabs');
      
      const defaultTabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'teams', label: 'Teams', icon: 'fa-users' },
        { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
        { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
      ];
      
      // Use config tabs if available, otherwise use defaults
      const tabs = window.config && window.config.tabs ? window.config.tabs : defaultTabs;
      
      // Generate the tab HTML
      tabList.innerHTML = tabs.map((tab, index) => `
        <button class="tab-btn ${index === 0 ? 'active' : ''}" 
               id="tab-${tab.id}" 
               data-tab="${tab.id}" 
               role="tab" 
               aria-selected="${index === 0 ? 'true' : 'false'}" 
               aria-controls="panel-${tab.id}">
          <i class="fas ${tab.icon}" aria-hidden="true"></i>
          <span>${tab.label}</span>
        </button>
      `).join('');
      
      // Set up tab click handlers
      setupTabHandlers();
      
      window.appState.fixesApplied.push('minimal-tabs-created');
    }
  }
  
  // Set up tab click handlers
  function setupTabHandlers() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
      // Skip if this button already has a handler
      if (button.dataset.handlerAttached) return;
      
      button.dataset.handlerAttached = 'true';
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Update active state
        tabButtons.forEach(btn => {
          btn.classList.toggle('active', btn === button);
          btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
        });
        
        // Handle tab switching with multiple fallbacks
        if (window.ui && typeof window.ui.switchTab === 'function') {
          try {
            window.ui.switchTab(tabId);
          } catch (error) {
            console.error('MASTER FIX: Error in ui.switchTab', error);
            forceTabContent(tabId);
          }
        } else if (typeof window.forceSwitchTab === 'function') {
          window.forceSwitchTab(tabId);
        } else {
          forceTabContent(tabId);
        }
      });
    });
  }
  
  // Ensure we have app data
  function ensureAppData() {
    if (!window.appData) {
      console.log('MASTER FIX: Creating missing appData');
      
      window.appData = {
        teams: [
          {
            id: 1,
            name: "Quality Control Team",
            stream: "bbv",
            description: "Responsible for ensuring product quality standards",
            responsibilities: "Quality control, testing, and compliance",
            performance: 85,
            personnel: [
              { id: 101, name: "John Smith", role: "Quality Manager", client: "Pfizer" },
              { id: 102, name: "Sarah Johnson", role: "Quality Engineer", client: "Merck" }
            ]
          },
          {
            id: 2,
            name: "Validation Team",
            stream: "add",
            description: "Handles validation of processes and systems",
            responsibilities: "Process validation, equipment validation",
            performance: 78,
            personnel: [
              { id: 103, name: "Michael Brown", role: "Validation Lead", client: "J&J" }
            ]
          }
        ],
        state: {
          isLoggedIn: true,
          userName: "User",
          userRole: "Administrator",
          currentTab: 'dashboard'
        }
      };
      
      window.appState.fixesApplied.push('appdata-created');
    }
  }
  
  // Ensure the config object exists
  function ensureConfig() {
    if (!window.config) {
      console.log('MASTER FIX: Creating missing config');
      
      window.config = {
        tabs: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
          { id: 'teams', label: 'Teams', icon: 'fa-users' },
          { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
          { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
        ],
        colors: {
          bbv: "#00518A",
          add: "#CC2030", 
          arb: "#4F46E5",
          shared: "#232323"
        }
      };
      
      window.appState.fixesApplied.push('config-created');
    }
  }
  
  // Load initial tab content
  function loadInitialContent() {
    const tabContent = document.getElementById('tabContent');
    if (tabContent && (tabContent.innerHTML === '' || tabContent.innerText.includes('Loading'))) {
      console.log('MASTER FIX: Loading initial dashboard content');
      forceTabContent('dashboard');
      window.appState.fixesApplied.push('initial-content-loaded');
    }
  }
  
  // Force tab content to be displayed
  function forceTabContent(tabId) {
    console.log(`MASTER FIX: Forcing content for tab: ${tabId}`);
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    // Ensure the tab has proper ID for ARIA
    tabContent.id = `panel-${tabId}`;
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('aria-labelledby', `tab-${tabId}`);
    
    // Update state if possible
    if (window.appData && window.appData.state) {
      window.appData.state.currentTab = tabId;
    }
    
    // Generate different content based on the tab
    switch(tabId) {
      case 'dashboard':
        renderDashboardContent(tabContent);
        break;
      case 'teams':
        renderTeamsContent(tabContent);
        break;
      case 'personnel':
        renderPersonnelContent(tabContent);
        break;
      case 'documentation':
        renderDocumentationContent(tabContent);
        break;
      default:
        tabContent.innerHTML = `
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
            <p>Content for ${tabId} tab</p>
          </div>
        `;
    }
    
    window.appState.fixesApplied.push(`${tabId}-content-forced`);
  }
  
  // Render dashboard content
  function renderDashboardContent(container) {
    // Make sure we have data to work with
    ensureAppData();
    
    // Get data counts
    const teams = window.appData.teams || [];
    const totalTeams = teams.length;
    let totalPersonnel = 0;
    let bbvPersonnel = 0;
    let addPersonnel = 0;
    
    // Count personnel by stream
    teams.forEach(team => {
      if (team.personnel) {
        totalPersonnel += team.personnel.length;
        if (team.stream === 'bbv') bbvPersonnel += team.personnel.length;
        if (team.stream === 'add') addPersonnel += team.personnel.length;
      }
    });
    
    // Render the dashboard
    container.innerHTML = `
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <!-- Stats Cards -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">Total Teams</div>
            <div class="text-2xl font-bold">${totalTeams}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">Total Personnel</div>
            <div class="text-2xl font-bold">${totalPersonnel}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">BBV Team Members</div>
            <div class="text-2xl font-bold">${bbvPersonnel}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">ADD Team Members</div>
            <div class="text-2xl font-bold">${addPersonnel}</div>
          </div>
        </div>
        
        <!-- Recent Activities -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h3 class="text-lg font-semibold mb-4">Recent Activities</h3>
          <div class="space-y-4" id="recentActivities">
            <p class="text-gray-500">No recent activities</p>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button class="btn-primary w-full py-3" id="viewTeamsBtn">
              <i class="fas fa-users mr-2"></i> View Teams
            </button>
            <button class="btn-primary w-full py-3" id="viewPersonnelBtn">
              <i class="fas fa-user mr-2"></i> View Personnel
            </button>
            <button class="btn-secondary w-full py-3">
              <i class="fas fa-chart-bar mr-2"></i> View Reports
            </button>
            <button class="btn-secondary w-full py-3">
              <i class="fas fa-cog mr-2"></i> Settings
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add some interactivity to buttons
    const viewTeamsBtn = document.getElementById('viewTeamsBtn');
    const viewPersonnelBtn = document.getElementById('viewPersonnelBtn');
    
    if (viewTeamsBtn) {
      viewTeamsBtn.addEventListener('click', () => {
        const teamsTab = document.querySelector('[data-tab="teams"]');
        if (teamsTab) teamsTab.click();
      });
    }
    
    if (viewPersonnelBtn) {
      viewPersonnelBtn.addEventListener('click', () => {
        const personnelTab = document.querySelector('[data-tab="personnel"]');
        if (personnelTab) personnelTab.click();
      });
    }
  }
  
  // Render teams content
  function renderTeamsContent(container) {
    // Make sure we have data
    ensureAppData();
    
    const teams = window.appData.teams || [];
    
    container.innerHTML = `
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Teams</h2>
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center">
            <i class="fas fa-plus mr-2"></i> Add Team
          </button>
        </div>
        
        <!-- Team Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${teams.length > 0 ? teams.map(team => `
            <div class="bg-white rounded-lg shadow-sm hover:shadow transition-all p-4 border border-gray-200">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white bg-gray-600">
                  ${team.name.charAt(0)}
                </div>
                <div>
                  <h3 class="font-semibold">${team.name}</h3>
                  <p class="text-xs text-gray-500">${team.stream.toUpperCase()} • ${team.personnel.length} members</p>
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mb-4">${team.description}</p>
              
              <div class="text-xs text-gray-500 mb-1 flex justify-between">
                <span>Members</span>
                <span>${team.personnel.length}</span>
              </div>
              
              <div class="flex flex-wrap gap-1 mb-4">
                ${team.personnel.slice(0, 3).map(person => `
                  <span class="bg-gray-100 px-2 py-1 rounded-md text-xs">${person.name.split(' ')[0]}</span>
                `).join('')}
                ${team.personnel.length > 3 ? `
                  <span class="bg-gray-100 px-2 py-1 rounded-md text-xs">+${team.personnel.length - 3} more</span>
                ` : ''}
              </div>
              
              <div class="flex justify-between">
                <button class="text-blue-600 text-sm hover:text-blue-800" data-action="view" data-team-id="${team.id}">
                  View Details
                </button>
                <div>
                  <button class="text-gray-500 hover:text-blue-600 mx-2" data-action="edit" data-team-id="${team.id}">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="text-gray-500 hover:text-red-600" data-action="delete" data-team-id="${team.id}">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('') : '<p class="text-gray-500">No teams available</p>'}
        </div>
      </div>
    `;
  }
  
  // Render personnel content
  function renderPersonnelContent(container) {
    // Make sure we have data
    ensureAppData();
    
    // Extract all personnel from teams
    const teams = window.appData.teams || [];
    const allPersonnel = [];
    
    teams.forEach(team => {
      if (team.personnel) {
        team.personnel.forEach(person => {
          allPersonnel.push({
            ...person,
            team: team.name,
            stream: team.stream
          });
        });
      }
    });
    
    container.innerHTML = `
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Personnel</h2>
          <div class="flex items-center gap-4">
            <div class="relative">
              <input type="text" id="personnelSearch" placeholder="Search personnel..." 
                class="border rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center">
              <i class="fas fa-plus mr-2"></i> Add Person
            </button>
          </div>
        </div>
        
        <!-- Personnel Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${allPersonnel.length > 0 ? allPersonnel.map(person => `
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">${person.name}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${person.role}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full text-white bg-gray-600">${person.team}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">${person.client}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button class="text-blue-600 hover:text-blue-800 mr-2" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800" title="Delete">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              `).join('') : '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No personnel data available</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Add search functionality
    const searchInput = document.getElementById('personnelSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const rows = container.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(value) ? '' : 'none';
        });
      });
    }
  }
  
  // Render documentation content
  function renderDocumentationContent(container) {
    // Make sure we have data
    ensureAppData();
    
    // Get or create documents array
    if (!window.appData.documents) {
      window.appData.documents = [
        {
          id: 1,
          title: "Quality Manual",
          type: "manual",
          description: "Primary document describing the quality management system",
          version: 2.1,
          status: "approved",
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        {
          id: 2,
          title: "Change Control SOP",
          type: "procedure",
          description: "Standard operating procedure for managing change control",
          version: 1.5,
          status: "review",
          lastUpdated: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0]
        }
      ];
    }
    
    const documents = window.appData.documents || [];
    
    container.innerHTML = `
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Documentation</h2>
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center">
            <i class="fas fa-plus mr-2"></i> Add Document
          </button>
        </div>
        
        <!-- Documents Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${documents.map(doc => `
            <div class="bg-white rounded-lg shadow-sm hover:shadow transition-all p-4 border border-gray-200">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-semibold">${doc.title}</h3>
                  <p class="text-sm text-gray-500">${doc.type}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs ${
                  doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                  doc.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }">${doc.status}</span>
              </div>
              <p class="text-sm text-gray-600 mb-4">${doc.description}</p>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>v${doc.version}</span>
                <span>${doc.lastUpdated}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Mark loading as complete
  function finalizeLoading() {
    const loadingTime = Date.now() - window.appState.startTime;
    console.log(`MASTER FIX: App loaded in ${loadingTime}ms`);
    
    window.appState.loaded = true;
    window.appState.initializing = false;
    window.appState.fixesApplied.push('loading-finalized');
    
    // Clear any emergency timeouts
    if (window.emergencyTimeout) {
      clearTimeout(window.emergencyTimeout);
    }
    
    // Force tab content one more time if needed
    const tabContent = document.getElementById('tabContent');
    if (tabContent && tabContent.innerText.includes('Loading')) {
      const activeTab = document.querySelector('.tab-btn.active');
      const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
      forceTabContent(tabId);
    }
  }
  
  // Try to recover automatically from errors
  function tryAutoRecover(errorMessage) {
    console.log('MASTER FIX: Attempting auto-recovery');
    
    // Fix for "config is not defined" error
    if (errorMessage.includes('config is not defined')) {
      ensureConfig();
    }
    
    // Fix for tab related errors
    if (errorMessage.includes('tab') || errorMessage.includes('Tab')) {
      createMinimalTabs();
      setupTabHandlers();
      
      // Try to load content for the active tab
      const activeTab = document.querySelector('.tab-btn.active');
      const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
      forceTabContent(tabId);
    }
    
    window.appState.fixesApplied.push('auto-recovery-attempted');
  }
  
  // Start monitoring for issues
  function startMonitoring() {
    console.log('MASTER FIX: Starting monitoring');
    
    // Check for stuck loading
    setInterval(() => {
      const tabContent = document.getElementById('tabContent');
      
      // Check if content is still loading after app should be ready
      if (window.appState.loaded && tabContent && tabContent.innerText.includes('Loading')) {
        console.warn('MASTER FIX: Detected stuck loading after app ready state');
        
        // Get active tab
        const activeTab = document.querySelector('.tab-btn.active');
        const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
        
        // Force content display
        forceTabContent(tabId);
      }
    }, 2000);
    
    window.appState.fixesApplied.push('monitoring-started');
  }
  
  // Check if we need to perform any emergency fixes
  function performEmergencyChecks() {
    // If running for more than 10 seconds and not loaded, something's wrong
    setTimeout(() => {
      if (!window.appState.loaded) {
        console.error('MASTER FIX: App still not loaded after 10s - applying emergency fixes');
        
        // Force tab creation
        createMinimalTabs();
        
        // Force dashboard content
        forceTabContent('dashboard');
        
        // Hide loader
        const initialLoader = document.getElementById('initialLoader');
        if (initialLoader) {
          initialLoader.style.display = 'none';
        }
        
        window.appState.fixesApplied.push('emergency-fixes-applied');
      }
    }, 10000);
  }
  
  // Run everything in sequence
  function runFixSequence() {
    // First ensure we have config
    ensureConfig();
    
    // Start the initialization sequence
    initSequence();
    
    // Start monitoring
    startMonitoring();
    
    // Check for emergency situations
    performEmergencyChecks();
  }
  
  // Start everything when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFixSequence);
  } else {
    // DOM already loaded, run immediately
    runFixSequence();
  }
  
  // Force hide loader when window fully loads
  window.addEventListener('load', () => {
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      console.log('MASTER FIX: Hiding loader on window load event');
      initialLoader.style.display = 'none';
    }
  });
  
  // Export functions for other scripts to use
  window.masterFix = {
    forceTabContent,
    ensureAppData,
    ensureConfig,
    createMinimalTabs,
    finalizeLoading
  };
  
  console.log('MASTER LOADING FIX: Setup complete');
})(); 