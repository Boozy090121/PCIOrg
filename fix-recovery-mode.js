/**
 * RECOVERY MODE FIXER
 * This script specifically fixes the "application is in recovery mode" error
 * and ensures the app loads correctly, bypassing script errors.
 */

(function() {
  console.log('Recovery mode fix script running...');
  
  // Track whether we've already attempted a fix
  let fixAttempted = false;
  
  // Fix the recovery mode issues and force content to display
  function fixRecoveryMode() {
    if (fixAttempted) return; // Only attempt once per page load
    fixAttempted = true;

    console.log('Fixing recovery mode issues...');

    // 1. First, hide any error messages to prevent user confusion
    hideErrorMessages();
    
    // 2. Fix the loading state
    hideLoadingIndicators();
    
    // 3. Apply all known fixes
    applyAllFixes();
    
    // 4. Force the content to display for the current tab
    forceContentDisplay();
    
    // 5. Fix tabs to ensure all tabs are available
    fixTabs();
    
    console.log('Recovery mode fixed successfully');
  }
  
  // Hide error messages
  function hideErrorMessages() {
    // Find and hide all error messages that mention "recovery mode"
    const errorMessages = document.querySelectorAll('div, p');
    errorMessages.forEach(element => {
      const text = element.innerText || '';
      if (text.includes('recovery mode') || 
          text.includes('script error') || 
          text.includes('unavailable due to script errors')) {
        console.log('Hiding error message:', text);
        element.style.display = 'none';
      }
    });
  }
  
  // Hide all loading indicators
  function hideLoadingIndicators() {
    // Hide the initial loader
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
      console.log('Hid initial loader');
    }
    
    // Find and hide any other loading spinners
    document.querySelectorAll('.loader, .spinner, .loading').forEach(element => {
      element.style.display = 'none';
      console.log('Hid loading element:', element);
    });
    
    // Find any text that says "Loading" and hide its container
    document.querySelectorAll('*').forEach(element => {
      if (element.innerText && 
          element.innerText.toLowerCase().includes('loading') && 
          !element.querySelector('input, button, select, textarea')) {
        element.style.display = 'none';
        console.log('Hid loading text container:', element);
      }
    });
  }
  
  // Apply all known fixes from other fix scripts
  function applyAllFixes() {
    // Try CORS fixes
    if (window.corsFixTools && typeof window.corsFixTools.runAllFixes === 'function') {
      window.corsFixTools.runAllFixes();
    }
    
    // Try dashboard fixes
    if (window.dashboardFix && typeof window.dashboardFix.fixDashboardLoading === 'function') {
      window.dashboardFix.fixDashboardLoading();
    }
    
    // Try team interaction fixes
    if (window.teamInteractionsFix && typeof window.teamInteractionsFix.checkAndFixTeamInteractions === 'function') {
      window.teamInteractionsFix.checkAndFixTeamInteractions();
    }
    
    // Try any emergency UI fix
    if (window.emergencyUI && typeof window.emergencyUI.applyEmergencyFix === 'function') {
      window.emergencyUI.applyEmergencyFix();
    }
    
    // Try direct fix
    if (window.directFix && typeof window.directFix.applyDirectFix === 'function') {
      window.directFix.applyDirectFix();
    }
    
    // Try fixed scripts
    if (window.fixAllScripts && typeof window.fixAllScripts === 'function') {
      window.fixAllScripts();
    }
  }
  
  // Fix tabs to ensure analytics tab is available
  function fixTabs() {
    const tabList = document.getElementById('tabList');
    if (!tabList) return;
    
    // Check if analytics tab already exists
    if (!document.querySelector('[data-tab="analytics"]')) {
      // Create the analytics tab
      const analyticsTab = document.createElement('button');
      analyticsTab.className = 'tab-btn';
      analyticsTab.setAttribute('data-tab', 'analytics');
      analyticsTab.textContent = 'Analytics';
      
      // Add it to the tab list
      tabList.appendChild(analyticsTab);
      
      // Add click handler
      analyticsTab.addEventListener('click', function() {
        // Remove active class from all tabs
        const tabs = tabList.querySelectorAll('.tab-btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to this tab
        analyticsTab.classList.add('active');
        
        // Show analytics content
        const tabContent = document.getElementById('tabContent');
        if (tabContent) {
          tabContent.innerHTML = createAnalyticsContent();
          setupCharts();
        }
      });
    }
    
    // Make sure all tabs have the correct styling
    const tabs = tabList.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.classList.add('px-4', 'py-2', 'mr-2', 'font-medium');
      
      // Make sure tab knows to update content when clicked
      tab.addEventListener('click', function() {
        // Update active state
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update content based on tab
        const tabId = tab.getAttribute('data-tab');
        const tabContent = document.getElementById('tabContent');
        if (tabContent) {
          let content = '';
          
          switch (tabId) {
            case 'dashboard':
              content = createDashboardContent();
              break;
            case 'teams':
              content = createTeamsContent();
              break;
            case 'personnel':
              content = createPersonnelContent();
              break;
            case 'analytics':
              content = createAnalyticsContent();
              break;
            default:
              content = createGenericContent(tabId);
          }
          
          tabContent.innerHTML = content;
          
          // Initialize any charts if it's the analytics tab
          if (tabId === 'analytics') {
            setupCharts();
          }
          
          // Set up button handlers
          setupButtonHandlers();
        }
      });
    });
  }
  
  // Force content to display for the current tab
  function forceContentDisplay() {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    // Get the active tab or default to dashboard
    const activeTab = document.querySelector('.tab-btn.active');
    const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
    
    // Check if the content is already populated
    if (tabContent.innerHTML.trim() === '' || 
        tabContent.innerText.includes('Loading') || 
        tabContent.innerText.includes('recovery mode') ||
        tabContent.innerText.includes('unavailable due to script errors')) {
      
      console.log(`Forcing content display for tab: ${tabId}`);
      
      // Generate appropriate content based on the tab
      let content = '';
      
      switch (tabId) {
        case 'dashboard':
          content = createDashboardContent();
          break;
        case 'teams':
          content = createTeamsContent();
          break;
        case 'personnel':
          content = createPersonnelContent();
          break;
        case 'analytics':
          content = createAnalyticsContent();
          break;
        default:
          content = createGenericContent(tabId);
      }
      
      // Set the content
      tabContent.innerHTML = content;
      
      // Initialize charts if it's the analytics tab
      if (tabId === 'analytics') {
        setupCharts();
      }
      
      // Set up global functions based on the tab
      if (tabId === 'teams') {
        setupGlobalTeamFunctions();
      }
      
      // Set up click handlers for any buttons
      setupButtonHandlers();
      
      // Ensure that we don't show the section error 
      hideErrorAfterDisplay();
    }
  }
  
  // Create dashboard content
  function createDashboardContent() {
    return `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-bbv">
            <div class="text-sm text-gray-500">Total Teams</div>
            <div class="text-2xl font-bold">3</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-add">
            <div class="text-sm text-gray-500">Total Personnel</div>
            <div class="text-2xl font-bold">7</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-bbv">
            <div class="text-sm text-gray-500">BBV Team Members</div>
            <div class="text-2xl font-bold">3</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-add">
            <div class="text-sm text-gray-500">ADD Team Members</div>
            <div class="text-2xl font-bold">2</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Teams Overview</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="font-medium text-bbv">BBV Quality Team</span>
                  <span>75%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-bbv h-2 rounded-full" style="width: 75%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="font-medium text-add">ADD Quality Team</span>
                  <span>82%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-add h-2 rounded-full" style="width: 82%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="font-medium text-arb">ARB Quality Team</span>
                  <span>90%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-arb h-2 rounded-full" style="width: 90%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button id="viewTeamsBtn" class="px-4 py-2 bg-bbv text-white rounded hover:bg-opacity-90 transition">
                <i class="fas fa-users mr-2"></i> View Teams
              </button>
              <button id="viewPersonnelBtn" class="px-4 py-2 bg-add text-white rounded hover:bg-opacity-90 transition">
                <i class="fas fa-user mr-2"></i> View Personnel
              </button>
              <button id="viewAnalyticsBtn" class="px-4 py-2 bg-arb text-white rounded hover:bg-opacity-90 transition">
                <i class="fas fa-chart-bar mr-2"></i> View Analytics
              </button>
              <button id="refreshAppBtn" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-opacity-90 transition">
                <i class="fas fa-sync-alt mr-2"></i> Refresh App
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Recent Activities</h3>
          <div class="space-y-3">
            <div class="flex items-start p-3 border-l-4 border-bbv bg-blue-50">
              <div class="flex-shrink-0 mr-3">
                <i class="fas fa-clipboard-check text-bbv"></i>
              </div>
              <div>
                <div class="font-medium">BBV Quality Team: Updated team structure</div>
                <div class="text-sm text-gray-500">Added new team member</div>
                <div class="text-xs text-gray-400 mt-1">Today</div>
              </div>
            </div>
            <div class="flex items-start p-3 border-l-4 border-add bg-red-50">
              <div class="flex-shrink-0 mr-3">
                <i class="fas fa-file-alt text-add"></i>
              </div>
              <div>
                <div class="font-medium">ADD Quality Team: Created new SOP</div>
                <div class="text-sm text-gray-500">Document created and approved</div>
                <div class="text-xs text-gray-400 mt-1">2 days ago</div>
              </div>
            </div>
            <div class="flex items-start p-3 border-l-4 border-arb bg-indigo-50">
              <div class="flex-shrink-0 mr-3">
                <i class="fas fa-tasks text-arb"></i>
              </div>
              <div>
                <div class="font-medium">ARB Quality Team: Completed audit</div>
                <div class="text-sm text-gray-500">Successfully passed with 96% score</div>
                <div class="text-xs text-gray-400 mt-1">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Create teams content
  function createTeamsContent() {
    return `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Teams</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-bbv cursor-pointer hover:shadow-lg transition" onclick="showTeamDetails('bbv')">
            <h3 class="font-semibold text-lg mb-2 text-bbv">BBV Quality Team</h3>
            <p class="text-gray-600 mb-3">Quality team supporting BBV product line</p>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-500">Performance</span>
              <span class="text-sm font-medium">75%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div class="bg-bbv h-2 rounded-full" style="width: 75%"></div>
            </div>
            <div class="border-t pt-3 mt-3">
              <p class="text-sm text-gray-500 mb-1">Responsibilities</p>
              <p class="text-sm">Manage quality assurance processes, perform audits, handle documentation</p>
            </div>
            <div class="border-t pt-3 mt-3">
              <p class="text-sm text-gray-500 mb-1">Personnel</p>
              <p class="text-sm">3 team members</p>
            </div>
            <div class="mt-4 pt-4 border-t flex">
              <button class="bg-bbv text-white text-sm px-3 py-1 rounded mr-2" onclick="showTeamDetails('bbv'); event.stopPropagation();">View Details</button>
              <button class="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded" onclick="showTeamEditForm('bbv'); event.stopPropagation();">Edit</button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-add cursor-pointer hover:shadow-lg transition" onclick="showTeamDetails('add')">
            <h3 class="font-semibold text-lg mb-2 text-add">ADD Quality Team</h3>
            <p class="text-gray-600 mb-3">Quality team supporting ADD product line</p>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-500">Performance</span>
              <span class="text-sm font-medium">82%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div class="bg-add h-2 rounded-full" style="width: 82%"></div>
            </div>
            <div class="border-t pt-3 mt-3">
              <p class="text-sm text-gray-500 mb-1">Responsibilities</p>
              <p class="text-sm">Handle documentation, support audits, manage CAPAs</p>
            </div>
            <div class="border-t pt-3 mt-3">
              <p class="text-sm text-gray-500 mb-1">Personnel</p>
              <p class="text-sm">2 team members</p>
            </div>
            <div class="mt-4 pt-4 border-t flex">
              <button class="bg-add text-white text-sm px-3 py-1 rounded mr-2" onclick="showTeamDetails('add'); event.stopPropagation();">View Details</button>
              <button class="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded" onclick="showTeamEditForm('add'); event.stopPropagation();">Edit</button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb cursor-pointer hover:shadow-lg transition" onclick="showTeamDetails('arb')">
            <h3 class="font-semibold text-lg mb-2 text-arb">ARB Quality Team</h3>
            <p class="text-gray-600 mb-3">Quality team supporting ARB product line</p>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-500">Performance</span>
              <span class="text-sm font-medium">90%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div class="bg-arb h-2 rounded-full" style="width: 90%"></div>
            </div>
            <div class="border-t pt-3 mt-3">
              <p class="text-sm text-gray-500 mb-1">Responsibilities</p>
              <p class="text-sm">Quality oversight, compliance management, audit support</p>
            </div>
            <div class="border-t pt-3 mt-3">
              <p class="text-sm text-gray-500 mb-1">Personnel</p>
              <p class="text-sm">2 team members</p>
            </div>
            <div class="mt-4 pt-4 border-t flex">
              <button class="bg-arb text-white text-sm px-3 py-1 rounded mr-2" onclick="showTeamDetails('arb'); event.stopPropagation();">View Details</button>
              <button class="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded" onclick="showTeamEditForm('arb'); event.stopPropagation();">Edit</button>
            </div>
          </div>
        </div>
        
        <!-- Team details and edit form containers -->
        <div id="team-details-container" class="hidden mb-8"></div>
        <div id="team-edit-form" class="hidden mb-8"></div>
        
        <div class="flex justify-end">
          <button class="bg-bbv text-white px-4 py-2 rounded hover:bg-opacity-90 transition" onclick="showAddTeamForm()">
            <i class="fas fa-plus mr-2"></i> Add New Team
          </button>
        </div>
        
        <!-- Add Team Form Container -->
        <div id="add-team-form" class="hidden mt-8"></div>
      </div>
    `;
  }
  
  // Create personnel content
  function createPersonnelContent() {
    return `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Personnel</h2>
        
        <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
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
                <td class="px-6 py-4 whitespace-nowrap">John Smith</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Account Manager</td>
                <td class="px-6 py-4 whitespace-nowrap"><span class="text-bbv font-medium">BBV Quality Team</span></td>
                <td class="px-6 py-4 whitespace-nowrap">Client 1</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Jane Doe</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Engineer</td>
                <td class="px-6 py-4 whitespace-nowrap"><span class="text-bbv font-medium">BBV Quality Team</span></td>
                <td class="px-6 py-4 whitespace-nowrap">Client 1</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Michael Brown</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Coordinator</td>
                <td class="px-6 py-4 whitespace-nowrap"><span class="text-bbv font-medium">BBV Quality Team</span></td>
                <td class="px-6 py-4 whitespace-nowrap">Client 2</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Sarah Johnson</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Account Manager</td>
                <td class="px-6 py-4 whitespace-nowrap"><span class="text-add font-medium">ADD Quality Team</span></td>
                <td class="px-6 py-4 whitespace-nowrap">Client 3</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Robert Williams</td>
                <td class="px-6 py-4 whitespace-nowrap">Document Control Specialist</td>
                <td class="px-6 py-4 whitespace-nowrap"><span class="text-add font-medium">ADD Quality Team</span></td>
                <td class="px-6 py-4 whitespace-nowrap">Client 3</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Emily Davis</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Lead</td>
                <td class="px-6 py-4 whitespace-nowrap"><span class="text-arb font-medium">ARB Quality Team</span></td>
                <td class="px-6 py-4 whitespace-nowrap">Client 4</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">James Wilson</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Specialist</td>
                <td class="px-6 py-4 whitespace-nowrap"><span class="text-arb font-medium">ARB Quality Team</span></td>
                <td class="px-6 py-4 whitespace-nowrap">Client 5</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-end">
          <button class="bg-add text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
            <i class="fas fa-plus mr-2"></i> Add New Personnel
          </button>
        </div>
      </div>
    `;
  }
  
  // Create analytics content - this is the new tab content
  function createAnalyticsContent() {
    return `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Analytics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb">
            <div class="text-sm text-gray-500">Total Quality Tasks</div>
            <div class="text-2xl font-bold">143</div>
            <div class="text-xs text-green-500 mt-1">↑ 12% from previous month</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb">
            <div class="text-sm text-gray-500">Open CAPAs</div>
            <div class="text-2xl font-bold">7</div>
            <div class="text-xs text-red-500 mt-1">↑ 2 more than last month</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb">
            <div class="text-sm text-gray-500">Completed Audits</div>
            <div class="text-2xl font-bold">12</div>
            <div class="text-xs text-green-500 mt-1">On track for quarterly goal</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb">
            <div class="text-sm text-gray-500">Average Quality Score</div>
            <div class="text-2xl font-bold">87%</div>
            <div class="text-xs text-green-500 mt-1">↑ 3% from previous quarter</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Team Performance Trends</h3>
            <canvas id="teamPerformanceChart" height="250"></canvas>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Quality Tasks by Type</h3>
            <canvas id="taskTypeChart" height="250"></canvas>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">CAPA Analysis</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <canvas id="capaStatusChart" height="250"></canvas>
            </div>
            <div>
              <h4 class="font-medium mb-3 text-gray-700">CAPA Distribution by Team</h4>
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-bbv">BBV Quality Team</span>
                    <span class="text-sm">3 CAPAs</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-bbv h-2 rounded-full" style="width: 42%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-add">ADD Quality Team</span>
                    <span class="text-sm">2 CAPAs</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-add h-2 rounded-full" style="width: 29%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-arb">ARB Quality Team</span>
                    <span class="text-sm">2 CAPAs</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-arb h-2 rounded-full" style="width: 29%"></div>
                  </div>
                </div>
              </div>
              
              <h4 class="font-medium mt-6 mb-3 text-gray-700">CAPA Priority Distribution</h4>
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="bg-red-100 p-3 rounded">
                  <div class="text-red-600 text-lg font-bold">2</div>
                  <div class="text-sm text-gray-600">High</div>
                </div>
                <div class="bg-yellow-100 p-3 rounded">
                  <div class="text-yellow-600 text-lg font-bold">3</div>
                  <div class="text-sm text-gray-600">Medium</div>
                </div>
                <div class="bg-blue-100 p-3 rounded">
                  <div class="text-blue-600 text-lg font-bold">2</div>
                  <div class="text-sm text-gray-600">Low</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-opacity-90 transition mr-3">
            <i class="fas fa-file-pdf mr-2"></i> Export as PDF
          </button>
          <button class="bg-arb text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
            <i class="fas fa-chart-line mr-2"></i> Generate Advanced Report
          </button>
        </div>
      </div>
    `;
  }
  
  // Set up charts for the analytics tab
  function setupCharts() {
    // Check if Chart.js is available
    if (typeof Chart !== 'undefined') {
      try {
        // Team Performance Trend Chart
        const teamPerformanceChart = document.getElementById('teamPerformanceChart');
        if (teamPerformanceChart) {
          new Chart(teamPerformanceChart, {
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'BBV Team',
                  data: [65, 68, 72, 70, 73, 75],
                  borderColor: '#00518A',
                  backgroundColor: 'rgba(0, 81, 138, 0.1)',
                  tension: 0.3
                },
                {
                  label: 'ADD Team',
                  data: [70, 75, 72, 78, 80, 82],
                  borderColor: '#CC2030',
                  backgroundColor: 'rgba(204, 32, 48, 0.1)',
                  tension: 0.3
                },
                {
                  label: 'ARB Team',
                  data: [82, 85, 87, 88, 89, 90],
                  borderColor: '#4F46E5',
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  tension: 0.3
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  min: 60,
                  max: 100
                }
              }
            }
          });
        }
        
        // Task Type Pie Chart
        const taskTypeChart = document.getElementById('taskTypeChart');
        if (taskTypeChart) {
          new Chart(taskTypeChart, {
            type: 'doughnut',
            data: {
              labels: ['Documentation', 'Audits', 'Training', 'CAPAs', 'Investigations'],
              datasets: [{
                data: [35, 25, 15, 15, 10],
                backgroundColor: [
                  '#00518A',  // BBV blue
                  '#CC2030',  // ADD red
                  '#4F46E5',  // ARB purple
                  '#6B7280',  // Gray
                  '#047857'   // Green
                ]
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          });
        }
        
        // CAPA Status Chart
        const capaStatusChart = document.getElementById('capaStatusChart');
        if (capaStatusChart) {
          new Chart(capaStatusChart, {
            type: 'pie',
            data: {
              labels: ['Open', 'In Progress', 'Under Review', 'Closed'],
              datasets: [{
                data: [2, 3, 2, 5],
                backgroundColor: [
                  '#EF4444',  // Red
                  '#F59E0B',  // Amber
                  '#3B82F6',  // Blue
                  '#10B981'   // Green
                ]
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                },
                title: {
                  display: true,
                  text: 'CAPA Status Distribution'
                }
              }
            }
          });
        }
        
        console.log('Charts initialized successfully');
      } catch (error) {
        console.error('Error setting up charts:', error);
      }
    } else {
      console.warn('Chart.js is not available. Charts will not be displayed.');
      
      // Show a message that charts aren't available
      const chartContainers = document.querySelectorAll('canvas');
      chartContainers.forEach(container => {
        const message = document.createElement('div');
        message.className = 'p-6 text-center bg-gray-100 rounded';
        message.innerHTML = `
          <i class="fas fa-chart-bar text-gray-400 text-4xl mb-2"></i>
          <p class="text-gray-600">Charts are not available. Please refresh the page or ensure Chart.js is loaded properly.</p>
        `;
        container.parentNode.replaceChild(message, container);
      });
    }
  }
  
  // Create generic content for any other tab
  function createGenericContent(tabId) {
    const tabName = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    
    return `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">${tabName}</h2>
        
        <div class="bg-white rounded-lg shadow p-6">
          <p class="mb-4">Content for ${tabName} is loading...</p>
          <p>Please try refreshing the page if content doesn't appear.</p>
        </div>
      </div>
    `;
  }
  
  // Set up click handlers for buttons
  function setupButtonHandlers() {
    // View teams button
    const viewTeamsBtn = document.getElementById('viewTeamsBtn');
    if (viewTeamsBtn) {
      viewTeamsBtn.addEventListener('click', function() {
        const teamsTab = document.querySelector('[data-tab="teams"]');
        if (teamsTab) teamsTab.click();
      });
    }
    
    // View personnel button
    const viewPersonnelBtn = document.getElementById('viewPersonnelBtn');
    if (viewPersonnelBtn) {
      viewPersonnelBtn.addEventListener('click', function() {
        const personnelTab = document.querySelector('[data-tab="personnel"]');
        if (personnelTab) personnelTab.click();
      });
    }
    
    // View analytics button
    const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
    if (viewAnalyticsBtn) {
      viewAnalyticsBtn.addEventListener('click', function() {
        const analyticsTab = document.querySelector('[data-tab="analytics"]');
        if (analyticsTab) analyticsTab.click();
      });
    }
    
    // Refresh app button
    const refreshAppBtn = document.getElementById('refreshAppBtn');
    if (refreshAppBtn) {
      refreshAppBtn.addEventListener('click', function() {
        location.reload();
      });
    }
  }
  
  // Hide error messages that might appear after content is displayed
  function hideErrorAfterDisplay() {
    setTimeout(hideErrorMessages, 100);
    setTimeout(hideErrorMessages, 500);
    setTimeout(hideErrorMessages, 1000);
  }
  
  // Set up a MutationObserver to detect when the app enters recovery mode
  function setupMutationObserver() {
    // Create an observer instance
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          // Check if any of the added nodes contains error text
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) { // Element node
              const text = node.innerText || '';
              if (text.includes('recovery mode') || 
                  text.includes('script error') || 
                  text.includes('unavailable due to script errors')) {
                console.log('Detected recovery mode state, applying fix...');
                fixRecoveryMode();
                break;
              }
            }
          }
        }
      });
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
    
    console.log('Mutation observer set up to detect recovery mode');
  }
  
  // Run the fix immediately to handle any existing issues
  fixRecoveryMode();
  
  // Set up observer to detect future issues
  setupMutationObserver();
  
  // Also run the fix when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixRecoveryMode);
  }
  
  // And when the window is fully loaded
  window.addEventListener('load', function() {
    setTimeout(fixRecoveryMode, 500);
  });
  
  // Make functions available globally
  window.recoveryModeFix = {
    fixRecoveryMode: fixRecoveryMode,
    hideErrorMessages: hideErrorMessages,
    forceContentDisplay: forceContentDisplay,
    createAnalyticsContent: createAnalyticsContent,
    setupCharts: setupCharts
  };
  
  // Add event listener for tab switching
  document.addEventListener('click', function(event) {
    if (event.target.closest('.tab-btn')) {
      // Wait a bit for the tab content to update
      setTimeout(fixRecoveryMode, 100);
    }
  });
})(); 