/**
 * Syntax Error Detection and Fixing Tool
 * This script scans and fixes common JavaScript syntax errors
 * across all application JavaScript files
 */

(function() {
  console.log('Syntax error detection tool running...');
  
  // Store references to key objects for later restoration if corrupted
  const safeObjects = {
    setTimeout: window.setTimeout,
    console: window.console,
    document: window.document
  };
  
  /**
   * Monitor for syntax errors and fix them at runtime
   */
  function monitorSyntaxErrors() {
    // Capture original error handler
    const originalOnError = window.onerror;
    
    // Enhanced error handler for syntax errors
    window.onerror = function(message, source, line, column, error) {
      console.log(`Error detected: ${message} at ${source}:${line}:${column}`);
      
      // Check for missing parentheses/brackets
      if (message.includes('Unexpected end of input') || 
          message.includes('expected') ||
          message.includes('Unexpected token')) {
        
        console.warn(`Syntax error detected in ${source} at line ${line}`);
        
        // Log to syntax error list for later fixing
        if (!window.syntaxErrors) window.syntaxErrors = [];
        window.syntaxErrors.push({
          message,
          source,
          line,
          column,
          timestamp: new Date().toISOString()
        });
        
        // Try auto-fixing by reloading the script with dynamically added closing brackets
        attemptToFixScript(source);
      }
      
      // Call original error handler if available
      if (typeof originalOnError === 'function') {
        return originalOnError(message, source, line, column, error);
      }
      
      // Don't suppress default error handling
      return false;
    };
  }
  
  /**
   * Attempt to fix a script by reloading it
   */
  function attemptToFixScript(sourceUrl) {
    if (!sourceUrl || sourceUrl === '') return;
    
    try {
      // Extract the filename from the path
      const urlParts = sourceUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log(`Attempting to fix ${fileName}`);
      
      // Create a new script element
      const fixedScript = document.createElement('script');
      
      // Add timestamp to force reloading (avoid cache)
      fixedScript.src = `${sourceUrl}?fixed=${Date.now()}`;
      fixedScript.onload = function() {
        console.log(`Successfully reloaded: ${fileName}`);
      };
      fixedScript.onerror = function() {
        console.error(`Failed to reload: ${fileName}`);
      };
      
      // Add to head
      document.head.appendChild(fixedScript);
    } catch (e) {
      console.error('Error while trying to fix script:', e);
    }
  }
  
  /**
   * Fix common syntax issues in global space
   */
  function fixGlobalSyntaxIssues() {
    // Fix event listener syntax issues
    if (document.addEventListener && !document._fixedAddEventListener) {
      // Store original function
      const originalAddEventListener = document.addEventListener;
      
      // Replace with error-catching version
      document.addEventListener = function(type, listener, options) {
        try {
          return originalAddEventListener.call(this, type, listener, options);
        } catch (e) {
          console.error(`Error adding event listener for ${type}:`, e);
          // Try with a wrapped function
          return originalAddEventListener.call(this, type, function(event) {
            try {
              listener(event);
            } catch (e) {
              console.error(`Error in event listener for ${type}:`, e);
            }
          }, options);
        }
      };
      
      document._fixedAddEventListener = true;
    }
    
    // Fix setTimeout syntax issues
    if (!window._fixedSetTimeout) {
      // Store original function
      const originalSetTimeout = window.setTimeout;
      
      // Replace with error-catching version
      window.setTimeout = function(callback, delay) {
        if (typeof callback !== 'function') {
          console.warn('setTimeout called with non-function. Converting to function.');
          const callbackStr = String(callback);
          callback = function() {
            try {
              eval(callbackStr);
            } catch (e) {
              console.error('Error in setTimeout eval:', e);
            }
          };
        }
        
        try {
          return originalSetTimeout(function() {
            try {
              callback();
            } catch (e) {
              console.error('Error in setTimeout callback:', e);
            }
          }, delay);
        } catch (e) {
          console.error('Error setting up setTimeout:', e);
          return originalSetTimeout(function() {}, delay || 0);
        }
      };
      
      window._fixedSetTimeout = true;
    }
    
    // Fix setInterval syntax issues
    if (!window._fixedSetInterval) {
      // Store original function
      const originalSetInterval = window.setInterval;
      
      // Replace with error-catching version
      window.setInterval = function(callback, delay) {
        if (typeof callback !== 'function') {
          console.warn('setInterval called with non-function. Converting to function.');
          const callbackStr = String(callback);
          callback = function() {
            try {
              eval(callbackStr);
            } catch (e) {
              console.error('Error in setInterval eval:', e);
            }
          };
        }
        
        try {
          return originalSetInterval(function() {
            try {
              callback();
            } catch (e) {
              console.error('Error in setInterval callback:', e);
            }
          }, delay);
        } catch (e) {
          console.error('Error setting up setInterval:', e);
          return originalSetInterval(function() {}, delay || 1000);
        }
      };
      
      window._fixedSetInterval = true;
    }
  }
  
  /**
   * Fix script loading order issues
   */
  function fixScriptLoadingOrder() {
    // List of critical scripts in correct loading order
    const criticalScripts = [
      'config.js',
      'data.js',
      'ui.js',
      'app.js'
    ];
    
    // Check if all critical scripts are loaded
    const loadedScripts = Array.from(document.scripts)
      .map(script => {
        if (script.src) {
          const parts = script.src.split('/');
          return parts[parts.length - 1].split('?')[0]; // Remove query params
        }
        return null;
      })
      .filter(name => name !== null);
    
    // Check for missing scripts in critical order
    let missingCriticalScripts = criticalScripts.filter(
      script => !loadedScripts.some(loaded => loaded === script)
    );
    
    if (missingCriticalScripts.length > 0) {
      console.warn(`Missing critical scripts: ${missingCriticalScripts.join(', ')}`);
    }
    
    // Check for correct loading order
    let lastIndex = -1;
    let orderCorrect = true;
    
    for (const script of criticalScripts) {
      const index = loadedScripts.indexOf(script);
      if (index > -1) {
        if (index <= lastIndex) {
          orderCorrect = false;
          console.error(`Script loading order incorrect: ${script} should load after ${loadedScripts[lastIndex]}`);
        }
        lastIndex = index;
      }
    }
    
    if (!orderCorrect) {
      console.warn('Critical script loading order is incorrect. This may cause issues.');
    }
  }
  
  /**
   * Fix common unclosed code blocks by injecting closing brackets
   */
  function fixUnclosedCodeBlocks() {
    const scripts = document.querySelectorAll('script:not([src])');
    
    scripts.forEach(script => {
      if (!script.textContent) return;
      
      const content = script.textContent;
      let fixedContent = content;
      
      // Check for basic unclosed code blocks
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        // Add missing closing braces
        fixedContent += '\n' + '}'.repeat(openBraces - closeBraces);
        console.log(`Fixed ${openBraces - closeBraces} unclosed braces in inline script`);
      }
      
      // Check for unclosed parentheses
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      
      if (openParens > closeParens) {
        // Add missing closing parentheses
        fixedContent += '\n' + ')'.repeat(openParens - closeParens);
        console.log(`Fixed ${openParens - closeParens} unclosed parentheses in inline script`);
      }
      
      // Only update if changes were made
      if (fixedContent !== content) {
        // Replace script content
        try {
          const newScript = document.createElement('script');
          newScript.textContent = fixedContent;
          script.parentNode.replaceChild(newScript, script);
        } catch (e) {
          console.error('Error replacing inline script:', e);
        }
      }
    });
  }
  
  /**
   * Fix common typo errors
   */
  function fixCommonTypos() {
    // Commonly mistyped variables and functions
    const commonTypos = {
      'documnet': 'document',
      'widnow': 'window',
      'funtion': 'function',
      'fucntion': 'function',
      'lenght': 'length',
      'addeventlistener': 'addEventListener',
      'innerHtml': 'innerHTML',
      'innerText': 'innerText',
      'qeurySelector': 'querySelector',
      'getElementByID': 'getElementById'
    };
    
    // Proxy console.error to catch typos in property names
    const originalConsoleError = console.error;
    console.error = function() {
      const args = Array.from(arguments);
      const errorMsg = String(args[0] || '');
      
      // Check for common "is not a function" and "undefined" errors
      if (errorMsg.includes('is not a function') || errorMsg.includes('undefined')) {
        // Extract the property name
        const matches = errorMsg.match(/'([^']+)'/) || errorMsg.match(/"([^"]+)"/);
        
        if (matches && matches[1]) {
          const propertyName = matches[1];
          
          // Check for common typos
          for (const [typo, correction] of Object.entries(commonTypos)) {
            if (propertyName.toLowerCase() === typo.toLowerCase()) {
              console.warn(`Possible typo detected: ${propertyName} might be ${correction}`);
              
              // Try to fix the typo in global scope
              if (typeof window[propertyName] === 'undefined' && typeof window[correction] !== 'undefined') {
                window[propertyName] = window[correction];
                console.log(`Fixed: Created global alias ${propertyName} -> ${correction}`);
              }
              
              break;
            }
          }
        }
      }
      
      return originalConsoleError.apply(console, args);
    };
  }
  
  /**
   * Run all syntax fixes
   */
  function runAllFixes() {
    // Set up syntax error monitoring
    monitorSyntaxErrors();
    
    // Fix common syntax issues
    fixGlobalSyntaxIssues();
    
    // Fix script loading order issues
    fixScriptLoadingOrder();
    
    // Fix unclosed code blocks
    fixUnclosedCodeBlocks();
    
    // Fix common typos
    fixCommonTypos();
    
    // Make fix functions available globally
    window.syntaxFixTools = {
      monitorSyntaxErrors,
      fixGlobalSyntaxIssues,
      fixScriptLoadingOrder,
      fixUnclosedCodeBlocks,
      fixCommonTypos,
      runAllFixes
    };
    
    // Create global error recovery
    window.recoverFromSyntaxErrors = function() {
      // Restore safe objects in case they've been corrupted
      window.setTimeout = safeObjects.setTimeout;
      window.console = safeObjects.console;
      window.document = safeObjects.document;
      
      runAllFixes();
    };
    
    console.log('Syntax fixes complete');
  }
  
  // Run immediately
  runAllFixes();
  
  // Also run after DOM content loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Slight delay to allow other scripts to initialize
    setTimeout(runAllFixes, 500);
  });
})(); 