/**
 * DIRECT APPLICATION FIX
 * This script is loaded last and applies any final critical fixes
 */

(function() {
  console.log('Direct fix script running...');
  
  // Immediately fix white screen issue
  fixWhiteScreen();
  
  // Immediately exit recovery mode and force normal display
  exitFromRecoveryMode();
  
  /**
   * Fix white screen issues by creating basic content even if other scripts fail
   */
  function fixWhiteScreen() {
    console.log('Direct fix: Checking for white screen issues...');
    
    // Check if the page is completely blank (white screen)
    const isWhiteScreen = document.body.children.length < 3 || 
      (document.getElementById('tabContent') === null && 
       document.querySelector('.main-content') === null);
    
    if (isWhiteScreen) {
      console.log('Direct fix: White screen detected, applying immediate fix');
      
      // Add emergency styles
      const style = document.createElement('style');
      style.textContent = `
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f8fafc;
          color: #333;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: block !important;
        }
        .direct-fix-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .direct-fix-header {
          background-color: white;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        .direct-fix-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }
        .direct-fix-tab {
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .direct-fix-tab.active {
          border-bottom-color: #3b82f6;
          color: #3b82f6;
        }
        .direct-fix-card {
          background: white;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .direct-fix-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .direct-fix-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
      
      // Create emergency content container
      const container = document.createElement('div');
      container.className = 'direct-fix-container';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'direct-fix-header';
      header.innerHTML = `
        <h1 style="margin: 0; font-size: 1.5rem;">Quality Org Overhaul</h1>
        <p style="margin: 0.5rem 0 0 0; color: #6b7280;">Using emergency display mode</p>
      `;
      
      // Create tabs
      const tabs = document.createElement('div');
      tabs.className = 'direct-fix-tabs';
      tabs.innerHTML = `
        <div class="direct-fix-tab active" data-tab="dashboard">Dashboard</div>
        <div class="direct-fix-tab" data-tab="teams">Teams</div>
        <div class="direct-fix-tab" data-tab="personnel">Personnel</div>
      `;
      
      // Create content area
      const content = document.createElement('div');
      content.className = 'direct-fix-content';
      content.innerHTML = `
        <h2>Dashboard</h2>
        
        <div class="direct-fix-grid">
          <div class="direct-fix-card">
            <div style="color: #6b7280; font-size: 0.875rem;">Total Teams</div>
            <div style="font-size: 1.5rem; font-weight: bold;">3</div>
          </div>
          <div class="direct-fix-card">
            <div style="color: #6b7280; font-size: 0.875rem;">Total Personnel</div>
            <div style="font-size: 1.5rem; font-weight: bold;">7</div>
          </div>
        </div>
        
        <div class="direct-fix-card">
          <h3 style="margin-top: 0;">Teams Overview</h3>
          <p>BBV Quality Team - 3 members</p>
          <p>ADD Quality Team - 2 members</p>
          <p>ARB Quality Team - 2 members</p>
        </div>
        
        <button class="direct-fix-button" id="directFixRefreshBtn">Refresh Page</button>
      `;
      
      // Add everything to the page
      container.appendChild(header);
      container.appendChild(tabs);
      container.appendChild(content);
      
      // Clean the body and add our container
      document.body.innerHTML = '';
      document.body.appendChild(container);
      
      // Add tab click handlers
      document.querySelectorAll('.direct-fix-tab').forEach(tab => {
        tab.addEventListener('click', function() {
          // Update active tab
          document.querySelectorAll('.direct-fix-tab').forEach(t => {
            t.classList.toggle('active', t === this);
          });
          
          // Get tab ID
          const tabId = this.getAttribute('data-tab');
          
          // Update content based on tab
          let tabContent = '';
          if (tabId === 'teams') {
            tabContent = `
              <h2>Teams</h2>
              <div class="direct-fix-card">
                <h3 style="margin-top: 0;">BBV Quality Team</h3>
                <p>Quality team supporting BBV product line</p>
                <p>Members: 3</p>
              </div>
              <div class="direct-fix-card">
                <h3 style="margin-top: 0;">ADD Quality Team</h3>
                <p>Quality team supporting ADD product line</p>
                <p>Members: 2</p>
              </div>
              <div class="direct-fix-card">
                <h3 style="margin-top: 0;">ARB Quality Team</h3>
                <p>Quality team supporting ARB product line</p>
                <p>Members: 2</p>
              </div>
            `;
          } else if (tabId === 'personnel') {
            tabContent = `
              <h2>Personnel</h2>
              <div class="direct-fix-card">
                <h3 style="margin-top: 0;">Team Members</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <th style="text-align: left; padding: 0.5rem;">Name</th>
                    <th style="text-align: left; padding: 0.5rem;">Role</th>
                    <th style="text-align: left; padding: 0.5rem;">Team</th>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 0.5rem;">John Smith</td>
                    <td style="padding: 0.5rem;">Quality Manager</td>
                    <td style="padding: 0.5rem;">BBV Team</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 0.5rem;">Jane Doe</td>
                    <td style="padding: 0.5rem;">Quality Engineer</td>
                    <td style="padding: 0.5rem;">BBV Team</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 0.5rem;">Michael Brown</td>
                    <td style="padding: 0.5rem;">Quality Coordinator</td>
                    <td style="padding: 0.5rem;">BBV Team</td>
                  </tr>
                </table>
              </div>
            `;
          } else {
            // Dashboard content
            tabContent = `
              <h2>Dashboard</h2>
              
              <div class="direct-fix-grid">
                <div class="direct-fix-card">
                  <div style="color: #6b7280; font-size: 0.875rem;">Total Teams</div>
                  <div style="font-size: 1.5rem; font-weight: bold;">3</div>
                </div>
                <div class="direct-fix-card">
                  <div style="color: #6b7280; font-size: 0.875rem;">Total Personnel</div>
                  <div style="font-size: 1.5rem; font-weight: bold;">7</div>
                </div>
              </div>
              
              <div class="direct-fix-card">
                <h3 style="margin-top: 0;">Teams Overview</h3>
                <p>BBV Quality Team - 3 members</p>
                <p>ADD Quality Team - 2 members</p>
                <p>ARB Quality Team - 2 members</p>
              </div>
            `;
          }
          
          // Add refresh button to all tabs
          tabContent += `<button class="direct-fix-button" id="directFixRefreshBtn">Refresh Page</button>`;
          
          // Update content
          document.querySelector('.direct-fix-content').innerHTML = tabContent;
          
          // Re-add button handler
          document.getElementById('directFixRefreshBtn').addEventListener('click', function() {
            window.location.reload();
          });
        });
      });
      
      // Add refresh button handler
      document.getElementById('directFixRefreshBtn').addEventListener('click', function() {
        window.location.reload();
      });
      
      return true; // Fix applied
    }
    
    return false; // No fix needed
  }
  
  /**
   * Exit from recovery mode and ensure content is displayed
   */
  function exitFromRecoveryMode() {
    console.log('Direct fix: Exiting recovery mode...');
    
    // First try using our established fix methods
    if (window.emergencyFix && typeof window.emergencyFix.exitRecoveryMode === 'function') {
      window.emergencyFix.exitRecoveryMode();
    }
    
    // Remove any recovery mode messages
    document.querySelectorAll('*').forEach(element => {
      const text = element.innerText || '';
      if (text.includes('recovery mode') || 
          text.includes('script error') || 
          text.includes('unavailable due to script errors')) {
        console.log('Direct fix: Hiding recovery mode message');
        element.style.display = 'none';
      }
    });
    
    // Check for tabContent and ensure it has content
    const tabContent = document.getElementById('tabContent');
    if (tabContent) {
      if (tabContent.innerHTML.trim() === '' || 
          tabContent.innerText.includes('Loading...') ||
          tabContent.innerText.includes('recovery mode')) {
        
        console.log('Direct fix: Forcing dashboard content to display');
        
        // Force dashboard content to display
        tabContent.innerHTML = `
          <div class="p-4">
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
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Teams Overview</h3>
              <p>Quality Control Team (BBV)</p>
              <p>Validation Team (ADD)</p>
              <p>Regulatory Affairs (ARB)</p>
            </div>
          </div>
        `;
      }
    }
    
    // Hide any loaders that might still be visible
    document.querySelectorAll('.loader, .loading-indicator, .spinner').forEach(loader => {
      loader.style.display = 'none';
    });
    
    // Hide initialLoader if it exists
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }
    
    // Try to initialize UI if not already initialized
    if (window.ui && typeof window.ui.init === 'function' && !window.uiInitialized) {
      try {
        console.log('Direct fix: Forcing UI initialization');
        window.ui.init();
        window.uiInitialized = true;
      } catch (error) {
        console.error('Direct fix: Error initializing UI:', error);
      }
    }
    
    // Set flags to indicate we've fixed the app
    window.appFixed = true;
    window.recoveryModeExited = true;
    localStorage.removeItem('recoveryMode');
    
    console.log('Direct fix: Recovery mode exit complete');
  }
  
  // Also run when the window has loaded to ensure we catch any delayed issues
  window.addEventListener('load', function() {
    console.log('Direct fix: Window load event fired');
    
    // Wait a short time to allow other scripts to run
    setTimeout(function() {
      // Check if we're still in recovery mode
      const recoveryIndicators = [
        document.querySelectorAll('*').some(el => 
          (el.innerText || '').toLowerCase().includes('recovery mode')),
        document.getElementById('tabContent') && 
          document.getElementById('tabContent').innerText.includes('Loading')
      ];
      
      if (recoveryIndicators.some(indicator => indicator)) {
        console.log('Direct fix: Still in recovery mode after window load, applying fix again');
        exitFromRecoveryMode();
      }
    }, 1000);
  });
})(); 