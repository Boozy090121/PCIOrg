/**
 * Loading Sequence Fix
 * This script ensures proper initialization order of application components
 * and prevents "stuck loading" issues
 */

// Create LoadingSequenceFix namespace
const LoadingSequenceFix = {
  // Track initialization status
  initialized: false,
  
  // Track components initialization status
  componentsReady: {
    ui: false,
    data: false,
    config: false,
    app: false
  },
  
  /**
   * Initialize the fix
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    console.log('Loading sequence fix initializing...');
    
    // Monitor script loading completions
    this.monitorScriptLoading();
    
    // Set up safety timeouts
    this.setupSafetyTimeouts();
    
    // Watch for loading state
    this.watchLoadingState();
  },
  
  /**
   * Monitor script loading completions
   */
  monitorScriptLoading() {
    // Check if components are already loaded
    if (window.ui) this.componentsReady.ui = true;
    if (window.data) this.componentsReady.data = true;
    if (window.config) this.componentsReady.config = true;
    if (window.appData) this.componentsReady.app = true;
    
    // Monitor for component loading events
    window.addEventListener('uiLoaded', () => {
      this.componentsReady.ui = true;
      this.checkComponentsReady();
    });
    
    window.addEventListener('dataLoaded', () => {
      this.componentsReady.data = true;
      this.checkComponentsReady();
    });
    
    window.addEventListener('configLoaded', () => {
      this.componentsReady.config = true;
      this.checkComponentsReady();
    });
    
    window.addEventListener('appDataLoaded', () => {
      this.componentsReady.app = true;
      this.checkComponentsReady();
    });
    
    // Dispatch events for already loaded components
    if (window.ui) window.dispatchEvent(new Event('uiLoaded'));
    if (window.data) window.dispatchEvent(new Event('dataLoaded'));
    if (window.config) window.dispatchEvent(new Event('configLoaded'));
    if (window.appData) window.dispatchEvent(new Event('appDataLoaded'));
    
    // Check loading status periodically
    setTimeout(() => this.checkComponentsReady(), 1000);
    setTimeout(() => this.checkComponentsReady(), 2000);
    setTimeout(() => this.checkComponentsReady(), 3000);
  },
  
  /**
   * Check if all components are ready
   */
  checkComponentsReady() {
    const allReady = this.componentsReady.ui && 
                     this.componentsReady.data && 
                     this.componentsReady.config && 
                     this.componentsReady.app;
    
    if (allReady) {
      console.log('All components loaded, fixing any remaining issues');
      this.fixRemainingIssues();
      return true;
    }
    
    // Check which components are missing
    const missing = [];
    if (!this.componentsReady.ui) missing.push('UI');
    if (!this.componentsReady.data) missing.push('Data');
    if (!this.componentsReady.config) missing.push('Config');
    if (!this.componentsReady.app) missing.push('App Data');
    
    console.log(`Components still loading: ${missing.join(', ')}`);
    return false;
  },
  
  /**
   * Setup safety timeouts for loading
   */
  setupSafetyTimeouts() {
    // Check loading state after 5 seconds
    setTimeout(() => {
      const initialLoader = document.getElementById('initialLoader');
      const tabContent = document.getElementById('tabContent');
      
      // Hide initial loader if still visible
      if (initialLoader && initialLoader.style.display !== 'none') {
        console.log('Force hiding initial loader');
        initialLoader.style.display = 'none';
      }
      
      // Check if content is still loading
      if (tabContent && tabContent.innerText.includes('Loading')) {
        console.log('Content still loading after 5s, applying emergency content');
        this.forceLoadContent();
      }
    }, 5000);
    
    // Final check after 10 seconds
    setTimeout(() => {
      if (!this.checkComponentsReady()) {
        console.warn('Some components still not loaded after 10s, forcing fixes');
        this.forceLoadComponents();
        this.forceLoadContent();
      }
    }, 10000);
  },
  
  /**
   * Force load missing components
   */
  forceLoadComponents() {
    // Create minimal UI if needed
    if (!window.ui) {
      console.warn('Creating emergency UI object');
      window.ui = {
        switchTab(tabId) {
          console.log(`Emergency tab switch to ${tabId}`);
          const tabContent = document.getElementById('tabContent');
          const tabBtns = document.querySelectorAll('.tab-btn');
          
          // Update active button
          tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
          });
          
          // Show minimal content
          if (tabContent) {
            LoadingSequenceFix.forceLoadContent();
          }
        },
        
        init() {
          console.log('Emergency UI init');
          // Set up tabs
          const tabList = document.getElementById('tabList');
          if (tabList && tabList.children.length === 0) {
            this.setupTabs();
          }
        },
        
        setupTabs() {
          const tabList = document.getElementById('tabList');
          if (!tabList) return;
          
          const tabs = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'teams', label: 'Teams', icon: 'fa-users' },
            { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
            { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
          ];
          
          let html = '';
          tabs.forEach((tab, i) => {
            html += `
              <button class="tab-btn ${i === 0 ? 'active' : ''}" 
                     id="tab-${tab.id}" 
                     data-tab="${tab.id}" 
                     role="tab" 
                     aria-selected="${i === 0 ? 'true' : 'false'}" 
                     aria-controls="panel-${tab.id}">
                <i class="fas ${tab.icon}" aria-hidden="true"></i>
                <span>${tab.label}</span>
              </button>
            `;
          });
          
          tabList.innerHTML = html;
          
          // Add click handlers
          tabList.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const tabId = btn.getAttribute('data-tab');
              this.switchTab(tabId);
            });
          });
        }
      };
      
      // Initialize emergency UI
      window.ui.init();
      
      // Dispatch event
      window.dispatchEvent(new Event('uiLoaded'));
    }
    
    // Create minimal app data if needed
    if (!window.appData) {
      console.warn('Creating emergency app data');
      window.appData = {
        state: {
          isLoggedIn: true,
          currentTab: 'dashboard'
        },
        teams: [
          {
            id: 1,
            name: 'BBV Quality Team',
            stream: 'bbv',
            personnel: [
              { id: 1, name: 'John Smith', role: 'Quality Account Manager' },
              { id: 2, name: 'Jane Doe', role: 'Quality Engineer' }
            ]
          },
          {
            id: 2,
            name: 'ADD Quality Team',
            stream: 'add',
            personnel: [
              { id: 3, name: 'Sarah Johnson', role: 'Quality Account Manager' }
            ]
          },
          {
            id: 3,
            name: 'ARB Quality Team',
            stream: 'arb',
            personnel: [
              { id: 4, name: 'Emily Davis', role: 'Quality Lead' },
              { id: 5, name: 'James Wilson', role: 'Quality Specialist' }
            ]
          }
        ]
      };
      
      // Dispatch event
      window.dispatchEvent(new Event('appDataLoaded'));
    }
  },
  
  /**
   * Watch for loading state
   */
  watchLoadingState() {
    // Watch for tab content changes
    const tabContentObserver = new MutationObserver((mutations) => {
      const tabContent = document.getElementById('tabContent');
      
      if (tabContent && tabContent.innerText.includes('Loading')) {
        // Count consecutive loading states
        this.loadingCount = (this.loadingCount || 0) + 1;
        
        // If stuck in loading for multiple checks, fix it
        if (this.loadingCount > 3) {
          console.log('Tab content stuck in loading state, fixing');
          this.forceLoadContent();
          tabContentObserver.disconnect();
        }
      } else {
        // Reset counter if not loading
        this.loadingCount = 0;
      }
    });
    
    // Start observing
    const tabContent = document.getElementById('tabContent');
    if (tabContent) {
      tabContentObserver.observe(tabContent, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    
    // Safety cleanup
    setTimeout(() => tabContentObserver.disconnect(), 30000);
  },
  
  /**
   * Force load content in case of loading failures
   */
  forceLoadContent() {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    // Check current active tab
    const activeTab = document.querySelector('.tab-btn.active');
    const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
    
    console.log(`Force loading content for tab: ${tabId}`);
    
    // Try multiple methods to load content
    let contentLoaded = false;
    
    // Method 1: Use ui.switchTab if available
    if (window.ui && typeof window.ui.switchTab === 'function') {
      try {
        window.ui.switchTab(tabId);
        contentLoaded = true;
      } catch (e) {
        console.error('Error using ui.switchTab:', e);
      }
    }
    
    // Method 2: Use window.forceSwitchTab if available
    if (!contentLoaded && typeof window.forceSwitchTab === 'function') {
      try {
        window.forceSwitchTab(tabId);
        contentLoaded = true;
      } catch (e) {
        console.error('Error using forceSwitchTab:', e);
      }
    }
    
    // Method 3: Generate emergency content based on tab ID
    if (!contentLoaded) {
      console.log('Generating emergency content');
      
      // Clear any loading indicators
      tabContent.innerHTML = '';
      
      switch (tabId) {
        case 'dashboard':
          this.generateEmergencyDashboard(tabContent);
          break;
        case 'teams':
          this.generateEmergencyTeams(tabContent);
          break;
        case 'personnel':
          this.generateEmergencyPersonnel(tabContent);
          break;
        case 'orgchart':
          this.generateEmergencyOrgChart(tabContent);
          break;
        default:
          tabContent.innerHTML = `
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
              <p class="mb-4">This content is currently unavailable. Please try refreshing the page.</p>
              <button class="px-4 py-2 bg-blue-500 text-white rounded" onclick="location.reload()">
                Refresh Page
              </button>
            </div>
          `;
      }
    }
    
    // Ensure loader is hidden
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) initialLoader.style.display = 'none';
  },
  
  /**
   * Generate emergency dashboard content
   */
  generateEmergencyDashboard(container) {
    container.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white p-4 rounded shadow">
            <h3 class="font-semibold mb-2">BBV Team</h3>
            <p class="text-2xl font-bold">3 members</p>
          </div>
          <div class="bg-white p-4 rounded shadow">
            <h3 class="font-semibold mb-2">ADD Team</h3>
            <p class="text-2xl font-bold">2 members</p>
          </div>
          <div class="bg-white p-4 rounded shadow">
            <h3 class="font-semibold mb-2">ARB Team</h3>
            <p class="text-2xl font-bold">2 members</p>
          </div>
        </div>
        <p class="mb-4">Some dashboard components could not be loaded. Basic information is displayed instead.</p>
        <button class="px-4 py-2 bg-blue-500 text-white rounded" onclick="location.reload()">
          Refresh Page
        </button>
      </div>
    `;
  },
  
  /**
   * Generate emergency teams content
   */
  generateEmergencyTeams(container) {
    // Use appData if available, otherwise use fallback data
    const teams = window.appData && window.appData.teams ? window.appData.teams : [
      { id: 1, name: 'BBV Quality Team', stream: 'bbv', personnel: [{ name: 'John Smith' }, { name: 'Jane Doe' }, { name: 'Michael Brown' }] },
      { id: 2, name: 'ADD Quality Team', stream: 'add', personnel: [{ name: 'Sarah Johnson' }, { name: 'Robert Williams' }] },
      { id: 3, name: 'ARB Quality Team', stream: 'arb', personnel: [{ name: 'Emily Davis' }, { name: 'James Wilson' }] }
    ];
    
    let teamsHtml = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Teams</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    `;
    
    teams.forEach(team => {
      teamsHtml += `
        <div class="bg-white p-5 rounded shadow">
          <h3 class="text-xl font-semibold mb-3">${team.name}</h3>
          <p class="mb-3">Members: ${team.personnel ? team.personnel.length : 0}</p>
          <div class="mt-4">
            <span class="inline-block px-3 py-1 rounded-full text-sm text-white bg-${team.stream || 'gray'}-600">
              ${team.stream ? team.stream.toUpperCase() : 'Other'}
            </span>
          </div>
        </div>
      `;
    });
    
    teamsHtml += `
        </div>
      </div>
    `;
    
    container.innerHTML = teamsHtml;
  },
  
  /**
   * Generate emergency personnel content
   */
  generateEmergencyPersonnel(container) {
    // Build a simple personnel list from appData or fallback data
    const teams = window.appData && window.appData.teams ? window.appData.teams : [
      { id: 1, name: 'BBV Quality Team', stream: 'bbv', personnel: [
        { id: 1, name: 'John Smith', role: 'Quality Account Manager', client: 'Client 1' },
        { id: 2, name: 'Jane Doe', role: 'Quality Engineer', client: 'Client 1' },
        { id: 3, name: 'Michael Brown', role: 'Quality Coordinator', client: 'Client 2' }
      ]},
      { id: 2, name: 'ADD Quality Team', stream: 'add', personnel: [
        { id: 4, name: 'Sarah Johnson', role: 'Quality Account Manager', client: 'Client 3' },
        { id: 5, name: 'Robert Williams', role: 'Document Control Specialist', client: 'Client 3' }
      ]},
      { id: 3, name: 'ARB Quality Team', stream: 'arb', personnel: [
        { id: 6, name: 'Emily Davis', role: 'Quality Lead', client: 'Client 4' },
        { id: 7, name: 'James Wilson', role: 'Quality Specialist', client: 'Client 5' }
      ]}
    ];
    
    // Flatten personnel array from all teams
    let personnel = [];
    teams.forEach(team => {
      if (team.personnel && Array.isArray(team.personnel)) {
        personnel = personnel.concat(team.personnel.map(p => ({
          ...p,
          team: team.name,
          stream: team.stream
        })));
      }
    });
    
    container.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Personnel</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Role</th>
                <th class="px-4 py-2 text-left">Team</th>
                <th class="px-4 py-2 text-left">Client</th>
              </tr>
            </thead>
            <tbody>
              ${personnel.map(person => `
                <tr class="border-t">
                  <td class="px-4 py-2">${person.name || 'Unknown'}</td>
                  <td class="px-4 py-2">${person.role || 'N/A'}</td>
                  <td class="px-4 py-2">${person.team || 'N/A'}</td>
                  <td class="px-4 py-2">${person.client || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
  
  /**
   * Generate emergency org chart
   */
  generateEmergencyOrgChart(container) {
    container.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Organization Chart</h2>
        <p class="mb-4">The interactive organization chart could not be loaded.</p>
        <div class="bg-white p-6 rounded shadow text-center">
          <p class="mb-4">Please try refreshing the page to load the complete chart.</p>
          <button class="px-4 py-2 bg-blue-500 text-white rounded" onclick="location.reload()">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  },
  
  /**
   * Fix remaining issues when all components are loaded
   */
  fixRemainingIssues() {
    // Hide initial loader if still visible
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader && initialLoader.style.display !== 'none') {
      initialLoader.style.display = 'none';
    }
    
    // Check if we're still in a loading state
    const tabContent = document.getElementById('tabContent');
    if (tabContent && tabContent.innerText.includes('Loading')) {
      // Get current active tab
      const activeTab = document.querySelector('.tab-btn.active');
      const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
      
      // Try to force the tab to switch if UI is available
      if (window.ui && typeof window.ui.switchTab === 'function') {
        console.log(`Forcing tab switch to ${tabId}`);
        window.ui.switchTab(tabId);
      } else {
        // Fall back to direct content loading
        this.forceLoadContent();
      }
    }
    
    // Fix tab-related issues
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
      tabButtons.forEach(button => {
        if (!button.hasAttribute('data-tab')) {
          const tabId = button.textContent.trim().toLowerCase();
          button.setAttribute('data-tab', tabId);
        }
        
        // Ensure click handlers are working
        button.addEventListener('click', (e) => {
          const tabId = button.getAttribute('data-tab');
          
          // First try to use UI's switchTab if available
          if (window.ui && typeof window.ui.switchTab === 'function') {
            window.ui.switchTab(tabId);
          } else {
            // Fall back to direct switch
            tabButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Force content update
            const tabContent = document.getElementById('tabContent');
            if (tabContent) {
              this.forceLoadContent();
            }
          }
        });
      });
    }
  }
};

// Initialize when the file loads
if (typeof LoadingSequenceFix !== 'undefined') {
  LoadingSequenceFix.init();
}

// Make it globally accessible
window.LoadingSequenceFix = LoadingSequenceFix;

console.log('Loading sequence fix loaded'); 