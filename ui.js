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
      
      // Hide any emergency mode messages
      this.hideEmergencyMode();
      
      console.log('UI initialization complete');
    } catch (error) {
      console.error('Critical error in UI initialization:', error);
      // Attempt recovery through fix-critical.js
      if (typeof window.fixCritical === 'function') {
        window.fixCritical();
      }
    }
  },
  
  // Additional methods from your original file would go here...
  // This is just a skeletal version to fix the encoding issues
  
  // Create fallback tabs when setupTabs fails
  createFallbackTabs() {
    console.warn('Setting up fallback tabs due to setupTabs error');
    const tabContainer = document.getElementById('tabList') || document.createElement('div');
    tabContainer.id = 'tabList';
    tabContainer.className = 'tab-list';
    
    // Create tabs from config
    if (window.config && window.config.tabs) {
      window.config.tabs.forEach(tab => {
        const button = document.createElement('button');
        button.className = 'tab-btn';
        button.setAttribute('data-tab', tab.id);
        button.innerHTML = `<i class="fas ${tab.icon}"></i> ${this.sanitizeHtml(tab.label)}`;
        button.onclick = () => this.switchTab(tab.id);
        tabContainer.appendChild(button);
      });
    }
    
    // Add to document if not already there
    if (!document.getElementById('tabList')) {
      document.body.insertBefore(tabContainer, document.body.firstChild);
    }
  },

  // Set up tabs
  setupTabs() {
    const tabContainer = document.getElementById('tabList');
    if (!tabContainer) {
      this.createFallbackTabs();
      return;
    }
    
    // Clear existing tabs
    tabContainer.innerHTML = '';
    
    // Create tabs from config
    window.config.tabs.forEach(tab => {
      const button = document.createElement('button');
      button.className = 'tab-btn';
      button.setAttribute('data-tab', tab.id);
      button.innerHTML = `<i class="fas ${tab.icon}"></i> ${this.sanitizeHtml(tab.label)}`;
      button.onclick = () => this.switchTab(tab.id);
      tabContainer.appendChild(button);
    });
    
    // Set initial active tab
    const initialTab = window.appData?.state?.currentTab || 'dashboard';
    this.switchTab(initialTab);
  },

  // Switch to a different tab
  switchTab(tabId) {
    // Update active tab state
    this.updateActiveTab(tabId);
    
    // Update app state
    if (window.appData && window.appData.state) {
      window.appData.state.currentTab = tabId;
    }
    
    // Get or create tab content container
    let tabContent = document.getElementById('tabContent');
    if (!tabContent) {
      tabContent = document.createElement('div');
      tabContent.id = 'tabContent';
      document.body.appendChild(tabContent);
    }
    
    // Clear existing content
    tabContent.innerHTML = '';
    
    // Add loading indicator
    tabContent.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading ${this.sanitizeHtml(tabId)} content...</p>
      </div>
    `;
    
    // Load tab content
    try {
      const contentFunction = this[`load${tabId.charAt(0).toUpperCase() + tabId.slice(1)}Content`];
      if (typeof contentFunction === 'function') {
        contentFunction.call(this);
      } else {
        tabContent.innerHTML = `<div class="tab-content">Content for ${this.sanitizeHtml(tabId)} is coming soon.</div>`;
      }
    } catch (error) {
      console.error(`Error loading content for tab ${tabId}:`, error);
      tabContent.innerHTML = `<div class="error-message">Error loading content. Please try again.</div>`;
    }
  },
  
  // Update active tab
  updateActiveTab(tabId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Add active class to selected tab
    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }
  },
  
  // Update login state
  updateLoginState() {
    const userInfo = document.getElementById('userInfo');
    if (!userInfo) return;
    
    if (window.appData && window.appData.state && window.appData.state.isLoggedIn) {
      userInfo.innerHTML = `
        <span class="user-name">${this.sanitizeHtml(window.appData.state.userName || 'User')}</span>
        <span class="user-role">${this.sanitizeHtml(window.appData.state.userRole || 'User')}</span>
      `;
    } else {
      userInfo.innerHTML = '<button id="loginBtn">Login</button>';
    }
  },
  
  // Set up scroll to top button
  setupScrollToTop() {
    let scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) {
      scrollBtn = document.createElement('button');
      scrollBtn.id = 'scrollTopBtn';
      scrollBtn.className = 'scroll-top-btn';
      scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      document.body.appendChild(scrollBtn);
    }
    
    scrollBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Show/hide button based on scroll position
    window.onscroll = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = 'block';
      } else {
        scrollBtn.style.display = 'none';
      }
    };
  },
  
  // Set up save changes button
  setupSaveChangesButton() {
    let saveBtn = document.getElementById('saveChangesBtn');
    if (!saveBtn) {
      saveBtn = document.createElement('button');
      saveBtn.id = 'saveChangesBtn';
      saveBtn.className = 'save-changes-btn';
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
      document.body.appendChild(saveBtn);
    }
    
    saveBtn.onclick = () => {
      try {
        // Save app data to localStorage
        localStorage.setItem('appData', JSON.stringify(window.appData));
        this.showToast('Changes saved successfully', 'success');
      } catch (error) {
        console.error('Error saving changes:', error);
        this.showToast('Error saving changes', 'error');
      }
    };
  },
  
  // Hide emergency mode messages and indicators
  hideEmergencyMode() {
    // Hide any error dialogs
    const errorDialog = document.getElementById('errorDialog');
    if (errorDialog) {
      errorDialog.style.display = 'none';
    }
    
    const errorBackdrop = document.getElementById('errorDialogBackdrop');
    if (errorBackdrop) {
      errorBackdrop.style.display = 'none';
    }
    
    // Hide any loading indicators
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }
    
    // Hide any emergency messages
    document.querySelectorAll('.error-message, .emergency-mode').forEach(element => {
      element.style.display = 'none';
    });
  },
  
  // Show toast message
  showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
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
  },

  // Load dashboard content
  loadDashboardContent() {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;

    const teams = window.appData?.teams || [];
    const activities = window.appData?.activities || [];

    tabContent.innerHTML = `
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h2>Quality Organization Dashboard</h2>
        </div>
        
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>Teams Overview</h3>
            <div class="teams-summary">
              ${teams.map(team => `
                <div class="team-item ${team.stream}">
                  <span class="team-name">${this.sanitizeHtml(team.name)}</span>
                  <span class="team-count">${team.personnel ? team.personnel.length : 0} members</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="dashboard-card">
            <h3>Recent Activities</h3>
            <div class="activities-list">
              ${activities.map(activity => `
                <div class="activity-item">
                  <div class="activity-header">
                    <span class="activity-type">${this.sanitizeHtml(activity.type)}</span>
                    <span class="activity-date">${new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div class="activity-body">
                    <p>${this.sanitizeHtml(activity.description)}</p>
                    <span class="activity-team">${this.sanitizeHtml(activity.team)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Load teams content
  loadTeamsContent() {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;

    const teams = window.appData?.teams || [];

    tabContent.innerHTML = `
      <div class="teams-container">
        <div class="teams-header">
          <h2>Quality Teams</h2>
          <button class="add-team-btn" onclick="ui.showAddTeamDialog()">
            <i class="fas fa-plus"></i> Add Team
          </button>
        </div>
        
        <div class="teams-grid">
          ${teams.map(team => `
            <div class="team-card ${team.stream}">
              <div class="team-card-header">
                <h3>${this.sanitizeHtml(team.name)}</h3>
                <span class="team-stream">${this.sanitizeHtml(team.stream.toUpperCase())}</span>
              </div>
              <div class="team-card-body">
                <p>${this.sanitizeHtml(team.description || '')}</p>
                <div class="team-stats">
                  <div class="stat">
                    <span class="stat-label">Members</span>
                    <span class="stat-value">${team.personnel ? team.personnel.length : 0}</span>
                  </div>
                  ${team.performance ? `
                    <div class="stat">
                      <span class="stat-label">Performance</span>
                      <span class="stat-value">${team.performance}%</span>
                    </div>
                  ` : ''}
                </div>
                <div class="team-personnel">
                  <h4>Team Members</h4>
                  <ul>
                    ${team.personnel ? team.personnel.map(person => `
                      <li>
                        <span class="person-name">${this.sanitizeHtml(person.name)}</span>
                        <span class="person-role">${this.sanitizeHtml(person.role)}</span>
                      </li>
                    `).join('') : ''}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // Load personnel content
  loadPersonnelContent() {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;

    // Collect all personnel from teams
    const teams = window.appData?.teams || [];
    const personnel = teams.reduce((acc, team) => {
      if (team.personnel) {
        acc.push(...team.personnel.map(person => ({
          ...person,
          team: team.name,
          stream: team.stream
        })));
      }
      return acc;
    }, []);

    tabContent.innerHTML = `
      <div class="personnel-container">
        <div class="personnel-header">
          <h2>Personnel Directory</h2>
          <div class="personnel-filters">
            <input type="text" id="personnelSearch" placeholder="Search personnel..." 
                   onkeyup="ui.filterPersonnel()">
            <select id="streamFilter" onchange="ui.filterPersonnel()">
              <option value="">All Streams</option>
              <option value="bbv">BBV</option>
              <option value="add">ADD</option>
              <option value="arb">ARB</option>
            </select>
          </div>
        </div>
        
        <div class="personnel-grid">
          ${personnel.map(person => `
            <div class="person-card ${person.stream}" data-name="${this.sanitizeHtml(person.name.toLowerCase())}">
              <div class="person-header">
                <i class="fas fa-user-circle"></i>
                <h3>${this.sanitizeHtml(person.name)}</h3>
              </div>
              <div class="person-body">
                <div class="person-info">
                  <p><strong>Role:</strong> ${this.sanitizeHtml(person.role)}</p>
                  <p><strong>Team:</strong> ${this.sanitizeHtml(person.team)}</p>
                  ${person.client ? `<p><strong>Client:</strong> ${this.sanitizeHtml(person.client)}</p>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // Filter personnel based on search and stream
  filterPersonnel() {
    const search = document.getElementById('personnelSearch')?.value.toLowerCase() || '';
    const stream = document.getElementById('streamFilter')?.value || '';
    
    document.querySelectorAll('.person-card').forEach(card => {
      const name = card.getAttribute('data-name');
      const matchesSearch = name.includes(search);
      const matchesStream = !stream || card.classList.contains(stream);
      
      card.style.display = matchesSearch && matchesStream ? 'block' : 'none';
    });
  },

  // Show add team dialog
  showAddTeamDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'modal';
    dialog.innerHTML = `
      <div class="modal-content">
        <h2>Add New Team</h2>
        <form id="addTeamForm">
          <div class="form-group">
            <label for="teamName">Team Name</label>
            <input type="text" id="teamName" required>
          </div>
          <div class="form-group">
            <label for="teamStream">Stream</label>
            <select id="teamStream" required>
              <option value="bbv">BBV</option>
              <option value="add">ADD</option>
              <option value="arb">ARB</option>
            </select>
          </div>
          <div class="form-group">
            <label for="teamDescription">Description</label>
            <textarea id="teamDescription" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
            <button type="submit">Add Team</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('addTeamForm').onsubmit = (e) => {
      e.preventDefault();
      const newTeam = {
        id: Date.now(),
        name: document.getElementById('teamName').value,
        stream: document.getElementById('teamStream').value,
        description: document.getElementById('teamDescription').value,
        personnel: []
      };
      
      window.appData.teams = window.appData.teams || [];
      window.appData.teams.push(newTeam);
      
      dialog.remove();
      this.loadTeamsContent();
      this.showToast('Team added successfully', 'success');
    };
  }
};

// Export the ui object to make it globally available
window.ui = ui;

// Initialize UI when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ui.init();
});
