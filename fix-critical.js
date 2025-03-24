/**
 * Critical Fix Script
 * This script provides emergency functionality for critical errors
 */

console.log('Critical fix script loaded');

// Create global namespace for critical fixes
window.criticalFix = {
  // Track whether fixes have been applied
  fixesApplied: false,
  
  // Main entry point for fixes
  applyFixes: function() {
    console.log('Applying critical fixes');
    
    if (this.fixesApplied) {
      console.log('Critical fixes already applied, skipping');
      return;
    }
    
    // Hide loader if it's still visible
    this.hideLoader();
    
    // Fix cross-origin script issues
    this.fixCrossOriginScripts();
    
    // Make sure tabs are working
    this.fixTabFunctionality();
    
    // Force content display
    this.forceContentDisplay();
    
    // Register as emergency UI
    window.emergencyUI = this;
    
    this.fixesApplied = true;
    console.log('Critical fixes applied');
  },
  
  // Hide initial loader
  hideLoader: function() {
    const loader = document.getElementById('initialLoader');
    if (loader) {
      loader.style.display = 'none';
      console.log('Loader hidden by critical fix');
    }
  },
  
  // Fix cross-origin script issues
  fixCrossOriginScripts: function() {
    console.log('Fixing cross-origin scripts');
    
    // Find all external scripts
    const externalScripts = document.querySelectorAll('script[src^="http"], script[src^="//"]');
    let fixedCount = 0;
    
    externalScripts.forEach(script => {
      if (!script.hasAttribute('crossorigin')) {
        // Create new script with crossorigin attribute
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.crossOrigin = 'anonymous';
        
        // Copy other attributes
        Array.from(script.attributes).forEach(attr => {
          if (attr.name !== 'src' && attr.name !== 'crossorigin') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });
        
        // Replace script
        if (script.parentNode) {
          script.parentNode.replaceChild(newScript, script);
          fixedCount++;
        }
      }
    });
    
    // Also fix external stylesheets
    const externalStyles = document.querySelectorAll('link[rel="stylesheet"][href^="http"], link[rel="stylesheet"][href^="//"]');
    externalStyles.forEach(link => {
      if (!link.hasAttribute('crossorigin')) {
        const newLink = document.createElement('link');
        newLink.href = link.href;
        newLink.rel = 'stylesheet';
        newLink.crossOrigin = 'anonymous';
        
        // Copy other attributes
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'href' && attr.name !== 'rel' && attr.name !== 'crossorigin') {
            newLink.setAttribute(attr.name, attr.value);
          }
        });
        
        // Replace link
        if (link.parentNode) {
          link.parentNode.replaceChild(newLink, link);
          fixedCount++;
        }
      }
    });
    
    console.log(`Fixed ${fixedCount} cross-origin resources`);
  },
  
  // Fix tab functionality
  fixTabFunctionality: function() {
    console.log('Fixing tab functionality');
    
    // Create tabs if they don't exist
    const tabList = document.getElementById('tabList');
    if (!tabList || tabList.children.length === 0) {
      this.createEmergencyTabs();
    }
    
    // Add event listeners to tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      if (!tab._hasClickListener) {
        const tabId = tab.getAttribute('data-tab');
        tab.addEventListener('click', () => {
          // Update active state
          tabs.forEach(t => {
            t.classList.toggle('active', t === tab);
          });
          
          // Switch to tab
          this.switchToTab(tabId);
        });
        tab._hasClickListener = true;
      }
    });
  },
  
  // Create emergency tabs
  createEmergencyTabs: function() {
    console.log('Creating emergency tabs');
    
    const tabList = document.getElementById('tabList');
    if (!tabList) return;
    
    // Basic tabs
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
      { id: 'teams', label: 'Teams', icon: 'fa-users' },
      { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
      { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' }
    ];
    
    // Create tab HTML
    let tabsHTML = '';
    tabs.forEach((tab, index) => {
      tabsHTML += `
        <button class="tab-btn ${index === 0 ? 'active' : ''}" 
             id="tab-${tab.id}" 
             data-tab="${tab.id}">
          <i class="fas ${tab.icon}"></i>
          <span>${tab.label}</span>
        </button>
      `;
    });
    
    tabList.innerHTML = tabsHTML;
    console.log('Emergency tabs created');
  },
  
  // Force content display
  forceContentDisplay: function() {
    console.log('Forcing content display');
    
    // Get active tab
    const activeTab = document.querySelector('.tab-btn.active');
    const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
    
    // Switch to that tab
    this.switchToTab(tabId);
  },
  
  // Switch to tab
  switchToTab: function(tabId) {
    console.log(`Switching to tab: ${tabId}`);
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });
    
    // Get tab content element
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    // Show emergency content
    this.showEmergencyTabContent(tabId, tabContent);
  },
  
  // Show emergency tab content
  showEmergencyTabContent: function(tabId, tabContent) {
    if (!tabContent) {
      tabContent = document.getElementById('tabContent');
      if (!tabContent) return;
    }
    
    // Call normal UI method if available
    if (window.ui && typeof window.ui.loadTab === 'function' && tabId !== 'dashboard') {
      try {
        window.ui.loadTab(tabId);
        return;
      } catch (error) {
        console.error(`Error loading tab ${tabId} with UI method:`, error);
      }
    }
    
    // Emergency content based on tab
    switch (tabId) {
      case 'dashboard':
        this.showDashboard(tabContent);
        break;
      case 'teams':
        this.showTeams(tabContent);
        break;
      case 'personnel':
        this.showPersonnel(tabContent);
        break;
      case 'documentation':
        this.showDocumentation(tabContent);
        break;
      default:
        // Generic content
        tabContent.innerHTML = `
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-4">${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p class="text-yellow-700">Emergency mode active. Limited functionality available.</p>
            </div>
            <p>Content for ${tabId}</p>
          </div>
        `;
    }
  },
  
  // Show dashboard content
  showDashboard: function(tabContent) {
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Application is in recovery mode. Some features may be limited.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">BBV Team</h3>
            <p class="text-gray-600 mb-3">Focus Factory: BBV</p>
            <div class="flex items-center">
              <div class="text-blue-500 mr-2"><i class="fas fa-users"></i></div>
              <div class="text-lg font-bold">3 Members</div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">ADD Team</h3>
            <p class="text-gray-600 mb-3">Focus Factory: ADD</p>
            <div class="flex items-center">
              <div class="text-red-500 mr-2"><i class="fas fa-users"></i></div>
              <div class="text-lg font-bold">2 Members</div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">ARB Team</h3>
            <p class="text-gray-600 mb-3">Focus Factory: ARB</p>
            <div class="flex items-center">
              <div class="text-indigo-500 mr-2"><i class="fas fa-users"></i></div>
              <div class="text-lg font-bold">2 Members</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">Org Overview</h3>
          <p class="mb-4">Quality Department reorganization is underway. This application provides tools to support the restructuring of the organization across multiple streams.</p>
          <div class="flex justify-end">
            <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
        </div>
        
        <div class="text-center mt-8">
          <button onclick="location.reload()" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4">
            <i class="fas fa-sync-alt mr-2"></i> Refresh Page
          </button>
          <button onclick="window.criticalFix.applyFixes()" class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            <i class="fas fa-wrench mr-2"></i> Apply Fixes Again
          </button>
        </div>
      </div>
    `;
  },
  
  // Show teams content
  showTeams: function(tabContent) {
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Teams</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Limited functionality available in recovery mode.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">BBV Quality Team</h3>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">BBV</span>
            </div>
            <p class="text-gray-600 mb-4">Quality team supporting BBV product line</p>
            <div class="mb-4">
              <div class="text-sm text-gray-500 mb-1">Members:</div>
              <ul class="pl-5 list-disc">
                <li>John Smith (Quality Account Manager)</li>
                <li>Jane Doe (Quality Engineer)</li>
                <li>Michael Brown (Quality Coordinator)</li>
              </ul>
            </div>
            <div class="flex justify-end">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Details
              </button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">ADD Quality Team</h3>
              <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">ADD</span>
            </div>
            <p class="text-gray-600 mb-4">Quality team supporting ADD product line</p>
            <div class="mb-4">
              <div class="text-sm text-gray-500 mb-1">Members:</div>
              <ul class="pl-5 list-disc">
                <li>Sarah Johnson (Quality Account Manager)</li>
                <li>Robert Williams (Document Control Specialist)</li>
              </ul>
            </div>
            <div class="flex justify-end">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Details
              </button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">ARB Quality Team</h3>
              <span class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">ARB</span>
            </div>
            <p class="text-gray-600 mb-4">Quality team supporting ARB product line</p>
            <div class="mb-4">
              <div class="text-sm text-gray-500 mb-1">Members:</div>
              <ul class="pl-5 list-disc">
                <li>Emily Davis (Quality Lead)</li>
                <li>James Wilson (Quality Specialist)</li>
              </ul>
            </div>
            <div class="flex justify-end">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  // Show personnel content
  showPersonnel: function(tabContent) {
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Personnel</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Limited functionality available in recovery mode.
          </p>
        </div>
        
        <div class="mb-4 flex justify-between items-center">
          <div class="relative w-64">
            <input type="text" placeholder="Search personnel..." class="w-full px-4 py-2 border rounded-lg">
            <div class="absolute right-3 top-2.5 text-gray-400">
              <i class="fas fa-search"></i>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <i class="fas fa-filter mr-1"></i> Filter
            </button>
            <button class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              <i class="fas fa-download mr-1"></i> Export
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
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
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">John Smith</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Account Manager</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">BBV Team</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">Client 1</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button class="text-blue-600 hover:text-blue-900 mr-3"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-600 hover:text-gray-900"><i class="fas fa-edit"></i></button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Jane Doe</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Engineer</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">BBV Team</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">Client 1</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button class="text-blue-600 hover:text-blue-900 mr-3"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-600 hover:text-gray-900"><i class="fas fa-edit"></i></button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Sarah Johnson</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Account Manager</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">ADD Team</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">Client 3</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button class="text-blue-600 hover:text-blue-900 mr-3"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-600 hover:text-gray-900"><i class="fas fa-edit"></i></button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Emily Davis</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Lead</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">ARB Team</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">Client 4</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button class="text-blue-600 hover:text-blue-900 mr-3"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-600 hover:text-gray-900"><i class="fas fa-edit"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
  
  // Show documentation content
  showDocumentation: function(tabContent) {
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Documentation</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Limited functionality available in recovery mode.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="text-blue-500 mr-3 text-2xl"><i class="fas fa-file-alt"></i></div>
              <h3 class="text-lg font-semibold">Quality Policies</h3>
            </div>
            <p class="text-gray-600 mb-4">Core quality policies and procedures</p>
            <div class="flex justify-end">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Documents
              </button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="text-green-500 mr-3 text-2xl"><i class="fas fa-clipboard-check"></i></div>
              <h3 class="text-lg font-semibold">Work Instructions</h3>
            </div>
            <p class="text-gray-600 mb-4">Detailed work instructions for quality processes</p>
            <div class="flex justify-end">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Documents
              </button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="text-purple-500 mr-3 text-2xl"><i class="fas fa-book"></i></div>
              <h3 class="text-lg font-semibold">Training Materials</h3>
            </div>
            <p class="text-gray-600 mb-4">Training documents and reference materials</p>
            <div class="flex justify-end">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Documents
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Recent Documents</h3>
          <ul class="divide-y divide-gray-200">
            <li class="py-3 flex justify-between items-center">
              <div>
                <div class="font-medium">Quality Manual v2.3</div>
                <div class="text-sm text-gray-500">Updated 3 days ago</div>
              </div>
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Download
              </button>
            </li>
            <li class="py-3 flex justify-between items-center">
              <div>
                <div class="font-medium">BBV Team Structure</div>
                <div class="text-sm text-gray-500">Updated 1 week ago</div>
              </div>
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Download
              </button>
            </li>
            <li class="py-3 flex justify-between items-center">
              <div>
                <div class="font-medium">ADD Quality Procedures</div>
                <div class="text-sm text-gray-500">Updated 2 weeks ago</div>
              </div>
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Download
              </button>
            </li>
          </ul>
        </div>
      </div>
    `;
  },
  
  // Apply emergency fix
  applyEmergencyFix: function() {
    console.log('Applying emergency fix');
    this.applyFixes();
  }
};

// Register as emergency UI
window.emergencyUI = window.criticalFix;

// Run critical fixes immediately
window.criticalFix.applyFixes();

// Also run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  window.criticalFix.applyFixes();
});

// Set up global entry point
window.applyEmergencyFix = function() {
  window.criticalFix.applyFixes();
};
