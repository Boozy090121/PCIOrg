/**
 * Analytics Tab Functionality
 * This script provides functionality for the analytics tab
 */

(function() {
  console.log('Analytics module loading...');
  
  // Initialize analytics when document is ready
  document.addEventListener('DOMContentLoaded', initializeAnalytics);
  
  // Initialize the analytics functionality
  function initializeAnalytics() {
    console.log('Initializing analytics...');
    
    // Add analytics tab if it doesn't exist
    addAnalyticsTab();
    
    // Check if we're on the analytics tab already
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'analytics') {
      loadAnalyticsContent();
    }
    
    // Set up listeners for whenever the tab is clicked
    setupTabListeners();
  }
  
  // Add analytics tab to the tab list if it doesn't exist
  function addAnalyticsTab() {
    const tabList = document.getElementById('tabList');
    if (!tabList) return;
    
    // Check if analytics tab already exists
    if (!document.querySelector('[data-tab="analytics"]')) {
      // Create analytics tab
      const analyticsTab = document.createElement('button');
      analyticsTab.className = 'tab-btn px-4 py-2 mr-2 font-medium';
      analyticsTab.setAttribute('data-tab', 'analytics');
      analyticsTab.innerHTML = '<i class="fas fa-chart-bar mr-2"></i>Analytics';
      
      // Add to tab list
      tabList.appendChild(analyticsTab);
    }
  }
  
  // Set up listeners for tab clicks
  function setupTabListeners() {
    const analyticsTab = document.querySelector('[data-tab="analytics"]');
    if (!analyticsTab) return;
    
    analyticsTab.addEventListener('click', function() {
      // First update active state
      document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
      });
      analyticsTab.classList.add('active');
      
      // Then load content
      loadAnalyticsContent();
    });
  }
  
  // Load the analytics content
  function loadAnalyticsContent() {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) return;
    
    // Create the analytics content
    tabContent.innerHTML = createAnalyticsContent();
    
    // Initialize charts
    setTimeout(initializeCharts, 100);
  }
  
  // Create the analytics content HTML
  function createAnalyticsContent() {
    return `
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Analytics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb cursor-pointer hover:shadow-lg transition" onclick="showDetailPanel('quality-tasks')">
            <div class="text-sm text-gray-500">Total Quality Tasks</div>
            <div class="text-2xl font-bold">143</div>
            <div class="text-xs text-green-500 mt-1">↑ 12% from previous month</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb cursor-pointer hover:shadow-lg transition" onclick="showDetailPanel('capas')">
            <div class="text-sm text-gray-500">Open CAPAs</div>
            <div class="text-2xl font-bold">7</div>
            <div class="text-xs text-red-500 mt-1">↑ 2 more than last month</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb cursor-pointer hover:shadow-lg transition" onclick="showDetailPanel('audits')">
            <div class="text-sm text-gray-500">Completed Audits</div>
            <div class="text-2xl font-bold">12</div>
            <div class="text-xs text-green-500 mt-1">On track for quarterly goal</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-arb cursor-pointer hover:shadow-lg transition" onclick="showDetailPanel('quality-score')">
            <div class="text-sm text-gray-500">Average Quality Score</div>
            <div class="text-2xl font-bold">87%</div>
            <div class="text-xs text-green-500 mt-1">↑ 3% from previous quarter</div>
          </div>
        </div>
        
        <!-- Detail panels that will be shown when metrics are clicked -->
        <div id="detail-panel" class="mb-8 hidden"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Team Performance Trends</h3>
            <canvas id="teamPerformanceChart" height="250"></canvas>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Quality Tasks by Type</h3>
            <canvas id="taskTypeChart" height="250"></canvas>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">CAPA Status</h3>
            <canvas id="capaStatusChart" height="250"></canvas>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Team Distribution</h3>
            
            <h4 class="font-medium mb-3 text-gray-700">CAPA Distribution by Team</h4>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-bbv">BBV Quality Team</span>
                  <span class="text-sm">3 CAPAs</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-bbv h-2 rounded-full" style="width: 42%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-add">ADD Quality Team</span>
                  <span class="text-sm">2 CAPAs</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-add h-2 rounded-full" style="width: 29%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-arb">ARB Quality Team</span>
                  <span class="text-sm">2 CAPAs</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-arb h-2 rounded-full" style="width: 29%"></div>
                </div>
              </div>
            </div>
            
            <h4 class="font-medium mt-6 mb-3 text-gray-700">CAPA Priority Distribution</h4>
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-red-100 p-3 rounded">
                <div class="text-red-600 text-lg font-bold">2</div>
                <div class="text-sm text-gray-600">High</div>
              </div>
              <div class="bg-yellow-100 p-3 rounded">
                <div class="text-yellow-600 text-lg font-bold">3</div>
                <div class="text-sm text-gray-600">Medium</div>
              </div>
              <div class="bg-blue-100 p-3 rounded">
                <div class="text-blue-600 text-lg font-bold">2</div>
                <div class="text-sm text-gray-600">Low</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Quality Metrics Comparison</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BBV Team</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADD Team</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARB Team</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap font-medium">Audit Score</td>
                  <td class="px-6 py-4 whitespace-nowrap">75%</td>
                  <td class="px-6 py-4 whitespace-nowrap">82%</td>
                  <td class="px-6 py-4 whitespace-nowrap">90%</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap font-medium">CAPA Closure Rate</td>
                  <td class="px-6 py-4 whitespace-nowrap">68%</td>
                  <td class="px-6 py-4 whitespace-nowrap">74%</td>
                  <td class="px-6 py-4 whitespace-nowrap">88%</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap font-medium">Document Compliance</td>
                  <td class="px-6 py-4 whitespace-nowrap">92%</td>
                  <td class="px-6 py-4 whitespace-nowrap">89%</td>
                  <td class="px-6 py-4 whitespace-nowrap">95%</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap font-medium">Training Completion</td>
                  <td class="px-6 py-4 whitespace-nowrap">85%</td>
                  <td class="px-6 py-4 whitespace-nowrap">79%</td>
                  <td class="px-6 py-4 whitespace-nowrap">93%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button id="exportPdfBtn" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-opacity-90 transition mr-3">
            <i class="fas fa-file-pdf mr-2"></i> Export as PDF
          </button>
          <button id="generateReportBtn" class="bg-arb text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
            <i class="fas fa-chart-line mr-2"></i> Generate Advanced Report
          </button>
        </div>
        
        <!-- Report generation section - initially hidden -->
        <div id="report-generation-section" class="mt-6 hidden"></div>
      </div>
    `;
  }
  
  // Initialize all charts
  function initializeCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded. Loading fallback for charts...');
      showChartsFallback();
      return;
    }
    
    try {
      // Performance trend chart
      const performanceCtx = document.getElementById('teamPerformanceChart');
      if (performanceCtx) {
        new Chart(performanceCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'BBV Team',
                data: [65, 68, 72, 70, 73, 75],
                borderColor: '#00518A',
                backgroundColor: 'rgba(0, 81, 138, 0.1)',
                tension: 0.3
              },
              {
                label: 'ADD Team',
                data: [70, 75, 72, 78, 80, 82],
                borderColor: '#CC2030',
                backgroundColor: 'rgba(204, 32, 48, 0.1)',
                tension: 0.3
              },
              {
                label: 'ARB Team',
                data: [82, 85, 87, 88, 89, 90],
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                min: 60,
                max: 100
              }
            }
          }
        });
      }
      
      // Tasks by type chart
      const tasksCtx = document.getElementById('taskTypeChart');
      if (tasksCtx) {
        new Chart(tasksCtx, {
          type: 'doughnut',
          data: {
            labels: ['Documentation', 'Audits', 'Training', 'CAPAs', 'Investigations'],
            datasets: [{
              data: [35, 25, 15, 15, 10],
              backgroundColor: [
                '#00518A',  // BBV blue
                '#CC2030',  // ADD red
                '#4F46E5',  // ARB purple
                '#6B7280',  // Gray
                '#047857'   // Green
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
      
      // CAPA status chart
      const capaCtx = document.getElementById('capaStatusChart');
      if (capaCtx) {
        new Chart(capaCtx, {
          type: 'pie',
          data: {
            labels: ['Open', 'In Progress', 'Under Review', 'Closed'],
            datasets: [{
              data: [2, 3, 2, 5],
              backgroundColor: [
                '#EF4444',  // Red
                '#F59E0B',  // Amber
                '#3B82F6',  // Blue
                '#10B981'   // Green
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              title: {
                display: true,
                text: 'CAPA Status Distribution'
              }
            }
          }
        });
      }
      
      // Set up button handlers
      setupButtonHandlers();
      
      // Set up global functions for interactive elements
      setupGlobalFunctions();
      
      console.log('Charts initialized successfully');
    } catch (error) {
      console.error('Error initializing charts:', error);
      showChartsFallback();
    }
  }
  
  // Show fallback content when charts can't be loaded
  function showChartsFallback() {
    const chartCanvases = document.querySelectorAll('canvas');
    
    chartCanvases.forEach(canvas => {
      // Create fallback container
      const fallback = document.createElement('div');
      fallback.className = 'bg-gray-100 rounded p-4 text-center';
      fallback.innerHTML = `
        <i class="fas fa-chart-bar text-gray-400 text-2xl mb-2"></i>
        <p class="text-gray-600">Charts could not be loaded. Please refresh the page.</p>
      `;
      
      // Replace canvas with fallback
      if (canvas.parentNode) {
        canvas.parentNode.replaceChild(fallback, canvas);
      }
    });
  }
  
  // Set up button handlers
  function setupButtonHandlers() {
    // Export PDF button
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', function() {
        // Show PDF export options inline instead of an alert
        const reportSection = document.getElementById('report-generation-section');
        if (reportSection) {
          reportSection.classList.remove('hidden');
          reportSection.innerHTML = `
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Export PDF Report</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="document.getElementById('report-generation-section').classList.add('hidden')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                  <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="Quality Analytics Report">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div class="grid grid-cols-2 gap-4">
                    <input type="date" class="px-3 py-2 border border-gray-300 rounded-md">
                    <input type="date" class="px-3 py-2 border border-gray-300 rounded-md">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Include Sections</label>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <input type="checkbox" checked class="mr-2" id="include-summary">
                      <label for="include-summary">Summary Statistics</label>
                    </div>
                    <div class="flex items-center">
                      <input type="checkbox" checked class="mr-2" id="include-charts">
                      <label for="include-charts">Charts and Graphs</label>
                    </div>
                    <div class="flex items-center">
                      <input type="checkbox" checked class="mr-2" id="include-tables">
                      <label for="include-tables">Data Tables</label>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end">
                  <button class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
                    <i class="fas fa-file-pdf mr-2"></i> Generate PDF
                  </button>
                </div>
              </div>
            </div>
          `;
        }
      });
    }
    
    // Generate report button
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
      generateReportBtn.addEventListener('click', function() {
        // Show report generation options inline instead of an alert
        const reportSection = document.getElementById('report-generation-section');
        if (reportSection) {
          reportSection.classList.remove('hidden');
          reportSection.innerHTML = `
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Generate Advanced Report</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="document.getElementById('report-generation-section').classList.add('hidden')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Quality Performance Report</option>
                    <option>CAPA Analysis Report</option>
                    <option>Team Comparison Report</option>
                    <option>Audit Summary Report</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>Year to Date</option>
                    <option>Custom...</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Report Format</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>PDF Document</option>
                    <option>Excel Spreadsheet</option>
                    <option>PowerPoint Presentation</option>
                    <option>Web Dashboard</option>
                  </select>
                </div>
                <div class="flex justify-end">
                  <button class="bg-arb text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
                    <i class="fas fa-chart-line mr-2"></i> Generate Report
                  </button>
                </div>
              </div>
            </div>
          `;
        }
      });
    }
  }
  
  // Set up global functions for interactive elements
  function setupGlobalFunctions() {
    // Function to show detail panel when a metric card is clicked
    window.showDetailPanel = function(panelType) {
      const detailPanel = document.getElementById('detail-panel');
      if (!detailPanel) return;
      
      // Show the panel
      detailPanel.classList.remove('hidden');
      
      // Generate content based on panel type
      let panelContent = '';
      
      switch (panelType) {
        case 'quality-tasks':
          panelContent = `
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Quality Tasks Breakdown</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="document.getElementById('detail-panel').classList.add('hidden')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap font-medium">Documentation</td>
                      <td class="px-6 py-4 whitespace-nowrap">12</td>
                      <td class="px-6 py-4 whitespace-nowrap">23</td>
                      <td class="px-6 py-4 whitespace-nowrap">38</td>
                      <td class="px-6 py-4 whitespace-nowrap">73</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap font-medium">Audits</td>
                      <td class="px-6 py-4 whitespace-nowrap">3</td>
                      <td class="px-6 py-4 whitespace-nowrap">8</td>
                      <td class="px-6 py-4 whitespace-nowrap">12</td>
                      <td class="px-6 py-4 whitespace-nowrap">23</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap font-medium">CAPAs</td>
                      <td class="px-6 py-4 whitespace-nowrap">7</td>
                      <td class="px-6 py-4 whitespace-nowrap">5</td>
                      <td class="px-6 py-4 whitespace-nowrap">12</td>
                      <td class="px-6 py-4 whitespace-nowrap">24</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap font-medium">Training</td>
                      <td class="px-6 py-4 whitespace-nowrap">5</td>
                      <td class="px-6 py-4 whitespace-nowrap">10</td>
                      <td class="px-6 py-4 whitespace-nowrap">8</td>
                      <td class="px-6 py-4 whitespace-nowrap">23</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `;
          break;
          
        case 'capas':
          panelContent = `
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">CAPA Details</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="document.getElementById('detail-panel').classList.add('hidden')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAPA ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">CAPA-2023-001</td>
                      <td class="px-6 py-4">Documentation update for SOP-123</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span></td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="text-bbv">BBV Team</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">2023-08-15</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">CAPA-2023-002</td>
                      <td class="px-6 py-4">Training program improvements</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Under Review</span></td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="text-add">ADD Team</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">2023-09-01</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">CAPA-2023-003</td>
                      <td class="px-6 py-4">Audit finding resolution</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Open</span></td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="text-arb">ARB Team</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">2023-09-15</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `;
          break;
          
        case 'audits':
          panelContent = `
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Audit Summary</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="document.getElementById('detail-panel').classList.add('hidden')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div class="text-sm text-gray-500">Passed</div>
                  <div class="text-2xl font-bold text-green-600">9</div>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div class="text-sm text-gray-500">Minor Findings</div>
                  <div class="text-2xl font-bold text-yellow-600">2</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div class="text-sm text-gray-500">Major Findings</div>
                  <div class="text-2xl font-bold text-red-600">1</div>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">Internal</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="text-bbv">BBV Team</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">2023-06-15</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">85%</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">Regulatory</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="text-add">ADD Team</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">2023-05-22</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Minor Findings</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">78%</td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">Internal</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="text-arb">ARB Team</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">2023-07-10</td>
                      <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span></td>
                      <td class="px-6 py-4 whitespace-nowrap">92%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `;
          break;
          
        case 'quality-score':
          panelContent = `
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Quality Score Analysis</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="document.getElementById('detail-panel').classList.add('hidden')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium mb-3 text-gray-700">Score Components</h4>
                  <div class="space-y-3">
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-sm">Documentation Quality</span>
                        <span class="text-sm">92%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 92%"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-sm">Audit Performance</span>
                        <span class="text-sm">85%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-sm">CAPA Effectiveness</span>
                        <span class="text-sm">78%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-yellow-500 h-2 rounded-full" style="width: 78%"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-sm">Training Completion</span>
                        <span class="text-sm">93%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 93%"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="font-medium mb-3 text-gray-700">Historical Trend</h4>
                  <div class="h-52 bg-gray-100 rounded flex items-center justify-center">
                    <div class="text-gray-500">
                      <i class="fas fa-chart-line text-3xl mb-2"></i>
                      <p>Quality score trend chart would appear here</p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="font-medium mb-2 text-gray-700">Improvement Areas</h4>
                    <ul class="space-y-1 text-sm">
                      <li class="flex items-start">
                        <span class="text-yellow-500 mr-2"><i class="fas fa-exclamation-circle"></i></span>
                        <span>CAPA closure rate needs improvement</span>
                      </li>
                      <li class="flex items-start">
                        <span class="text-yellow-500 mr-2"><i class="fas fa-exclamation-circle"></i></span>
                        <span>ADD team training completion below target</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          `;
          break;
          
        default:
          panelContent = `
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Details</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="document.getElementById('detail-panel').classList.add('hidden')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <p>No detailed information available.</p>
            </div>
          `;
      }
      
      // Set the content
      detailPanel.innerHTML = panelContent;
    };
  }
  
  // Export functions for other modules to use
  window.analyticsModule = {
    initialize: initializeAnalytics,
    createContent: createAnalyticsContent,
    initializeCharts: initializeCharts
  };
})(); 