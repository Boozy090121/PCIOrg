// Set up tabs first - do this before other setup
if (typeof this.setupTabs === 'function') {
  try {
    this.setupTabs();
  } catch (error) {
    console.error('Error in setupTabs:', error);
    
    // Create fallback tabs directly
    const tabList = document.getElementById('tabList');
    if (tabList) {
      console.warn('Setting up fallback tabs due to setupTabs error');
      // Make sure we have the config with all tabs
      const tabsConfig = window.config && window.config.tabs ? window.config.tabs : [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'teams', label: 'Teams', icon: 'fa-users' },
        { id: 'personnel', label: 'Personnel', icon: 'fa-user' },
        { id: 'documentation', label: 'Documentation', icon: 'fa-file-alt' },
        { id: 'planning', label: 'Planning', icon: 'fa-project-diagram' }
      ];
      
      // Create tab buttons
      let tabsHTML = '';
      tabsConfig.forEach((tab, index) => {
        tabsHTML += `
          <button class="tab-btn ${index === 0 ? 'active' : ''}" 
                id="tab-${tab.id}" 
                data-tab="${tab.id}" 
                role="tab" 
                aria-selected="${index === 0 ? 'true' : 'false'}" 
                aria-controls="panel-${tab.id}">
            <i class="fas ${tab.icon}" aria-hidden="true"></i>
            <span>${tab.label}</span>
          </button>
        `;
      });
      tabList.innerHTML = tabsHTML;
      
      // Add basic click handlers
      const btns = tabList.querySelectorAll('.tab-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          // Update active state on all buttons
          btns.forEach(b => {
            b.classList.toggle('active', b === btn);
            b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
          });
          // Try to switch tab
          this.switchTab(tabId);
        });
      });
    }
  }
} else {
  console.error('setupTabs method not found');
  throw new Error('Required UI methods are missing');
} 