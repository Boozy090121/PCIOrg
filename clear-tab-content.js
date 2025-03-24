/**
 * Critical tab content clearing script
 * This script ensures that tab content is properly cleared and reset when switching tabs
 */

(function() {
  console.log('Loading tab content clearing script...');
  
  // Create a global namespace for the utility functions
  window.tabContentUtils = window.tabContentUtils || {};
  
  // Add a flag to track initialization state
  window.tabContentUtils.initialized = false;
  
  // Function to force clear all content containers
  window.tabContentUtils.clearAll = function() {
    console.log('Clearing all content containers');
    
    // List of all possible content container IDs
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
    
    console.log('All content containers cleared');
    return true;
  };
  
  // Function to reset tab UI to a known good state
  window.tabContentUtils.resetTabUI = function() {
    console.log('Resetting tab UI to known good state');
    
    // Clear all content first
    window.tabContentUtils.clearAll();
    
    // Make sure tabContent exists
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
      console.error('Main content container not found');
      return false;
    }
    
    // Check if tabContent exists
    let tabContent = document.getElementById('tabContent');
    
    // If it doesn't exist, create it
    if (!tabContent) {
      console.log('Creating tabContent container');
      tabContent = document.createElement('div');
      tabContent.id = 'tabContent';
      tabContent.className = 'tab-content';
      
      // Append it to the main content
      mainContent.appendChild(tabContent);
    }
    
    // Make sure any related elements are in a proper state
    const tabContainer = document.getElementById('tabContainer');
    if (tabContainer) {
      tabContainer.style.display = 'none';
    }
    
    return tabContent;
  };
  
  // Function to patch the UI object
  window.tabContentUtils.patchUIObject = function() {
    if (!window.ui) {
      console.log('UI object not found, will retry patching later');
      setTimeout(window.tabContentUtils.patchUIObject, 100); // Retry after 100ms
      return;
    }
    
    try {
      // Patch the UI object
      window.ui.clearTabContent = window.ui.clearTabContent || function() {
        const tabContent = document.getElementById('tabContent');
        if (tabContent) {
          while (tabContent.firstChild) {
            tabContent.removeChild(tabContent.firstChild);
          }
        }
      };
      console.log('Successfully patched UI object with clearTabContent');
    } catch (error) {
      console.error('Error patching UI object:', error);
    }
  };
  
  // Add a global error handler for tab switching - only after initialization is complete
  // This will prevent showing error recovery messages during normal startup
  let errorHandlerAdded = false;
  
  function addErrorHandler() {
    // Only add the handler once
    if (errorHandlerAdded) return;
    
    // Give the application time to initialize before adding error monitoring
    setTimeout(() => {
      window.addEventListener('error', function(event) {
        // Only handle errors after initialization and only for tab-related issues
        if (window.tabContentUtils.initialized && 
            event.error && event.error.message && 
            (event.error.message.includes('tab') || event.error.message.includes('content'))) {
          console.error('Tab-related error detected:', event.error);
          
          try {
            // Reset the tab UI
            window.tabContentUtils.resetTabUI();
            
            // Try to force-switch to dashboard
            if (window.forceSwitchTab) {
              window.forceSwitchTab('dashboard');
            } else if (window.ui && window.ui.switchTab) {
              window.ui.switchTab('dashboard');
            }
          } catch (recoveryError) {
            console.error('Failed to recover from tab error:', recoveryError);
          }
        }
      });
      
      errorHandlerAdded = true;
      console.log('Tab error handler registered');
    }, 3000); // Wait 3 seconds before starting to monitor for errors
  }
  
  // Make our clearAll function globally available for compatibility
  window.forceResetAllContent = window.tabContentUtils.clearAll;
  
  // Start patching process when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    window.tabContentUtils.patchUIObject();
    // Add error handler after DOM is loaded
    addErrorHandler();
  });
  
  // Try to patch it now as well in case the DOM is already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    window.tabContentUtils.patchUIObject();
    // Add error handler if DOM is already loaded
    addErrorHandler();
  }
  
  console.log('Tab content clearing script loaded successfully');
})(); 