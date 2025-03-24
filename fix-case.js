// Module case sensitivity fix
console.log('Running module case sensitivity fix...');

// Setup case-sensitivity fixes for all critical modules
(function() {
  console.log('Applying case sensitivity fixes for module names and paths...');
  
  // Map of expected module names to possible variations
  const moduleNameVariations = {
    'config': ['Config', 'CONFIG', 'configuration', 'Configuration'],
    'ui': ['UI', 'Ui', 'interface', 'Interface'],
    'orgChart': ['orgchart', 'OrgChart', 'ORGCHART', 'org-chart', 'OrganizationChart'],
    'raciMatrix': ['racimatrix', 'RaciMatrix', 'RACIMATRIX', 'raci-matrix', 'RACIMatrix']
  };
  
  // Map of expected paths to possible variations
  const pathVariations = {
    'js/core/config.js': ['js/Core/config.js', 'js/core/Config.js', 'JS/core/config.js', 'js/CORE/CONFIG.js'],
    'js/modules/ui.js': ['js/Modules/ui.js', 'js/modules/UI.js', 'JS/modules/ui.js', 'js/MODULES/UI.js'],
    'js/modules/orgchart.js': ['js/Modules/orgchart.js', 'js/modules/OrgChart.js', 'js/modules/orgChart.js'],
    'js/modules/racimatrix.js': ['js/Modules/racimatrix.js', 'js/modules/RaciMatrix.js', 'js/modules/raciMatrix.js']
  };
  
  // Handle case-insensitive module name lookups
  function normalizeModuleNames() {
    for (const [expectedName, variations] of Object.entries(moduleNameVariations)) {
      // Skip if already defined with correct name
      if (typeof window[expectedName] !== 'undefined') {
        console.log(`Module "${expectedName}" already defined correctly.`);
        continue;
      }
      
      // Check for variations
      for (const variation of variations) {
        if (typeof window[variation] !== 'undefined') {
          console.log(`Found module as "${variation}", aliasing to "${expectedName}"`);
          window[expectedName] = window[variation];
          break;
        }
      }
    }
  }
  
  // Find scripts in the document with case-sensitive paths
  function fixScriptPaths() {
    let pathsFixed = 0;
    
    document.querySelectorAll('script[src]').forEach(script => {
      const originalSrc = script.getAttribute('src');
      
      // Check for known paths
      for (const [expectedPath, variations] of Object.entries(pathVariations)) {
        if (variations.includes(originalSrc)) {
          console.log(`Found script with path "${originalSrc}", correcting to "${expectedPath}"`);
          script.setAttribute('src', expectedPath);
          pathsFixed++;
          break;
        }
      }
      
      // Apply general case normalization rules
      const normalizedSrc = normalizePathCase(originalSrc);
      if (originalSrc !== normalizedSrc) {
        console.log(`Normalizing path: ${originalSrc} → ${normalizedSrc}`);
        script.setAttribute('src', normalizedSrc);
        pathsFixed++;
      }
    });
    
    return pathsFixed;
  }
  
  // Normalize path case according to conventions
  function normalizePathCase(path) {
    if (!path) return path;
    
    // Apply general case rules
    return path
      // Directory names should be lowercase
      .replace(/(?:^|\/)(JS|SRC|CORE|MODULES)(?:\/|$)/g, (_, dir) => 
        ('/' + dir.toLowerCase() + '/').replace(/\/\//g, '/'))
      // Common module filenames should be lowercase
      .replace(/\/(CONFIG|UI|ORGCHART|RACIMATRIX)\.js$/i, (_, filename) => 
        ('/' + filename.toLowerCase() + '.js'));
  }
  
  // Attempt to dynamically load missing modules in order
  function attemptToLoadMissingModules() {
    const criticalModules = [
      { name: 'config', path: 'js/core/config.js', fallback: getConfigFallback() },
      { name: 'ui', path: 'js/modules/ui.js', fallback: getUiFallback() },
      { name: 'orgChart', path: 'js/modules/orgchart.js', fallback: getOrgChartFallback() },
      { name: 'raciMatrix', path: 'js/modules/racimatrix.js', fallback: getRaciMatrixFallback() }
    ];
    
    criticalModules.forEach(module => {
      if (typeof window[module.name] === 'undefined') {
        console.log(`Module ${module.name} not found, attempting to load from ${module.path}...`);
        
        // Try to load the module
        const script = document.createElement('script');
        script.src = module.path;
        script.async = false;
        
        script.onerror = function() {
          console.warn(`Failed to load ${module.name} from ${module.path}, using fallback`);
          window[module.name] = module.fallback;
        };
        
        document.head.appendChild(script);
        
        // Set fallback immediately to avoid blocking
        window[module.name] = module.fallback;
      }
    });
  }
  
  // Create fallback implementations for core modules
  function getConfigFallback() {
    return {
      init: function() { console.log('Fallback config.init() called'); return Promise.resolve(); },
      settings: {
        app: { name: 'Quality Re-Org Platform', version: '1.0.0' },
        ui: { theme: 'light' }
      },
      getConfig: function(key) {
        return key.split('.').reduce((o, i) => o ? o[i] : undefined, this.settings);
      }
    };
  }
  
  function getUiFallback() {
    return {
      init: function() {
        console.log('Fallback ui.init() called');
        // Set up basic tab navigation
        setTimeout(() => {
          const tabLinks = document.querySelectorAll('[data-tab]');
          tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const tabId = link.getAttribute('data-tab');
              this.switchTab(tabId);
            });
          });
          this.switchTab('dashboard');
        }, 100);
        return Promise.resolve();
      },
      switchTab: function(tabId) {
        console.log(`Switching to tab: ${tabId}`);
        // Update active tab in navigation
        document.querySelectorAll('#main-nav a').forEach(el => {
          el.classList.remove('active');
        });
        const activeTab = document.querySelector(`#main-nav a[data-tab="${tabId}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        // Update app state
        if (window.appData && window.appData.state) {
          window.appData.state.currentTab = tabId;
        }
      },
      refreshAllTabs: function() {
        console.log('Refreshing all tabs (fallback)');
        if (window.appData && window.appData.state && window.appData.state.currentTab) {
          this.switchTab(window.appData.state.currentTab);
        }
      }
    };
  }
  
  function getOrgChartFallback() {
    return {
      init: function() {
        console.log('Fallback orgChart.init() called');
        return Promise.resolve();
      },
      render: function(containerId) {
        console.log(`orgChart.render(${containerId}) called`);
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = `
            <div class="module-repair-message">
              <h3>Org Chart Module</h3>
              <p>This module is running in recovery mode.</p>
            </div>
          `;
        }
      }
    };
  }
  
  function getRaciMatrixFallback() {
    return {
      init: function() {
        console.log('Fallback raciMatrix.init() called');
        return Promise.resolve();
      },
      render: function(containerId) {
        console.log(`raciMatrix.render(${containerId}) called`);
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = `
            <div class="module-repair-message">
              <h3>RACI Matrix Module</h3>
              <p>This module is running in recovery mode.</p>
            </div>
          `;
        }
      }
    };
  }
  
  // Hook into window error events to provide better error messages
  window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.message);
    console.error('File:', event.filename);
    console.error('Line:', event.lineno);
    
    // Try to determine if this is a module loading error
    const isModuleError = event.message && (
      event.message.includes('undefined') && 
      (event.message.includes('config') || 
       event.message.includes('ui') || 
       event.message.includes('orgChart') || 
       event.message.includes('raciMatrix'))
    );
    
    if (isModuleError) {
      console.log('Detected module loading error, attempting to fix...');
      normalizeModuleNames();
      fixScriptPaths();
      attemptToLoadMissingModules();
    }
    
    // Show a more useful error message
    if (!document.getElementById('error-message-fixed')) {
      const errorDiv = document.createElement('div');
      errorDiv.id = 'error-message-fixed';
      errorDiv.style.position = 'fixed';
      errorDiv.style.bottom = '10px';
      errorDiv.style.right = '10px';
      errorDiv.style.backgroundColor = '#f8d7da';
      errorDiv.style.color = '#721c24';
      errorDiv.style.padding = '10px';
      errorDiv.style.borderRadius = '5px';
      errorDiv.style.zIndex = '9999';
      errorDiv.innerHTML = `
        <p><strong>Warning:</strong> The application is running in recovery mode.</p>
        <p>Error: ${event.message}</p>
        <button onclick="this.parentNode.remove()" style="background: none; border: none; text-decoration: underline; cursor: pointer;">Dismiss</button>
      `;
      document.body.appendChild(errorDiv);
    }
    
    event.preventDefault(); // Prevent default browser error handling
  });
  
  // Run fixes
  console.log('Applying module case sensitivity fixes...');
  normalizeModuleNames();
  const fixedPaths = fixScriptPaths();
  attemptToLoadMissingModules();
  console.log(`Case sensitivity fixes applied: ${fixedPaths} paths fixed`);
})(); 