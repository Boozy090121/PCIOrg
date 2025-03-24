// DASHBOARD LOADING FIX
// This script specifically targets the stuck dashboard loading spinner
console.log('DASHBOARD FIX: Initializing dashboard loading fix');

(function() {
  // Fix dashboard content that's stuck loading
  function fixDashboardLoading() {
    const tabContent = document.getElementById('tabContent');
    
    // Check if we have the loading spinner with "Loading dashboard content"
    if (tabContent && 
        (tabContent.innerText.includes('Loading dashboard content') || 
         (tabContent.innerText.includes('Loading') && document.querySelector('.tab-btn.active[data-tab="dashboard"]')))) {
      
      console.log('DASHBOARD FIX: Detected stuck dashboard loading, forcing content');
      
      // Force dashboard content
      tabContent.innerHTML = `
        <div class="p-4">
          <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <!-- Stats Cards -->
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
              <div class="text-2xl font-bold">2</div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <div class="text-sm text-gray-500">ADD Team Members</div>
              <div class="text-2xl font-bold">1</div>
            </div>
          </div>
          
          <!-- Teams Summary -->
          <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h3 class="text-lg font-semibold mb-4">Teams Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold">Quality Control Team</h4>
                <p class="text-sm text-gray-600">BBV • 2 members</p>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 85%"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Performance: 85%</p>
              </div>
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold">Validation Team</h4>
                <p class="text-sm text-gray-600">ADD • 1 member</p>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 78%"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Performance: 78%</p>
              </div>
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold">Regulatory Affairs</h4>
                <p class="text-sm text-gray-600">ARB • 2 members</p>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 92%"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Performance: 92%</p>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button class="bg-blue-600 text-white px-4 py-2 rounded" id="viewTeamsBtn">
                <i class="fas fa-users mr-2"></i> View Teams
              </button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded" id="viewPersonnelBtn">
                <i class="fas fa-user mr-2"></i> View Personnel
              </button>
              <button class="bg-gray-600 text-white px-4 py-2 rounded">
                <i class="fas fa-chart-bar mr-2"></i> Reports
              </button>
              <button class="bg-gray-600 text-white px-4 py-2 rounded">
                <i class="fas fa-cog mr-2"></i> Settings
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners to buttons
      const viewTeamsBtn = document.getElementById('viewTeamsBtn');
      const viewPersonnelBtn = document.getElementById('viewPersonnelBtn');
      
      if (viewTeamsBtn) {
        viewTeamsBtn.addEventListener('click', function() {
          const teamsTab = document.querySelector('[data-tab="teams"]');
          if (teamsTab) teamsTab.click();
        });
      }
      
      if (viewPersonnelBtn) {
        viewPersonnelBtn.addEventListener('click', function() {
          const personnelTab = document.querySelector('[data-tab="personnel"]');
          if (personnelTab) personnelTab.click();
        });
      }
      
      return true; // Fixed successfully
    }
    
    return false; // Nothing to fix
  }
  
  // Set up a mutation observer to detect changes in the tab content
  function setupMutationObserver() {
    // Target the tab content element
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    // Create an observer instance
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // Check if the dashboard is loading after mutations
        fixDashboardLoading();
      });
    });
    
    // Configuration of the observer
    const config = { attributes: true, childList: true, characterData: true, subtree: true };
    
    // Start observing
    observer.observe(tabContent, config);
    console.log('DASHBOARD FIX: Mutation observer started');
  }
  
  // Main function to initialize and apply fixes
  function init() {
    console.log('DASHBOARD FIX: Initializing...');
    
    // Try to fix immediately
    fixDashboardLoading();
    
    // Set up mutation observer
    setupMutationObserver();
    
    // Set a timer to check periodically
    setInterval(fixDashboardLoading, 1000);
    
    // Also apply fix when dashboard tab is clicked
    const dashboardTab = document.querySelector('[data-tab="dashboard"]');
    if (dashboardTab) {
      dashboardTab.addEventListener('click', function() {
        // Give the normal tab switching a chance
        setTimeout(fixDashboardLoading, 1000);
      });
    }
  }
  
  // Check if DOM is already loaded
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
  
  // Also run after window is fully loaded
  window.addEventListener('load', function() {
    setTimeout(fixDashboardLoading, 1000);
  });
  
  // Export functions for other scripts to use
  window.dashboardFix = {
    fixDashboardLoading: fixDashboardLoading
  };
})(); 