/**
 * Emergency fix script for Quality Org Application
 * Ensures basic application functionality even if other scripts fail to load
 */

(function() {
  console.log('Applying emergency fixes to ensure application loads properly');
  
  // Add initialization flag to prevent unnecessary error messages
  window.fixScriptInitialized = false;
  window.showingRecoveryMessage = false;
  
  // Basic configuration if not loaded elsewhere
  window.config = window.config || {
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
      { id: 'teams', label: 'Teams', icon: 'fa-users' },
      { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
      { id: 'orgbuilder', label: 'Org Builder', icon: 'fa-sitemap' },
      { id: 'skillsmatrix', label: 'Skills Matrix', icon: 'fa-table' },
      { id: 'gapanalysis', label: 'Gap Analysis', icon: 'fa-exclamation-triangle' },
      { id: 'training', label: 'Training Plans', icon: 'fa-graduation-cap' },
      { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' },
      { id: 'planning', label: 'Planning', icon: 'fa-tasks' },
      { id: 'raci', label: 'RACI Matrix', icon: 'fa-project-diagram' },
      { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar' }
    ],
    valueStreams: [
      { id: 'bbv', label: 'BBV', color: '#00518A', theme: 'theme-bbv' },
      { id: 'add', label: 'ADD', color: '#CC2030', theme: 'theme-add' },
      { id: 'arb', label: 'ARB', color: '#4F46E5', theme: 'theme-arb' },
      { id: 'shared', label: 'Shared Services', color: '#374151', theme: 'theme-shared' }
    ],
    defaultValueStream: 'bbv'
  };
  
  // Basic dummy data if data.js fails to load
  window.appData = window.appData || {
    teams: [
      { id: 1, name: 'BBV Quality Team', stream: 'bbv', members: 3 },
      { id: 2, name: 'ADD Quality Team', stream: 'add', members: 2 },
      { id: 3, name: 'ARB Quality Team', stream: 'arb', members: 2 }
    ],
    personnel: [
      { id: 1, name: 'John Smith', role: 'Quality Account Manager', team: 1 },
      { id: 2, name: 'Jane Doe', role: 'Quality Engineer', team: 1 }
    ],
    state: {
      currentTab: 'dashboard',
      currentStream: 'bbv'
    }
  };
  
  // Set up critical CSS variables
  document.documentElement.style.setProperty('--primary-color', '#00518A');
  document.documentElement.style.setProperty('--primary-light', 'rgba(0, 81, 138, 0.1)');
  document.documentElement.style.setProperty('--primary-hover', 'rgba(0, 81, 138, 0.2)');
  document.documentElement.style.setProperty('--accent-color', '#0078D4');
  
  // Ensure body has correct layout class
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.body.classList.contains('sidebar-layout')) {
      document.body.classList.add('sidebar-layout');
    }
  });
  
  // CRITICAL FIX: Ensure the tabContent container exists and is properly initialized
  window.ensureTabContentExists = function() {
    console.log('Checking if tabContent container exists...');
    
    // Get a reference to the main content area
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
      console.log('Main content container not found, waiting for DOM...');
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          window.ensureTabContentExists();
        });
      } else {
        // If DOM is already loaded but mainContent still doesn't exist,
        // create it as a fallback
        const mainContent = document.createElement('div');
        mainContent.id = 'mainContent';
        mainContent.className = 'main-content';
        document.body.appendChild(mainContent);
        console.log('Created mainContent container as fallback');
      }
      return;
    }
    
    // Check if tabContent exists
    let tabContent = document.getElementById('tabContent');
    
    // If it doesn't exist, create it
    if (!tabContent) {
      console.log('tabContent container not found, creating it...');
      tabContent = document.createElement('div');
      tabContent.id = 'tabContent';
      tabContent.className = 'tab-content';
      
      // Add a loading placeholder
      tabContent.innerHTML = `
        <div class="loading-placeholder">
          <div class="loader-spinner"></div>
          <p>Loading content...</p>
        </div>
      `;
      
      // Append it to the main content
      mainContent.appendChild(tabContent);
      console.log('tabContent container created successfully');
    } else {
      console.log('tabContent container exists');
    }
    
    return tabContent;
  };
  
  // NEW CRITICAL FIX: Global function to force clear all possible content containers
  window.forceResetAllContent = function() {
    console.log('Force resetting all content containers');
    
    // List of all possible content containers that might be used
    const containerIds = [
      'tabContent',
      'dashboard-content',
      'teams-content',
      'personnel-content',
      'analytics-content',
      'documentation-content',
      'training-content',
      'planning-content',
      'skills-content',
      'content-container',
      'main-content-area',
      'tab-content-container',
      'contentWrapper'
    ];
    
    // Clear each container if it exists
    containerIds.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        console.log(`Clearing content container: ${id}`);
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    });
    
    // Also check for any elements with specific classes
    const contentClassSelectors = [
      '.tab-content',
      '.content-panel',
      '.tab-panel'
    ];
    
    contentClassSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        console.log(`Clearing content element with selector: ${selector}`);
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      });
    });
    
    console.log('All content containers reset successfully');
    return true;
  };
  
  // Ensure all required containers exist and have correct structure
  function ensureContainer(id, className, parent) {
    if (!document.getElementById(id)) {
      const container = document.createElement('div');
      container.id = id;
      container.className = className || '';
      
      if (parent) {
        const parentElement = typeof parent === 'string' ? document.getElementById(parent) : parent;
        if (parentElement) {
          parentElement.appendChild(container);
        } else {
          document.body.appendChild(container);
        }
      } else {
        document.body.appendChild(container);
      }
      
      return container;
    }
    return document.getElementById(id);
  }
  
  // Run the fix immediately and on DOMContentLoaded
  window.ensureTabContentExists();
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event triggered, ensuring critical elements exist');
    window.ensureTabContentExists();
    // Mark as initialized to prevent error recovery during normal startup
    setTimeout(() => {
      window.fixScriptInitialized = true;
    }, 1000);
  });
  
  // Patch the UI object's tab functions to check for tabContent before trying to use it
  const originalUiInit = window.ui && window.ui.init;
  if (window.ui) {
    const originalLoadFunctions = {
      loadDashboardContent: window.ui.loadDashboardContent,
      loadTeamsContent: window.ui.loadTeamsContent,
      loadPersonnelContent: window.ui.loadPersonnelContent,
      loadComingSoonContent: window.ui.loadComingSoonContent,
      switchTab: window.ui.switchTab
    };
    
    // Patch all load functions to ensure tabContent exists
    Object.keys(originalLoadFunctions).forEach(funcName => {
      if (typeof window.ui[funcName] === 'function') {
        const originalFunc = window.ui[funcName];
        window.ui[funcName] = function() {
          window.ensureTabContentExists();
          return originalFunc.apply(window.ui, arguments);
        };
      }
    });
    
    // Patch the init function
    window.ui.init = function() {
      window.ensureTabContentExists();
      if (originalUiInit) {
        return originalUiInit.apply(window.ui, arguments);
      }
    };
  }
  
  // Ensure basic error handling is set up - with safeguards to prevent unnecessary error messages
  window.onerror = function(msg, url, line, col, error) {
    console.error(`Error occurred: ${msg} at ${url}:${line}:${col}`);
    
    // Only show error messages for non-initialization errors
    if (window.fixScriptInitialized && !window.showingRecoveryMessage) {
      // Try to show a message to the user
      const toast = document.getElementById('toast');
      if (toast) {
        toast.className = 'toast show';
        toast.style.backgroundColor = '#ef4444';
        toast.innerHTML = `
          <div class="toast-content">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>Error: ${msg}</span>
          </div>
        `;
        
        setTimeout(() => {
          toast.classList.remove('show');
        }, 5000);
      }
    }
    
    return true; // Prevent default error handling
  };
  
  // Ensure basic emergency UI function
  window.showEmergencyUI = function() {
    // Only run this once and only after initialization
    if (window.showingRecoveryMessage || !window.fixScriptInitialized) {
      return;
    }
    
    window.showingRecoveryMessage = true;
    
    // Hide loader
    const loader = document.getElementById('initialLoader');
    if (loader) loader.style.display = 'none';
    
    // Ensure tab content exists
    const tabContent = window.ensureTabContentExists();
    
    // Show basic UI
    if (tabContent) {
      tabContent.innerHTML = `
        <div class="p-4">
          <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1rem;">
              <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Quality Teams</h3>
              <p>3 teams across streams</p>
            </div>
            
            <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1rem;">
              <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Personnel</h3>
              <p>7 team members</p>
            </div>
          </div>
          
          <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1rem;">
            <p>Application is running in emergency mode. Some features may be limited.</p>
            <button onclick="window.location.reload()" style="background-color: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-top: 1rem;">
              Reload Application
            </button>
          </div>
        </div>
      `;
    }
    
    // Set up emergency event listeners
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show placeholder content
        const tabContent = window.ensureTabContentExists();
        if (tabContent) {
          const tabId = item.getAttribute('data-tab');
          const label = item.querySelector('.nav-item-label')?.textContent || tabId;
          
          tabContent.innerHTML = `
            <div class="p-4">
              <h2 class="text-2xl font-bold mb-6">${label}</h2>
              <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1rem; text-align: center;">
                <p>This content is currently unavailable in emergency mode.</p>
              </div>
            </div>
          `;
        }
      });
    });
  };
  
  // Set a timeout to check if the application loads properly - only after a reasonable time
  window.emergencyTimeout = setTimeout(function() {
    // Set as initialized after timeout
    window.fixScriptInitialized = true;
    
    if (!window.ui || !window.ui.init) {
      console.warn('Application failed to initialize properly, activating emergency mode');
      window.showEmergencyUI();
    }
  }, 5000);
  
  // Add a special fix for Personnel tab
  window.fixPersonnelContent = function() {
    console.log('Applying direct fix for Personnel tab content');
    
    try {
      // Check if we're on the personnel tab
      if (window.location.hash === '#personnel') {
        // Get or create tabContent
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) {
          console.error('Main content not found, cannot fix Personnel tab');
          return;
        }
        
        let tabContent = document.getElementById('tabContent');
        if (!tabContent) {
          tabContent = document.createElement('div');
          tabContent.id = 'tabContent';
          tabContent.className = 'tab-content';
          mainContent.appendChild(tabContent);
        }
        
        // Set active class on personnel nav
        const personnelNav = document.querySelector('.nav-item[data-tab="personnel"]');
        if (personnelNav) {
          const allNavs = document.querySelectorAll('.nav-item');
          allNavs.forEach(nav => nav.classList.remove('active'));
          personnelNav.classList.add('active');
        }
        
        // Update context header
        const contextTitle = document.getElementById('contextTitle');
        const currentBreadcrumb = document.getElementById('currentBreadcrumb');
        
        if (contextTitle) contextTitle.textContent = 'Personnel';
        if (currentBreadcrumb) currentBreadcrumb.textContent = 'Personnel';
        
        // Create fallback personnel content
        tabContent.innerHTML = `
          <div class="p-4">
            <h2 class="text-2xl font-bold mb-6">Personnel</h2>
            
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
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">John Smith</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Quality Account Manager</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">BBV Quality Team</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Client 1</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button class="text-blue-600 hover:text-blue-900 mr-3" onclick="alert('View not implemented')">
                        <i class="fas fa-eye mr-1"></i>View
                      </button>
                      <button class="text-green-600 hover:text-green-900" onclick="alert('Edit not implemented')">
                        <i class="fas fa-edit mr-1"></i>Edit
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">Jane Doe</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Quality Engineer</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">BBV Quality Team</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Client 1</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button class="text-blue-600 hover:text-blue-900 mr-3" onclick="alert('View not implemented')">
                        <i class="fas fa-eye mr-1"></i>View
                      </button>
                      <button class="text-green-600 hover:text-green-900" onclick="alert('Edit not implemented')">
                        <i class="fas fa-edit mr-1"></i>Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
        
        console.log('Applied direct fix for Personnel tab content');
        return true;
      }
    } catch (error) {
      console.error('Error applying Personnel tab fix:', error);
    }
    
    return false;
  };
  
  // Check if we need to apply the personnel fix immediately
  if (window.location.hash === '#personnel') {
    // Set a timeout to apply the fix after everything else
    setTimeout(function() {
      window.fixPersonnelContent();
    }, 500);
    
    // Also try to apply it when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      window.fixPersonnelContent();
    });
  }
  
  console.log('Emergency fixes applied successfully');
})(); 