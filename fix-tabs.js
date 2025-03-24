// EMERGENCY TAB FIX
// This script runs immediately with no dependencies to fix missing tabs and loading issues
console.log('EMERGENCY TAB FIX: Running immediate tab fix');

(function() {
  // Skip if we already applied the fix
  if (window.tabFixApplied) return;
  window.tabFixApplied = true;

  // Ensure we have the core styles needed for tabs
  function addEmergencyStyles() {
    // Only add if not already present
    if (document.getElementById('emergency-tab-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'emergency-tab-styles';
    style.textContent = `
      .tab-btn {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 1rem;
        border-bottom: 2px solid transparent;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
      }
      .tab-btn.active {
        border-bottom-color: #3b82f6;
        color: #3b82f6;
      }
      .tab-btn:hover:not(.active) {
        color: #4b5563;
      }
      .tab-btn i {
        margin-right: 0.5rem;
      }
    `;
    document.head.appendChild(style);
    console.log('EMERGENCY TAB FIX: Added emergency styles');
  }

  // Hide the loader to prevent blocking UI
  function hideLoader() {
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
      console.log('EMERGENCY TAB FIX: Hid initial loader');
    }
  }

  // Create basic tabs directly in the DOM
  function createBasicTabs() {
    const tabList = document.getElementById('tabList');
    
    // Only proceed if tabList exists and has no children
    if (!tabList || tabList.children.length > 0) return;
    
    console.log('EMERGENCY TAB FIX: Creating basic tabs');
    
    // Define essential tabs - use config.tabs if available, otherwise use defaults
    const tabs = window.config && Array.isArray(window.config.tabs) ? 
      window.config.tabs : 
      [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'teams', label: 'Teams', icon: 'fa-users' },
        { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
        { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
      ];
    
    // Create and append tabs in a single operation
    const tabElements = document.createDocumentFragment();
    
    tabs.forEach((tab, index) => {
      const button = document.createElement('button');
      button.className = `tab-btn ${index === 0 ? 'active' : ''}`;
      button.id = `tab-${tab.id}`;
      button.setAttribute('data-tab', tab.id);
      button.setAttribute('data-index', index);
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('aria-controls', `panel-${tab.id}`);
      
      // Set content with optimized innerHTML (fewer operations)
      button.innerHTML = `<i class="fas ${tab.icon}" aria-hidden="true"></i><span>${tab.label}</span>`;
      
      // Add click handler directly
      button.addEventListener('click', () => switchToTab(tab.id, button));
      
      tabElements.appendChild(button);
    });
    
    // Single DOM operation to append all tabs
    tabList.appendChild(tabElements);
    
    console.log('EMERGENCY TAB FIX: Tab creation complete');
  }
  
  // Switch to a specific tab
  function switchToTab(tabId, clickedButton) {
    const tabList = document.getElementById('tabList');
    
    // Update active state on all buttons
    if (tabList) {
      tabList.querySelectorAll('.tab-btn').forEach(btn => {
        const isActive = clickedButton ? btn === clickedButton : btn.getAttribute('data-tab') === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
    
    // Try all available methods to switch tabs in priority order
    let succeeded = false;
    
    // 1. Try using ui.switchTab first
    if (window.ui && typeof window.ui.switchTab === 'function') {
      try {
        window.ui.switchTab(tabId);
        succeeded = true;
      } catch (e) {
        console.error('Error using ui.switchTab:', e);
      }
    }
    
    // 2. Try using forceSwitchTab if available and ui.switchTab failed
    if (!succeeded && window.forceSwitchTab) {
      try {
        window.forceSwitchTab(tabId);
        succeeded = true;
      } catch (e) {
        console.error('Error using forceSwitchTab:', e);
      }
    }
    
    // 3. Try using masterFix.forceTabContent if available and previous methods failed
    if (!succeeded && window.masterFix && typeof window.masterFix.forceTabContent === 'function') {
      try {
        window.masterFix.forceTabContent(tabId);
        succeeded = true;
      } catch (e) {
        console.error('Error using masterFix.forceTabContent:', e);
      }
    }
    
    // 4. As a last resort, use our own emergency content
    if (!succeeded) {
      showEmergencyContent(tabId);
    }
  }

  // Show emergency content for a tab
  function showEmergencyContent(tabId) {
    console.log('EMERGENCY TAB FIX: Showing emergency content for', tabId);
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    // Set loading false data attribute
    tabContent.dataset.loading = 'false';
    
    // Generate content based on tab ID
    let content = '';
    
    switch (tabId) {
      case 'dashboard':
        content = createEmergencyDashboard();
        break;
      case 'teams':
        content = createEmergencyTeams();
        break;
      case 'personnel':
        content = createEmergencyPersonnel();
        break;
      default:
        content = `
          <div class="p-4">
            <h2 class="text-2xl font-bold mb-6">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700">
                    Emergency content shown due to loading issues. Some features may be limited.
                  </p>
                </div>
              </div>
            </div>
            <div class="flex justify-center mt-8">
              <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded">
                <i class="fas fa-sync-alt mr-2"></i> Reload Page
              </button>
            </div>
          </div>
        `;
    }
    
    // Set content in a single operation
    tabContent.innerHTML = content;
  }
  
  // Create emergency dashboard content
  function createEmergencyDashboard() {
    // Get team data if available
    const teams = window.appData?.teams || [];
    const teamCount = teams.length;
    
    // Calculate personnel count
    let personnelCount = 0;
    teams.forEach(team => {
      if (team.personnel && Array.isArray(team.personnel)) {
        personnelCount += team.personnel.length;
      }
    });
    
    return `
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Emergency content shown due to loading issues. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-4 rounded shadow">
            <div class="text-sm text-gray-500">Total Teams</div>
            <div class="text-2xl font-bold">${teamCount}</div>
          </div>
          <div class="bg-white p-4 rounded shadow">
            <div class="text-sm text-gray-500">Total Personnel</div>
            <div class="text-2xl font-bold">${personnelCount}</div>
          </div>
        </div>
        <div class="flex justify-center mt-8">
          <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded">
            <i class="fas fa-sync-alt mr-2"></i> Reload Page
          </button>
        </div>
      </div>
    `;
  }
  
  // Create emergency teams content
  function createEmergencyTeams() {
    // Get team data if available
    const teams = window.appData?.teams || [];
    
    let teamsHTML = '';
    if (teams.length > 0) {
      teamsHTML = teams.map(team => `
        <div class="bg-white p-4 rounded shadow mb-4">
          <h3 class="font-bold text-lg">${team.name || 'Unnamed Team'}</h3>
          <div class="text-sm text-gray-500 mb-2">${team.stream?.toUpperCase() || 'Unknown'} Stream</div>
          <p class="mb-2">${team.description || 'No description available'}</p>
          <div class="text-sm">Personnel: ${team.personnel?.length || 0}</div>
        </div>
      `).join('');
    } else {
      teamsHTML = `
        <div class="bg-white p-4 rounded shadow mb-4">
          <p>No teams available.</p>
        </div>
      `;
    }
    
    return `
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-6">Teams</h2>
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Emergency content shown due to loading issues. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
        ${teamsHTML}
        <div class="flex justify-center mt-8">
          <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded">
            <i class="fas fa-sync-alt mr-2"></i> Reload Page
          </button>
        </div>
      </div>
    `;
  }
  
  // Create emergency personnel content
  function createEmergencyPersonnel() {
    // Get team data if available
    const teams = window.appData?.teams || [];
    
    // Collect all personnel from all teams
    let allPersonnel = [];
    teams.forEach(team => {
      if (team.personnel && Array.isArray(team.personnel)) {
        // Add team name to each person
        allPersonnel = allPersonnel.concat(team.personnel.map(person => ({
          ...person,
          teamName: team.name || 'Unknown Team'
        })));
      }
    });
    
    let personnelHTML = '';
    if (allPersonnel.length > 0) {
      personnelHTML = `
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Team</th>
                <th>Client</th>
              </tr>
            </thead>
            <tbody>
              ${allPersonnel.map(person => `
                <tr>
                  <td>${person.name || 'Unnamed'}</td>
                  <td>${person.role || 'No role'}</td>
                  <td>${person.teamName}</td>
                  <td>${person.client || 'No client'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      personnelHTML = `
        <div class="bg-white p-4 rounded shadow mb-4">
          <p>No personnel available.</p>
        </div>
      `;
    }
    
    return `
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-6">Personnel</h2>
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Emergency content shown due to loading issues. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
        ${personnelHTML}
        <div class="flex justify-center mt-8">
          <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded">
            <i class="fas fa-sync-alt mr-2"></i> Reload Page
          </button>
        </div>
      </div>
    `;
  }

  // Show initial content (dashboard tab)
  function showInitialContent() {
    // Only show initial content if tabContent is empty or still loading
    const tabContent = document.getElementById('tabContent');
    if (!tabContent || tabContent.children.length > 0) return;
    
    // Switch to dashboard tab or first available tab
    const dashboardTab = document.getElementById('tab-dashboard');
    if (dashboardTab) {
      switchToTab('dashboard', dashboardTab);
    } else {
      const firstTab = document.querySelector('.tab-btn');
      if (firstTab) {
        const tabId = firstTab.getAttribute('data-tab');
        switchToTab(tabId, firstTab);
      }
    }
  }

  // Register global rescue function
  window.forceSwitchTab = function(tabId) {
    switchToTab(tabId);
  };

  // Apply all emergency fixes
  function applyEmergencyFixes() {
    // Add styles first
    addEmergencyStyles();
    
    // Hide loader to prevent blocking the UI
    hideLoader();
    
    // Create tabs if needed
    createBasicTabs();
    
    // Show initial content (dashboard)
    showInitialContent();
    
    console.log('EMERGENCY TAB FIX: All fixes applied');
  }
  
  // Run immediately
  applyEmergencyFixes();
  
  // Also run after DOM content loaded in case the script runs before DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyEmergencyFixes);
  }
  
  // Set a timeout as a last resort if neither runs successfully
  setTimeout(applyEmergencyFixes, 2000);
})();

// Direct fix for tab initialization
console.log('Loading fix-tabs.js to ensure proper tab initialization');

/**
 * Function to ensure all tabs are properly initialized.
 * This is a fallback in case the main tab initialization fails.
 */
function ensureAllTabs() {
  console.log('EMERGENCY TAB FIX: Ensuring all tabs are present and functional');
  
  const tabList = document.getElementById('tabList');
  if (!tabList) {
    console.error('EMERGENCY TAB FIX: Tab list element not found');
    return;
  }
  
  // Required tabs with fallback config
  const requiredTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'teams', label: 'Teams', icon: 'fa-users' },
    { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
    { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' },
    { id: 'planning', label: 'Planning', icon: 'fa-project-diagram' },
    { id: 'orgchart', label: 'Org Chart', icon: 'fa-sitemap' },
    { id: 'rolematrix', label: 'Role Matrix', icon: 'fa-th' },
    { id: 'skillsmatrix', label: 'Skills Matrix', icon: 'fa-cubes' },
    { id: 'racimatrix', label: 'RACI Matrix', icon: 'fa-list-alt' }
  ];
  
  // Get config tabs if available
  const configTabs = window.config && Array.isArray(window.config.tabs) ? window.config.tabs : requiredTabs;
  
  // Check which tabs are missing
  const existingTabs = Array.from(tabList.querySelectorAll('.tab-btn')).map(btn => btn.getAttribute('data-tab'));
  const missingTabs = configTabs.filter(tab => !existingTabs.includes(tab.id));
  
  if (missingTabs.length === 0) {
    console.log('EMERGENCY TAB FIX: All tabs present');
    
    // Check if tabs are properly setup with event listeners
    const tabButtons = tabList.querySelectorAll('.tab-btn');
    let eventListenersNeeded = false;
    
    // Sample a few buttons to check for event listeners
    Array.from(tabButtons).slice(0, 3).forEach(btn => {
      const events = getEventListeners(btn);
      if (!events || !events.click || events.click.length === 0) {
        eventListenersNeeded = true;
      }
    });
    
    if (eventListenersNeeded) {
      console.log('EMERGENCY TAB FIX: Re-attaching event listeners to tabs');
      attachTabEventListeners();
    }
    
    return;
  }
  
  console.log(`EMERGENCY TAB FIX: Found ${missingTabs.length} missing tabs. Adding them now.`);
  
  // Add the missing tabs
  const fragment = document.createDocumentFragment();
  
  missingTabs.forEach(tab => {
    const button = document.createElement('button');
    button.className = 'tab-btn';
    button.id = `tab-${tab.id}`;
    button.setAttribute('data-tab', tab.id);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', 'false');
    button.setAttribute('aria-controls', `panel-${tab.id}`);
    
    button.innerHTML = `<i class="fas ${tab.icon}" aria-hidden="true"></i><span>${tab.label}</span>`;
    
    // Add click handler directly
    button.addEventListener('click', () => switchToTab(tab.id, button));
    
    fragment.appendChild(button);
  });
  
  // Append all missing tabs in one DOM operation
  tabList.appendChild(fragment);
  
  // Re-check the order and reorder if necessary
  reorderTabs(configTabs);
  
  console.log('EMERGENCY TAB FIX: Missing tabs have been added');
}

/**
 * Reorder tabs to match configuration order
 */
function reorderTabs(configTabs) {
  const tabList = document.getElementById('tabList');
  if (!tabList) return;
  
  // Get all tab buttons
  const tabs = Array.from(tabList.querySelectorAll('.tab-btn'));
  
  // Create a new document fragment to hold the reordered tabs
  const fragment = document.createDocumentFragment();
  
  // Add tabs in the order specified in configTabs
  configTabs.forEach(configTab => {
    const tab = tabs.find(t => t.getAttribute('data-tab') === configTab.id);
    if (tab) {
      // Clone the tab to avoid issues with removing it from the DOM
      const clonedTab = tab.cloneNode(true);
      
      // Re-attach event listener
      clonedTab.addEventListener('click', () => switchToTab(configTab.id, clonedTab));
      
      fragment.appendChild(clonedTab);
    }
  });
  
  // Clear the tab list and append the reordered tabs
  if (fragment.childNodes.length > 0) {
    tabList.innerHTML = '';
    tabList.appendChild(fragment);
    console.log('EMERGENCY TAB FIX: Tabs reordered successfully');
  }
}

/**
 * Attach event listeners to all tabs
 */
function attachTabEventListeners() {
  const tabList = document.getElementById('tabList');
  if (!tabList) return;
  
  const tabButtons = tabList.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    // Remove existing event listeners (if any)
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    // Add event listener
    const tabId = newBtn.getAttribute('data-tab');
    newBtn.addEventListener('click', () => switchToTab(tabId, newBtn));
  });
  
  console.log('EMERGENCY TAB FIX: Event listeners attached to all tabs');
}

/**
 * Get event listeners for an element or return undefined if not available
 */
function getEventListeners(element) {
  // This is just a helper function that tries to detect if event listeners exist
  // In browsers, we can't reliably check for event listeners, so we make an educated guess
  if (!element) return undefined;
  
  // Check if the element has the onclick property set
  if (element.onclick) {
    return { click: [{ listener: element.onclick }] };
  }
  
  // In a real environment with Chrome DevTools, we would use getEventListeners(element)
  // But that's not available in regular browser environments
  return undefined;
}

// Enhance tab content with client filtering for teams
function enhanceTeamContent() {
  // Only run if we're on the teams tab
  const activeTab = document.querySelector('.tab-btn.active');
  if (!activeTab || activeTab.getAttribute('data-tab') !== 'teams') return;
  
  const tabContent = document.getElementById('tabContent');
  if (!tabContent) return;
  
  // Check if we already enhanced this content
  if (tabContent.getAttribute('data-enhanced') === 'true') return;
  
  // Add client filter controls
  const teamHeader = tabContent.querySelector('h2');
  if (teamHeader) {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'client-filter mt-4 mb-6';
    filterContainer.innerHTML = `
      <label class="mr-2 font-medium">Filter by Client:</label>
      <select id="clientFilter" class="border rounded px-2 py-1">
        <option value="all">All Clients</option>
        <option value="Client 1">Client 1</option>
        <option value="Client 2">Client 2</option>
        <option value="Client 3">Client 3</option>
        <option value="Client 4">Client 4</option>
        <option value="Client 5">Client 5</option>
      </select>
    `;
    teamHeader.parentNode.insertBefore(filterContainer, teamHeader.nextSibling);
    
    // Add event listener to filter
    const selectFilter = filterContainer.querySelector('#clientFilter');
    if (selectFilter) {
      selectFilter.addEventListener('change', function() {
        filterTeamsByClient(this.value);
      });
    }
  }
  
  // Mark as enhanced
  tabContent.setAttribute('data-enhanced', 'true');
}

// Filter teams by client
function filterTeamsByClient(clientName) {
  if (!clientName) return;
  
  const teams = document.querySelectorAll('.team-card');
  teams.forEach(team => {
    if (clientName === 'all') {
      team.style.display = '';
      return;
    }
    
    const clientInfo = team.getAttribute('data-clients') || '';
    if (clientInfo.includes(clientName)) {
      team.style.display = '';
    } else {
      team.style.display = 'none';
    }
  });
}

// Add to the window object for external access
window.emergencyTabFunctions = {
  ensureAllTabs,
  switchToTab,
  enhanceTeamContent,
  filterTeamsByClient
};

// Run the fixes immediately
console.log('EMERGENCY TAB FIX: Running final fixes');
ensureAllTabs();

// Set up a timer to verify tabs every 5 seconds
setInterval(ensureAllTabs, 5000);

// Set up MutationObserver to watch for tab content changes and enhance when needed
const tabContentObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      // Check if teams tab is active
      const activeTab = document.querySelector('.tab-btn.active');
      if (activeTab && activeTab.getAttribute('data-tab') === 'teams') {
        enhanceTeamContent();
      }
    }
  });
});

// Start observing tab content changes
const tabContent = document.getElementById('tabContent');
if (tabContent) {
  tabContentObserver.observe(tabContent, { childList: true, subtree: true });
}

// Force check and fix tabs after a delay to ensure DOM is ready
setTimeout(ensureAllTabs, 1000);
setTimeout(ensureAllTabs, 3000);

// Export a success message
console.log('Fix-tabs.js loaded successfully'); 