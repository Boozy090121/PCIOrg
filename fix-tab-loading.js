// Tab Loading Fix Script
console.log('Loading tab fix script...');

// Initialize immediately to ensure tabs work
(function() {
  console.log('Tab fix script initializing immediately');
  
  // Check if tabs exist or are broken
  const tabList = document.getElementById('tabList');
  if (!tabList || tabList.children.length === 0) {
    console.warn('Tab list missing or empty - creating essential tabs');
    createEssentialTabs();
  }
  
  // Monitor DOM for issues
  startTabMonitoring();
  
  // Register emergency handlers
  registerEmergencyHandlers();
})();

// Create essential tabs if missing
function createEssentialTabs() {
  const tabList = document.getElementById('tabList');
  if (!tabList) {
    console.error('Tab list element not found, cannot create tabs');
    return;
  }
  
  // Create tabs based on config if available
  const tabConfig = window.config && window.config.tabs ? 
    window.config.tabs : 
    [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
      { id: 'teams', label: 'Teams', icon: 'fa-users' },
      { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
      { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
    ];
  
  // Create the tab buttons
  tabList.innerHTML = tabConfig.map((tab, index) => `
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
  
  // Add event handlers to the tabs
  attachTabHandlers();
  
  console.log('Essential tabs created');
}

// Attach click handlers to tab buttons
function attachTabHandlers() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    // Skip if already has click handler
    if (button.dataset.handlerAttached) return;
    
    button.dataset.handlerAttached = 'true';
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Update active state on all buttons
      tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn === button);
        btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
      });
      
      // Try switching tab using UI method first
      if (window.ui && typeof window.ui.switchTab === 'function') {
        window.ui.switchTab(tabId);
      } else {
        // Fall back to direct tab switching
        forceTabSwitch(tabId);
      }
    });
  });
}

// Force tab content to display if UI method fails
function forceTabSwitch(tabId) {
  console.log('Force switching to tab:', tabId);
  
  // Force clear all content containers first
  if (typeof window.forceResetAllContent === 'function') {
    window.forceResetAllContent();
  }
  
  const tabContent = document.getElementById('tabContent');
  if (!tabContent) {
    console.error('Tab content element not found');
    
    // Try to create the tab content container as a last resort
    if (typeof window.ensureTabContentExists === 'function') {
      tabContent = window.ensureTabContentExists();
    }
    
    if (!tabContent) {
      return; // Still no tab content container
    }
  }
  
  // Clear tab content one more time to be sure
  while (tabContent.firstChild) {
    tabContent.removeChild(tabContent.firstChild);
  }
  
  // Show loading indicator first
  tabContent.innerHTML = `
    <div class="flex justify-center items-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p class="ml-4 text-gray-500">Loading ${tabId} content...</p>
    </div>
  `;
  
  // Then try to load the content
  setTimeout(() => {
    // Check if content is still loading
    if (tabContent.innerText.includes('Loading')) {
      console.warn(`Force loading content for tab: ${tabId}`);
      
      // Force clear content again before generating new content
      if (typeof window.forceResetAllContent === 'function') {
        window.forceResetAllContent();
        
        // Get a fresh reference to tabContent
        const freshTabContent = document.getElementById('tabContent');
        if (freshTabContent) {
          // Generate minimal content for the tab
          switch(tabId) {
            case 'dashboard':
              generateDashboardContent(freshTabContent);
              break;
            case 'teams':
              generateTeamsContent(freshTabContent);
              break;
            case 'personnel':
              generatePersonnelContent(freshTabContent);
              break;
            case 'documentation':
              generateDocumentationContent(freshTabContent);
              break;
            default:
              freshTabContent.innerHTML = `
                <div class="p-4">
                  <h2 class="text-xl font-semibold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
                  <p>Content for ${tabId} tab</p>
                </div>
              `;
          }
        }
      } else {
        // Clear all content one more time
        while (tabContent.firstChild) {
          tabContent.removeChild(tabContent.firstChild);
        }
        
        // Generate minimal content for the tab
        switch(tabId) {
          case 'dashboard':
            generateDashboardContent(tabContent);
            break;
          case 'teams':
            generateTeamsContent(tabContent);
            break;
          case 'personnel':
            generatePersonnelContent(tabContent);
            break;
          case 'documentation':
            generateDocumentationContent(tabContent);
            break;
          default:
            tabContent.innerHTML = `
              <div class="p-4">
                <h2 class="text-xl font-semibold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
                <p>Content for ${tabId} tab</p>
              </div>
            `;
        }
      }
    }
  }, 500);
}

// Generate content for different tabs if UI methods fail
function generateDashboardContent(tabContent) {
  tabContent.innerHTML = `
    <div class="p-4">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p class="text-yellow-700">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Using fallback dashboard content due to loading issues.
        </p>
      </div>
      
      <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500">Total Teams</div>
          <div class="text-2xl font-bold">3</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500">Total Personnel</div>
          <div class="text-2xl font-bold">7</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500">BBV Team Members</div>
          <div class="text-2xl font-bold">3</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500">ADD Team Members</div>
          <div class="text-2xl font-bold">2</div>
        </div>
      </div>
    </div>
  `;
}

function generateTeamsContent(tabContent) {
  tabContent.innerHTML = `
    <div class="p-4">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p class="text-yellow-700">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Using fallback teams content due to loading issues.
        </p>
      </div>
      
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Teams</h2>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center">
          <i class="fas fa-plus mr-2"></i> Add Team
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm hover:shadow transition-all p-4 border border-gray-200">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white bg-blue-600">
              Q
            </div>
            <div>
              <h3 class="font-semibold">Quality Control Team</h3>
              <p class="text-xs text-gray-500">BBV • 3 members</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-4">Responsible for ensuring product quality standards</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm hover:shadow transition-all p-4 border border-gray-200">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white bg-red-600">
              V
            </div>
            <div>
              <h3 class="font-semibold">Validation Team</h3>
              <p class="text-xs text-gray-500">ADD • 2 members</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-4">Handles validation of processes and systems</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm hover:shadow transition-all p-4 border border-gray-200">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white bg-purple-600">
              R
            </div>
            <div>
              <h3 class="font-semibold">Regulatory Affairs</h3>
              <p class="text-xs text-gray-500">ARB • 2 members</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-4">Handles regulatory compliance and submissions</p>
        </div>
      </div>
    </div>
  `;
}

function generatePersonnelContent(tabContent) {
  tabContent.innerHTML = `
    <div class="p-4">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p class="text-yellow-700">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Using fallback personnel content due to loading issues.
        </p>
      </div>
      
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Personnel</h2>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center">
          <i class="fas fa-plus mr-2"></i> Add Person
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">John Smith</td>
              <td class="px-6 py-4 whitespace-nowrap">Quality Manager</td>
              <td class="px-6 py-4 whitespace-nowrap">Quality Control Team</td>
              <td class="px-6 py-4 whitespace-nowrap">Pfizer</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">Sarah Johnson</td>
              <td class="px-6 py-4 whitespace-nowrap">Quality Engineer</td>
              <td class="px-6 py-4 whitespace-nowrap">Quality Control Team</td>
              <td class="px-6 py-4 whitespace-nowrap">Merck</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">Michael Brown</td>
              <td class="px-6 py-4 whitespace-nowrap">Validation Lead</td>
              <td class="px-6 py-4 whitespace-nowrap">Validation Team</td>
              <td class="px-6 py-4 whitespace-nowrap">J&J</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function generateDocumentationContent(tabContent) {
  tabContent.innerHTML = `
    <div class="p-4">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p class="text-yellow-700">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Using fallback documentation content due to loading issues.
        </p>
      </div>
      
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Documentation</h2>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center">
          <i class="fas fa-plus mr-2"></i> Add Document
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm hover:shadow transition-all p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold">Quality Manual</h3>
              <p class="text-sm text-gray-600">Manual</p>
            </div>
            <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">Primary document describing the quality management system</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm hover:shadow transition-all p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold">Change Control SOP</h3>
              <p class="text-sm text-gray-600">Procedure</p>
            </div>
            <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Review</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">Standard operating procedure for managing change control</p>
        </div>
      </div>
    </div>
  `;
}

// Monitor for tab loading issues
function startTabMonitoring() {
  console.log('Starting tab monitoring');
  
  // Check tabs periodically to ensure they're working
  setInterval(checkTabs, 3000);
  
  // Also check when visibility changes
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      checkTabs();
    }
  });
}

// Check if tabs are working properly
function checkTabs() {
  const tabList = document.getElementById('tabList');
  if (!tabList || tabList.children.length === 0) {
    console.warn('Tab list missing or empty during monitoring check - fixing');
    createEssentialTabs();
    return;
  }
  
  // Make sure handlers are attached
  const tabButtons = tabList.querySelectorAll('.tab-btn');
  if (tabButtons.length > 0) {
    attachTabHandlers();
  }
  
  // Check if tab content is stuck loading
  const tabContent = document.getElementById('tabContent');
  if (tabContent && tabContent.innerText.includes('Loading') && !tabContent.dataset.loadingTimeout) {
    // Set a timeout to fix stuck loading
    tabContent.dataset.loadingTimeout = 'true';
    
    setTimeout(() => {
      delete tabContent.dataset.loadingTimeout;
      
      // If still loading, try to fix
      if (tabContent.innerText.includes('Loading')) {
        console.warn('Tab content stuck in loading state - forcing content');
        
        // Get the active tab
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
          const tabId = activeTab.getAttribute('data-tab');
          forceTabSwitch(tabId);
        } else {
          // Default to dashboard if no active tab
          forceTabSwitch('dashboard');
        }
      }
    }, 5000);
  }
}

// Register emergency handlers and global fix functions
function registerEmergencyHandlers() {
  // Expose global tab switching function
  window.forceSwitchTab = forceTabSwitch;
  
  // Add emergency keyboard shortcut (Ctrl+Alt+T) to force tab creation
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key === 't') {
      console.log('Emergency tab shortcut activated');
      createEssentialTabs();
    }
  });
}

// Initialize after DOM loads to ensure UI is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Tab fix script activated on DOMContentLoaded');
  
  // Always check tabs for issues
  setTimeout(checkTabs, 1000);
  
  // Check tabs again after UI initialization should have completed
  setTimeout(checkTabs, 3000);
});

// Ensure initial loader is hidden 
window.addEventListener('load', function() {
  const initialLoader = document.getElementById('initialLoader');
  if (initialLoader) {
    setTimeout(() => {
      console.log('Hiding initial loader from tab fix script');
      initialLoader.style.display = 'none';
    }, 1000);
  }
});

console.log('Tab fix script loaded successfully'); 