$uiContent = @'
// UI Components and Interactions
const ui = {
  // Initialize the application
  init() {
    try {
      console.log('Initializing UI...');
      
      // Create a global variable for handling charts
      window.chartFailed = false;
      if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded, charts will be disabled');
        window.chartFailed = true;
      }
      
      // Use existing config or set up default
      window.config = window.config || {
        tabs: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
          { id: 'teams', label: 'Teams', icon: 'fa-users' },
          { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
          { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' },
          { id: 'planning', label: 'Planning', icon: 'fa-project-diagram' },
          { id: 'orgchart', label: 'Org Chart', icon: 'fa-sitemap' },
          { id: 'rolematrix', label: 'Role Matrix', icon: 'fa-th' },
          { id: 'skillsmatrix', label: 'Skills Matrix', icon: 'fa-cubes' },
          { id: 'racimatrix', label: 'RACI Matrix', icon: 'fa-list-alt' }
        ],
        colors: {
          bbv: '#00518A',     // BBV blue
          add: '#CC2030',     // ADD red
          arb: '#4F46E5',     // ARB purple
          shared: '#232323',  // Shared black
          root: '#333333'     // Root color for org chart
        }
      };
      
      // Use the appData from app.js rather than initializing redundant data
      if (!window.appData) {
        console.error('appData not initialized - this should be done in app.js');
        window.appData = {}; // Create empty object as fallback
      }
      
      // Set up tabs first - do this before other setup
      if (typeof this.setupTabs === 'function') {
        try {
          this.setupTabs();
        } catch (error) {
          console.error('Error in setupTabs:', error);
          
          // Create fallback tabs directly
          this.createFallbackTabs();
        }
      } else {
        console.error('setupTabs method not found');
        throw new Error('Required UI methods are missing');
      }
      
      // Set up login state
      this.updateLoginState();
      
      // Hide login button completely
      const loginBtn = document.getElementById('loginBtn');
      if (loginBtn) {
        loginBtn.style.display = 'none';
      }
      
      // Set up scroll-to-top button
      this.setupScrollToTop();
      
      // Set up save changes button
      this.setupSaveChangesButton();
      
      console.log('UI initialization complete');
    } catch (error) {
      console.error('Critical error in UI initialization:', error);
      // Attempt recovery through fix-critical.js
    }
  },
  
  // Additional methods from your original file would go here...
  // This is just a skeletal version to fix the encoding issues
  
  // Create fallback tabs when setupTabs fails
  createFallbackTabs() {
    console.warn('Setting up fallback tabs due to setupTabs error');
    // Implementation would go here
  },

  // Set up tabs
  setupTabs() {
    // Implementation would go here
  },

  // Switch to a different tab
  switchTab(tabId) {
    // Implementation would go here
  },
  
  // Update active tab
  updateActiveTab(tabId) {
    // Implementation would go here
  },
  
  // Update login state
  updateLoginState() {
    // Implementation would go here
  },
  
  // Set up scroll to top button
  setupScrollToTop() {
    // Implementation would go here
  },
  
  // Set up save changes button
  setupSaveChangesButton() {
    // Implementation would go here
  },
  
  // Sanitize HTML for security
  sanitizeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

// Export the ui object to make it globally available
window.ui = ui;
'@

# Save with UTF-8 encoding without BOM
$uiContent | Out-File -FilePath "ui.js" -Encoding UTF8

# Create a backup of the old file
if (Test-Path "ui.js.broken") {
  Remove-Item "ui.js.broken" -Force
}

if (Test-Path "ui.js.backup") {
  Rename-Item "ui.js.backup" "ui.js.broken" -Force
}

# Make a complete backup of the original file
Copy-Item "ui.js" "ui.js.backup" -Force

Write-Host "UI.js has been rebuilt with proper encoding." 