// DASHBOARD CONTENT LOADER
// This will directly replace any loading dashboard content
console.log('Dashboard content loader activated');

(function() {
  // Main function to load dashboard content
  function loadDashboardContent() {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return false;
    
    // Check if we're on the dashboard tab and stuck loading
    const isDashboardActive = document.querySelector('.tab-btn.active[data-tab="dashboard"]');
    const isLoading = tabContent.innerText.includes('Loading');
    
    if (isDashboardActive && isLoading) {
      console.log('Directly loading dashboard content');
      
      // Get data from window.appData if available
      const appData = window.appData || {};
      const teams = appData.teams || [];
      
      // Calculate stats
      const totalTeams = teams.length || 0;
      let totalPersonnel = 0;
      let bbvPersonnel = 0;
      let addPersonnel = 0;
      
      // Count personnel if teams data exists
      teams.forEach(team => {
        if (team.personnel) {
          totalPersonnel += team.personnel.length || 0;
          if (team.stream === 'bbv') bbvPersonnel += team.personnel.length || 0;
          if (team.stream === 'add') addPersonnel += team.personnel.length || 0;
        }
      });
      
      // Build dashboard HTML
      tabContent.innerHTML = `
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
          
          <!-- Teams Summary -->
          <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h3 class="text-lg font-semibold mb-4">Teams Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${teams.length > 0 ? teams.map(team => `
                <div class="border rounded-lg p-4">
                  <h4 class="font-semibold">${team.name}</h4>
                  <p class="text-sm text-gray-600">${team.stream.toUpperCase()} • ${team.personnel ? team.personnel.length : 0} members</p>
                  <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${team.performance || 0}%"></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Performance: ${team.performance || 0}%</p>
                </div>
              `).join('') : '<div class="col-span-3 text-gray-500">No teams available</div>'}
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button class="bg-blue-600 text-white px-4 py-2 rounded" id="dash-view-teams-btn">
                <i class="fas fa-users mr-2"></i> View Teams
              </button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded" id="dash-view-personnel-btn">
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
      setupButtonHandlers();
      
      return true; // Successfully loaded
    }
    
    return false; // Nothing to do
  }
  
  // Set up button handlers for the dashboard
  function setupButtonHandlers() {
    const teamsBtn = document.getElementById('dash-view-teams-btn');
    const personnelBtn = document.getElementById('dash-view-personnel-btn');
    
    if (teamsBtn) {
      teamsBtn.addEventListener('click', function() {
        const teamsTab = document.querySelector('[data-tab="teams"]');
        if (teamsTab) teamsTab.click();
      });
    }
    
    if (personnelBtn) {
      personnelBtn.addEventListener('click', function() {
        const personnelTab = document.querySelector('[data-tab="personnel"]');
        if (personnelTab) personnelTab.click();
      });
    }
  }
  
  // Run checks on a timer to fix stuck loading
  function startMonitoring() {
    // Try immediately
    loadDashboardContent();
    
    // Then check periodically
    setInterval(loadDashboardContent, 1000);
    
    // Also check on dashboard tab clicks
    const dashboardTab = document.querySelector('[data-tab="dashboard"]');
    if (dashboardTab) {
      dashboardTab.addEventListener('click', function() {
        // Wait a bit for the normal system to work
        setTimeout(loadDashboardContent, 1000);
      });
    }
  }
  
  // Start monitoring whenever possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMonitoring);
  } else {
    startMonitoring();
  }
  
  // Extra fallback for dashboard tab switch
  window.addEventListener('load', function() {
    const dashboardTab = document.querySelector('[data-tab="dashboard"]');
    if (dashboardTab) {
      const originalClick = dashboardTab.onclick;
      
      dashboardTab.onclick = function(e) {
        if (originalClick) originalClick.call(this, e);
        
        // Apply our fix after a delay
        setTimeout(loadDashboardContent, 1000);
      };
    }
  });
  
  // Export for other scripts
  window.dashboardLoader = {
    loadDashboardContent
  };
})(); 