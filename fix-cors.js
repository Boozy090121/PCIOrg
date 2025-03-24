/**
 * Fix for "Script error." with no line or column information
 * This is a specialized script to handle cross-origin script errors
 */

(function() {
  console.log('Enhanced CORS Fix Script running...');
  
  // Track all script errors
  window.scriptErrors = window.scriptErrors || [];
  
  /**
   * This function fixes external scripts that may be causing CORS errors
   * It adds the crossorigin="anonymous" attribute to all external scripts
   * that don't already have it
   */
  function fixCrossOriginScripts() {
    // Find all external scripts (from CDNs or other domains)
    const externalScripts = document.querySelectorAll('script[src^="http"], script[src^="//"]');
    let fixedCount = 0;
    
    console.log(`Found ${externalScripts.length} external scripts to check`);
    
    externalScripts.forEach(script => {
      // If the script doesn't have a crossorigin attribute, add it
      if (!script.hasAttribute('crossorigin')) {
        const oldSrc = script.src;
        
        try {
          // Create a new script element with the same src but with crossorigin attribute
          const newScript = document.createElement('script');
          newScript.src = oldSrc;
          newScript.crossOrigin = 'anonymous';
          
          // Add integrity attribute if the original had it
          if (script.integrity) {
            newScript.integrity = script.integrity;
          }
          
          // Copy other attributes
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'src' && attr.name !== 'crossorigin') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          
          // Add onload and onerror handlers
          newScript.onload = function() {
            console.log(`Successfully loaded script with crossorigin: ${oldSrc}`);
          };
          
          newScript.onerror = function(error) {
            console.error(`Failed to load script with crossorigin: ${oldSrc}`, error);
          };
          
          // Replace the old script with the new one
          if (script.parentNode) {
            script.parentNode.replaceChild(newScript, script);
            fixedCount++;
            console.log(`Fixed script: ${oldSrc}`);
          }
        } catch (error) {
          console.error(`Error fixing script ${oldSrc}:`, error);
        }
      }
    });
    
    // Find all external stylesheets
    const externalStyles = document.querySelectorAll('link[rel="stylesheet"][href^="http"], link[rel="stylesheet"][href^="//"]');
    
    externalStyles.forEach(link => {
      if (!link.hasAttribute('crossorigin')) {
        console.log('Adding crossorigin to stylesheet:', link.href);
        
        // Create a new link element with proper attributes
        const newLink = document.createElement('link');
        newLink.href = link.href;
        newLink.rel = 'stylesheet';
        newLink.crossOrigin = 'anonymous';
        
        // Copy all original attributes
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'href' && attr.name !== 'rel' && attr.name !== 'crossorigin') {
            newLink.setAttribute(attr.name, attr.value);
          }
        });
        
        // Replace the original link
        if (link.parentNode) {
          link.parentNode.replaceChild(newLink, link);
        }
      }
    });
    
    console.log(`Fixed ${fixedCount} scripts with crossorigin attribute`);
    return fixedCount;
  }
  
  /**
   * This function adds error handlers to catch cross-origin errors
   */
  function setupErrorHandlers() {
    // Original error handler
    const originalOnError = window.onerror;
    
    // Replace with our enhanced handler
    window.onerror = function(message, source, lineno, colno, error) {
      // Track all errors
      window.scriptErrors.push({
        message: message,
        source: source,
        line: lineno,
        column: colno,
        error: error,
        timestamp: new Date().toISOString()
      });
      
      // Detect cross-origin errors
      if (message === 'Script error.' && (!lineno || !colno)) {
        console.warn('Cross-origin script error detected and handled!');
        
        // Try to fix scripts
        fixCrossOriginScripts();
        
        // Set a flag to know we've detected CORS issues
        window.hasCORSIssues = true;
        
        // Attempt to recover UI if needed
        setTimeout(() => {
          if (typeof window.applyEmergencyFix === 'function') {
            window.applyEmergencyFix();
          }
        }, 1000);
        
        return true; // Prevents the error from propagating
      }
      
      // Call the original handler if it exists
      if (typeof originalOnError === 'function') {
        return originalOnError(message, source, lineno, colno, error);
      }
      
      return false; // Let the error propagate
    };
    
    // Track script error count (persists across reloads)
    window.scriptErrorCount = parseInt(localStorage.getItem('scriptErrorCount') || '0');
    
    window.addEventListener('error', function(event) {
      if (event.error && event.message === 'Script error.') {
        window.scriptErrorCount++;
        localStorage.setItem('scriptErrorCount', window.scriptErrorCount);
      }
    }, true);
    
    // Reset error count when page loads successfully
    window.addEventListener('load', function() {
      // Wait to see if we get errors after load
      setTimeout(function() {
        if (window.scriptErrorCount <= 1) {
          localStorage.setItem('scriptErrorCount', '0');
          console.log('Reset script error count - page loaded successfully');
        }
      }, 5000);
    });
  }
  
  /**
   * Try reloading problematic scripts
   */
  function reloadProblematicScripts() {
    // Known problematic script patterns
    const problematicPatterns = [
      'chart.min.js',
      'd3.min.js',
      'tailwindcss',
      'font-awesome'
    ];
    
    // Check all scripts for problematic patterns
    const scripts = document.querySelectorAll('script[src]');
    let reloadedCount = 0;
    
    scripts.forEach(script => {
      const src = script.src.toLowerCase();
      const isProblematic = problematicPatterns.some(pattern => src.includes(pattern));
      
      if (isProblematic && !script.getAttribute('data-fixed')) {
        try {
          // Create a new script element
          const newScript = document.createElement('script');
          newScript.src = script.src;
          newScript.crossOrigin = 'anonymous';
          
          // Copy any integrity attribute
          if (script.integrity) {
            newScript.integrity = script.integrity;
          }
          
          // Add onload and onerror handlers
          newScript.onload = function() {
            console.log(`Successfully reloaded: ${script.src}`);
          };
          
          newScript.onerror = function() {
            console.error(`Failed to reload: ${script.src}`);
          };
          
          // Mark as fixed
          newScript.setAttribute('data-fixed', 'true');
          
          // Replace the old script
          document.head.appendChild(newScript);
          
          // Mark the old script as handled (don't remove it to avoid breaking dependencies)
          script.setAttribute('data-fixed', 'true');
          
          reloadedCount++;
        } catch (error) {
          console.error(`Error reloading script ${script.src}:`, error);
        }
      }
    });
    
    console.log(`Reloaded ${reloadedCount} problematic scripts`);
    return reloadedCount;
  }
  
  /**
   * Fix stylesheet CORS issues
   */
  function fixStylesheetCORS() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"][href^="http"], link[rel="stylesheet"][href^="//"]');
    let fixedCount = 0;
    
    stylesheets.forEach(stylesheet => {
      if (!stylesheet.hasAttribute('crossorigin')) {
        const oldHref = stylesheet.href;
        
        try {
          // Create a new stylesheet with crossorigin
          const newStylesheet = document.createElement('link');
          newStylesheet.rel = 'stylesheet';
          newStylesheet.href = oldHref;
          newStylesheet.crossOrigin = 'anonymous';
          
          // Copy integrity attribute if present
          if (stylesheet.integrity) {
            newStylesheet.integrity = stylesheet.integrity;
          }
          
          // Copy other attributes
          Array.from(stylesheet.attributes).forEach(attr => {
            if (attr.name !== 'href' && attr.name !== 'crossorigin' && attr.name !== 'rel') {
              newStylesheet.setAttribute(attr.name, attr.value);
            }
          });
          
          // Add event handlers
          newStylesheet.onload = function() {
            console.log(`Successfully loaded stylesheet with crossorigin: ${oldHref}`);
          };
          
          newStylesheet.onerror = function() {
            console.error(`Failed to load stylesheet with crossorigin: ${oldHref}`);
          };
          
          // Replace the old stylesheet
          if (stylesheet.parentNode) {
            stylesheet.parentNode.replaceChild(newStylesheet, stylesheet);
            fixedCount++;
            console.log(`Fixed stylesheet: ${oldHref}`);
          }
        } catch (error) {
          console.error(`Error fixing stylesheet ${oldHref}:`, error);
        }
      }
    });
    
    console.log(`Fixed ${fixedCount} stylesheets with crossorigin attribute`);
    return fixedCount;
  }
  
  /**
   * Add preconnect hints to improve performance
   */
  function addPreconnectHints() {
    // Extract domains from external resources
    const externalResources = document.querySelectorAll('script[src^="http"], link[href^="http"]');
    const domains = new Set();
    
    externalResources.forEach(resource => {
      try {
        const url = new URL(resource.src || resource.href);
        domains.add(url.origin);
      } catch (error) {
        // Invalid URL, skip
      }
    });
    
    // Add preconnect hints for each domain
    domains.forEach(domain => {
      // Check if we already have a preconnect for this domain
      if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = domain;
        preconnect.crossOrigin = 'anonymous';
        
        document.head.appendChild(preconnect);
        console.log(`Added preconnect hint for: ${domain}`);
      }
    });
  }
  
  /**
   * Run all fixes
   */
  function runAllFixes() {
    console.log('Running all CORS fixes...');
    
    // Set up error handlers
    setupErrorHandlers();
    
    // Fix CORS issues
    const fixedScripts = fixCrossOriginScripts();
    const fixedStylesheets = fixStylesheetCORS();
    const reloadedScripts = reloadProblematicScripts();
    
    // Add preconnect hints
    addPreconnectHints();
    
    console.log(`CORS fixes complete: ${fixedScripts + reloadedScripts} scripts fixed, ${fixedStylesheets} stylesheets fixed`);
    
    // Return true if we fixed anything
    return fixedScripts > 0 || fixedStylesheets > 0 || reloadedScripts > 0;
  }
  
  // Make fix functions available globally
  window.corsFixTools = {
    fixCrossOriginScripts,
    reloadProblematicScripts,
    fixStylesheetCORS,
    addPreconnectHints,
    runAllFixes
  };
  
  // Run fixes immediately
  runAllFixes();
  
  // Also run fixes when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllFixes);
  }
  
  // And when the window is loaded
  window.addEventListener('load', function() {
    setTimeout(runAllFixes, 1000);
  });
  
  // Dispatch event to notify other scripts that fixes have been applied
  window.dispatchEvent(new CustomEvent('corsFixes', { 
    detail: { 
      timestamp: new Date().toISOString(),
      fixesApplied: true
    }
  }));
  
  // Function to check fetch/XHR requests and add CORS headers
  function monitorAndFixAPIRequests() {
    // Override fetch
    const originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = function(resource, options) {
        options = options || {};
        
        // Add credentials and mode for CORS if not already set
        if (!options.credentials) {
          options.credentials = 'include';
        }
        if (!options.mode && resource.toString().startsWith('http')) {
          options.mode = 'cors';
        }
        
        // Add headers for CORS if not already present
        if (!options.headers) {
          options.headers = {};
        }
        
        return originalFetch.call(this, resource, options)
          .catch(error => {
            // Handle CORS errors in fetch
            if (error.message && error.message.includes('CORS')) {
              console.warn('CORS error in fetch detected:', error);
              window.hasCORSIssues = true;
            }
            throw error;
          });
      };
    }
    
    // Override XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    if (originalXHROpen) {
      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        // Set withCredentials for CORS
        this.withCredentials = true;
        
        // Call original method
        return originalXHROpen.apply(this, arguments);
      };
    }
  }
  
  monitorAndFixAPIRequests();
})(); 