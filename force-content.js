/**
 * Force Content Script
 * Forces content to display when normal methods fail
 */

console.log('Force content script loaded');

// Create global namespace for forcing content
window.forceContent = {
  /**
   * Force dashboard content
   */
  dashboard: function() {
    console.log('Forcing dashboard content');
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Application is in recovery mode. Some features may be limited.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">BBV Team</h3>
            <p class="text-gray-600 mb-3">Focus Factory: BBV</p>
            <div class="flex items-center">
              <div class="text-blue-500 mr-2"><i class="fas fa-users"></i></div>
              <div class="text-lg font-bold">3 Members</div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">ADD Team</h3>
            <p class="text-gray-600 mb-3">Focus Factory: ADD</p>
            <div class="flex items-center">
              <div class="text-red-500 mr-2"><i class="fas fa-users"></i></div>
              <div class="text-lg font-bold">2 Members</div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">ARB Team</h3>
            <p class="text-gray-600 mb-3">Focus Factory: ARB</p>
            <div class="flex items-center">
              <div class="text-indigo-500 mr-2"><i class="fas fa-users"></i></div>
              <div class="text-lg font-bold">2 Members</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Quality Department Reorganization</h3>
          <p>The Quality Department is being reorganized to better align with the three value streams: BBV, ADD, and ARB. This application provides tools to support this transition.</p>
        </div>
      </div>
    `;
  },
  
  /**
   * Force teams content
   */
  teams: function() {
    console.log('Forcing teams content');
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Teams</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Recovery mode active. Limited functionality available.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between">
              <h3 class="text-lg font-semibold">BBV Quality Team</h3>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">BBV</span>
            </div>
            <p class="text-gray-600 my-3">Quality team supporting BBV product line</p>
            <p class="text-sm text-gray-500 mb-2">Members: 3</p>
            <div class="flex justify-end mt-4">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Details
              </button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between">
              <h3 class="text-lg font-semibold">ADD Quality Team</h3>
              <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">ADD</span>
            </div>
            <p class="text-gray-600 my-3">Quality team supporting ADD product line</p>
            <p class="text-sm text-gray-500 mb-2">Members: 2</p>
            <div class="flex justify-end mt-4">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Details
              </button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between">
              <h3 class="text-lg font-semibold">ARB Quality Team</h3>
              <span class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">ARB</span>
            </div>
            <p class="text-gray-600 my-3">Quality team supporting ARB product line</p>
            <p class="text-sm text-gray-500 mb-2">Members: 2</p>
            <div class="flex justify-end mt-4">
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Force personnel content
   */
  personnel: function() {
    console.log('Forcing personnel content');
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Personnel</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Recovery mode active. Limited functionality available.
          </p>
        </div>
        
        <div class="mb-4">
          <input type="text" placeholder="Search personnel..." class="w-full md:w-64 px-4 py-2 border rounded-lg">
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">John Smith</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Account Manager</td>
                <td class="px-6 py-4 whitespace-nowrap">BBV Team</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Jane Doe</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Engineer</td>
                <td class="px-6 py-4 whitespace-nowrap">BBV Team</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Michael Brown</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Coordinator</td>
                <td class="px-6 py-4 whitespace-nowrap">BBV Team</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Sarah Johnson</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Account Manager</td>
                <td class="px-6 py-4 whitespace-nowrap">ADD Team</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Robert Williams</td>
                <td class="px-6 py-4 whitespace-nowrap">Document Control Specialist</td>
                <td class="px-6 py-4 whitespace-nowrap">ADD Team</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Emily Davis</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Lead</td>
                <td class="px-6 py-4 whitespace-nowrap">ARB Team</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">James Wilson</td>
                <td class="px-6 py-4 whitespace-nowrap">Quality Specialist</td>
                <td class="px-6 py-4 whitespace-nowrap">ARB Team</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
  
  /**
   * Force documentation content
   */
  documentation: function() {
    console.log('Forcing documentation content');
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Documentation</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Recovery mode active. Limited functionality available.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-3">Quality Procedures</h3>
            <ul class="space-y-2">
              <li class="flex items-center">
                <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                <span>Quality Manual v2.3</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                <span>Quality System Procedures</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                <span>Quality Control Procedures</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-3">Work Instructions</h3>
            <ul class="space-y-2">
              <li class="flex items-center">
                <i class="fas fa-file-alt text-blue-500 mr-2"></i>
                <span>Quality Inspection WI</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-file-alt text-blue-500 mr-2"></i>
                <span>Nonconformance Handling</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-file-alt text-blue-500 mr-2"></i>
                <span>Training Procedure</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-3">Training Materials</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border rounded p-3">
              <h4 class="font-medium">Quality System Overview</h4>
              <p class="text-sm text-gray-600 mt-1">Introduction to the quality system</p>
            </div>
            <div class="border rounded p-3">
              <h4 class="font-medium">Audit Preparation</h4>
              <p class="text-sm text-gray-600 mt-1">How to prepare for quality audits</p>
            </div>
            <div class="border rounded p-3">
              <h4 class="font-medium">Root Cause Analysis</h4>
              <p class="text-sm text-gray-600 mt-1">Methods for root cause analysis</p>
            </div>
            <div class="border rounded p-3">
              <h4 class="font-medium">CAPA Management</h4>
              <p class="text-sm text-gray-600 mt-1">Corrective and preventive actions</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Force role matrix content
   */
  rolematrix: function() {
    console.log('Forcing role matrix content');
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Role Matrix</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Recovery mode active. Limited functionality available.
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <p class="mb-4">The Role Matrix provides an overview of roles and responsibilities across the different teams.</p>
          <p>In recovery mode, only a simplified view is available.</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left">Role</th>
                <th class="px-4 py-2 text-center">BBV Team</th>
                <th class="px-4 py-2 text-center">ADD Team</th>
                <th class="px-4 py-2 text-center">ARB Team</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t">
                <td class="px-4 py-2 font-medium">Quality Manager</td>
                <td class="px-4 py-2 text-center">✓</td>
                <td class="px-4 py-2 text-center">✓</td>
                <td class="px-4 py-2 text-center">✓</td>
              </tr>
              <tr class="border-t">
                <td class="px-4 py-2 font-medium">Quality Engineer</td>
                <td class="px-4 py-2 text-center">✓</td>
                <td class="px-4 py-2 text-center"></td>
                <td class="px-4 py-2 text-center">✓</td>
              </tr>
              <tr class="border-t">
                <td class="px-4 py-2 font-medium">Document Control</td>
                <td class="px-4 py-2 text-center"></td>
                <td class="px-4 py-2 text-center">✓</td>
                <td class="px-4 py-2 text-center"></td>
              </tr>
              <tr class="border-t">
                <td class="px-4 py-2 font-medium">Quality Coordinator</td>
                <td class="px-4 py-2 text-center">✓</td>
                <td class="px-4 py-2 text-center"></td>
                <td class="px-4 py-2 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
  
  /**
   * Force skills matrix content
   */
  skillsmatrix: function() {
    console.log('Forcing skills matrix content');
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">Skills Matrix</h2>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="text-yellow-700">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Recovery mode active. Limited functionality available.
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <p class="mb-4">The Skills Matrix shows the skill levels across different areas for each team member.</p>
          <p>In recovery mode, only a simplified view is available.</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-center">Quality Management</th>
                <th class="px-4 py-2 text-center">Documentation</th>
                <th class="px-4 py-2 text-center">Auditing</th>
                <th class="px-4 py-2 text-center">CAPA</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t">
                <td class="px-4 py-2 font-medium">John Smith</td>
                <td class="px-4 py-2 text-center">▮▮▮▮▯</td>
                <td class="px-4 py-2 text-center">▮▮▮▯▯</td>
                <td class="px-4 py-2 text-center">▮▮▮▮▮</td>
                <td class="px-4 py-2 text-center">▮▮▮▮▯</td>
              </tr>
              <tr class="border-t">
                <td class="px-4 py-2 font-medium">Jane Doe</td>
                <td class="px-4 py-2 text-center">▮▮▯▯▯</td>
                <td class="px-4 py-2 text-center">▮▮▮▮▯</td>
                <td class="px-4 py-2 text-center">▮▯▯▯▯</td>
                <td class="px-4 py-2 text-center">▮▮▮▯▯</td>
              </tr>
              <tr class="border-t">
                <td class="px-4 py-2 font-medium">Sarah Johnson</td>
                <td class="px-4 py-2 text-center">▮▮▮▯▯</td>
                <td class="px-4 py-2 text-center">▮▮▮▮▮</td>
                <td class="px-4 py-2 text-center">▮▮▯▯▯</td>
                <td class="px-4 py-2 text-center">▮▮▯▯▯</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-6 flex justify-between items-center text-sm text-gray-500">
          <div>▮ = Skill level (1-5)</div>
          <div>Recovery mode - limited functionality</div>
        </div>
      </div>
    `;
  }
};

// Set up global force content function
window.forceRender = function(tabId) {
  console.log('Force rendering content');
  
  // If no tab specified, try to get active tab
  if (!tabId) {
    const activeTab = document.querySelector('.tab-btn.active');
    tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
  }
  
  // Force content based on tab id
  if (window.forceContent[tabId] && typeof window.forceContent[tabId] === 'function') {
    window.forceContent[tabId]();
  } else {
    // Default to dashboard if tab not supported
    window.forceContent.dashboard();
  }
};

// Register event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Check if content is loading
  const tabContent = document.getElementById('tabContent');
  if (tabContent && tabContent.innerText.includes('Loading')) {
    window.forceRender();
  }
  
  // Listen for loading timeout event
  window.addEventListener('loadingTimeout', function() {
    window.forceRender();
  });
});

// Force render on script error
window.addEventListener('error', function(event) {
  if (event.message === 'Script error.' && (!event.lineno || !event.colno)) {
    console.warn('Script error detected, forcing content render');
    setTimeout(function() {
      window.forceRender();
    }, 1000);
  }
});

// Make sure the loader is hidden
window.addEventListener('load', function() {
  const loader = document.getElementById('initialLoader');
  if (loader) {
    loader.style.display = 'none';
  }
}); 