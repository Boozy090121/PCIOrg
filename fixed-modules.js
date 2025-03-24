// Fixed Modules Script
// This script resolves module loading issues by providing wrapper functions
// and ensuring proper global variable assignments.

console.log('Loading fixed modules...');

// Function to safely load a script and add it to head
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.async = false; // Preserve loading order
  
  // Handle load events
  script.onload = function() {
    console.log(`Successfully loaded: ${src}`);
    if (callback) callback(null, src);
  };
  
  script.onerror = function(error) {
    console.error(`Failed to load: ${src}`, error);
    if (callback) callback(error, src);
  };
  
  // Add to document
  document.head.appendChild(script);
  
  return script;
}

// Function to fix a module's global variable assignment
function fixModuleExport(moduleName, modulePath, variableName, fallbackImplementation) {
  console.log(`Fixing module: ${moduleName}`);
  
  // Create wrapper function to ensure variable exists in global scope
  window[`${moduleName}Wrapper`] = function() {
    console.log(`Running wrapper for ${moduleName}`);
    
    // Try to access the module's variable
    if (typeof window[variableName] !== 'undefined') {
      console.log(`Module ${moduleName} already exists as ${variableName}`);
      return window[variableName];
    }
    
    // Try to access with different casing
    const lowerCaseVar = variableName.toLowerCase();
    if (typeof window[lowerCaseVar] !== 'undefined') {
      console.log(`Module ${moduleName} exists as ${lowerCaseVar}, fixing casing...`);
      window[variableName] = window[lowerCaseVar];
      return window[variableName];
    }
    
    // Check if the variable exists in any other scope
    try {
      // Look for variables in the global window object
      const possibleVars = Object.keys(window).filter(key => 
        key.toLowerCase().includes(moduleName.toLowerCase())
      );
      
      if (possibleVars.length > 0) {
        console.log(`Found possible matches for ${moduleName}: ${possibleVars.join(', ')}`);
        // Use the first matching variable
        window[variableName] = window[possibleVars[0]];
        return window[variableName];
      }
    } catch (error) {
      console.error(`Error searching for ${moduleName} variable:`, error);
    }
    
    // If all else fails, use the fallback implementation
    console.log(`Using fallback implementation for ${moduleName}`);
    window[variableName] = fallbackImplementation;
    
    // Try to load the actual module script
    try {
      loadScript(modulePath, function(err) {
        if (err) {
          console.warn(`Could not load original module from ${modulePath}, using fallback permanently`);
        } else {
          console.log(`Successfully loaded ${modulePath}, checking if it defined ${variableName}`);
          // Check if the loaded script defined the expected variable
          if (typeof window[variableName] === 'undefined' || 
              window[variableName] === fallbackImplementation) {
            // Still using fallback, try to fix paths
            const altPath = modulePath.replace(/^js\//, '').replace(/^src\//, '');
            if (altPath !== modulePath) {
              console.log(`Trying alternative path: ${altPath}`);
              loadScript(altPath, function(err2) {
                if (err2) {
                  console.warn(`Could not load from alternative path ${altPath}`);
                }
              });
            }
          }
        }
      });
    } catch (e) {
      console.error(`Error attempting to load ${modulePath}:`, e);
    }
    
    return window[variableName];
  };
  
  // Return the wrapper function
  return window[`${moduleName}Wrapper`];
}

// Define fallback implementations for core modules
const configFallback = {
  init: function() {
    console.log('Fallback config.init() called');
    return Promise.resolve();
  },
  settings: {
    app: {
      name: 'Quality Re-Org & Capability Management Platform',
      version: '1.0.0'
    },
    ui: {
      theme: 'light',
      animations: true
    },
    features: {
      firebase: true,
      localStorage: true
    }
  },
  getConfig: function(key) {
    // Simple nested property getter
    return key.split('.').reduce((o, i) => o ? o[i] : undefined, this.settings);
  }
};

const uiFallback = {
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
      
      // Default to dashboard tab
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
    
    // Update tab content
    switch (tabId) {
      // Add basic tab implementations here
      default:
        // Find or create tab content element
        let tabContent = document.getElementById('tab-content');
        if (!tabContent) {
          tabContent = document.createElement('div');
          tabContent.id = 'tab-content';
          document.querySelector('.main-content').appendChild(tabContent);
        }
        
        tabContent.innerHTML = `
          <div id="${tabId}-tab-content">
            <h2>${tabId.charAt(0).toUpperCase() + tabId.slice(1)}</h2>
            <p>This module is loading...</p>
          </div>
        `;
    }
  },
  refreshAllTabs: function() {
    console.log('Refreshing all tabs');
    
    // Get current tab
    if (window.appData && window.appData.state && window.appData.state.currentTab) {
      this.switchTab(window.appData.state.currentTab);
    } else {
      this.switchTab('dashboard');
    }
  }
};

const orgChartFallback = {
  init: function() {
    console.log('Fallback orgChart.init() called');
    return Promise.resolve();
  },
  render: function(containerId) {
    console.log(`orgChart.render(${containerId}) called`);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #ffc107; margin-bottom: 15px;">
          <h3 style="color: #856404; margin-top: 0;">Organization Chart</h3>
          <p>The organization chart module is running in recovery mode.</p>
        </div>
      `;
    }
  }
};

const raciMatrixFallback = {
  init: function() {
    console.log('Fallback raciMatrix.init() called');
    return Promise.resolve();
  },
  render: function(containerId) {
    console.log(`raciMatrix.render(${containerId}) called`);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #ffc107; margin-bottom: 15px;">
          <h3 style="color: #856404; margin-top: 0;">RACI Matrix</h3>
          <p>The RACI matrix module is running in recovery mode.</p>
        </div>
      `;
    }
  }
};

// Fix the core modules
const configWrapper = fixModuleExport('config', 'js/core/config.js', 'config', configFallback);
const uiWrapper = fixModuleExport('ui', 'js/modules/ui.js', 'ui', uiFallback);
const orgChartWrapper = fixModuleExport('orgChart', 'js/modules/orgchart.js', 'orgChart', orgChartFallback);
const raciMatrixWrapper = fixModuleExport('raciMatrix', 'js/modules/racimatrix.js', 'raciMatrix', raciMatrixFallback);

// Try additional paths for the common modules
setTimeout(() => {
  if (window.ui === uiFallback) {
    loadScript('src/modules/ui.js');
    loadScript('src/ui.js');
  }
  
  if (window.config === configFallback) {
    loadScript('src/core/config.js');
    loadScript('src/config.js');
  }
}, 1000);

// Ensure the application modules are available globally
window.config = configWrapper();
window.ui = uiWrapper();
window.orgChart = orgChartWrapper();
window.raciMatrix = raciMatrixWrapper();

// Create a fixed HTML file that uses the wrapper modules
function createFixedIndexHtml() {
  // Create the HTML content by copying basic.html
  fetch('basic.html')
    .then(response => response.text())
    .then(htmlContent => {
      // Modify the HTML to include our fixed modules script
      const modifiedHtml = htmlContent.replace(
        '</head>',
        '<script src="fixed-modules.js"></script>\n</head>'
      );
      
      // Create a Blob with the modified HTML
      const blob = new Blob([modifiedHtml], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a download link
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'fixed-index.html';
      a.textContent = 'Download Fixed HTML';
      a.style.display = 'none';
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 100);
    })
    .catch(error => {
      console.error('Error creating fixed HTML:', error);
    });
}

// Create a restart script
function createRestartScript() {
  const scriptContent = `
    @echo off
    echo Starting Quality Re-Org Platform with Fixed Modules...
    echo.
    
    start fixed-index.html
    echo.
    echo If the application doesn't open automatically, please
    echo manually open fixed-index.html in your browser.
    echo.
    echo Press any key to exit...
    pause >nul
  `;
  
  // Create a Blob with the script content
  const blob = new Blob([scriptContent], { type: 'application/bat' });
  const blobUrl = URL.createObjectURL(blob);
  
  // Create a download link
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'start-fixed.bat';
  a.textContent = 'Download Fixed Starter';
  a.style.display = 'none';
  
  // Trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  }, 100);
}

// Add error event listener to catch and handle module loading errors
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.message);
  console.error('File:', event.filename);
  console.error('Line:', event.lineno);
  
  // Check if the error is related to a specific module
  const moduleNames = ['config', 'ui', 'orgChart', 'raciMatrix'];
  
  for (const moduleName of moduleNames) {
    if (event.message.includes(moduleName) || 
        (event.filename && event.filename.includes(moduleName.toLowerCase()))) {
      console.log(`Error appears to be related to ${moduleName} module, attempting fix...`);
      // Re-apply the corresponding wrapper
      if (window[`${moduleName}Wrapper`]) {
        window[moduleName] = window[`${moduleName}Wrapper`]();
      }
    }
  }
});

// Create the fixed files
createFixedIndexHtml();
createRestartScript();

console.log('Fixed modules loaded and applied');

// For interactive testing
window.fixedModules = {
  configWrapper,
  uiWrapper,
  orgChartWrapper,
  raciMatrixWrapper,
  loadScript,
  fixModuleExport,
  // Add a diagnostic function to check module status
  diagnose: function() {
    return {
      config: typeof window.config === 'object' ? 
        (window.config === configFallback ? 'using fallback' : 'loaded') : 'undefined',
      ui: typeof window.ui === 'object' ? 
        (window.ui === uiFallback ? 'using fallback' : 'loaded') : 'undefined',
      orgChart: typeof window.orgChart === 'object' ? 
        (window.orgChart === orgChartFallback ? 'using fallback' : 'loaded') : 'undefined',
      raciMatrix: typeof window.raciMatrix === 'object' ? 
        (window.raciMatrix === raciMatrixFallback ? 'using fallback' : 'loaded') : 'undefined'
    };
  }
}; 