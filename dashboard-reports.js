/**
 * Dashboard Reports Module
 * Enhanced analytics and reporting for the quality organization management application
 */

// Ensure the module is executed in strict mode
'use strict';

// Create DashboardReports module
const DashboardReports = {
  /**
   * Initialize the advanced reporting features
   */
  init() {
    console.log('Initializing Dashboard Reports module...');
    
    // Load existing data
    this.loadData();
    
    // Add dashboard reports button to the main dashboard
    this.addReportsButton();
    
    console.log('Dashboard Reports module initialized');
  },
  
  /**
   * Load application data
   */
  loadData() {
    // Use data from the main application
    this.appData = window.appData;
    
    // Add computed metrics
    this.generateMetrics();
  },
  
  /**
   * Add reports button to the dashboard
   */
  addReportsButton() {
    try {
      // First attempt - direct approach
      const dashboard = document.querySelector('.dashboard-content, #dashboard');
      if (dashboard) {
        this.insertReportsButton(dashboard);
        return;
      }
      
      // Second approach - wait for dashboard to appear
      const dashboardObserver = new MutationObserver((mutations) => {
        const dashboard = document.querySelector('.dashboard-content, #dashboard');
        
        if (dashboard) {
          this.insertReportsButton(dashboard);
          dashboardObserver.disconnect();
        }
      });
      
      // Start observing
      dashboardObserver.observe(document.body, {
        childList: true, 
        subtree: true
      });
      
      // Safety cleanup
      setTimeout(() => dashboardObserver.disconnect(), 10000);
    } catch (error) {
      console.error('Error adding reports button:', error);
    }
  },
  
  /**
   * Generate additional metrics from the app data
   */
  generateMetrics() {
    // Ensure we have data
    if (!this.appData) return;
    
    // Setup metrics object
    this.metrics = {
      teams: {
        count: this.appData.teams ? this.appData.teams.length : 0,
        byStream: {},
        averagePerformance: 0,
        averageSize: 0
      },
      personnel: {
        count: 0,
        byStream: {},
        byClient: {},
        byRole: {}
      },
      tasks: {
        count: this.appData.tasks ? this.appData.tasks.length : 0,
        completion: {
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          percentComplete: 0
        },
        byPriority: {}
      }
    };
    
    // Process teams data
    if (this.appData.teams) {
      // Calculate team-level metrics
      let totalPerformance = 0;
      let totalPersonnel = 0;
      
      this.appData.teams.forEach(team => {
        // Count by stream
        const stream = team.stream || 'unknown';
        this.metrics.teams.byStream[stream] = (this.metrics.teams.byStream[stream] || 0) + 1;
        
        // Add to performance total
        if (team.performance) {
          totalPerformance += team.performance;
        }
        
        // Count personnel
        if (team.personnel) {
          totalPersonnel += team.personnel.length;
          this.metrics.personnel.count += team.personnel.length;
          
          // Count personnel by stream
          team.personnel.forEach(person => {
            // By stream
            this.metrics.personnel.byStream[stream] = 
              (this.metrics.personnel.byStream[stream] || 0) + 1;
            
            // By client
            const client = person.client || 'unknown';
            this.metrics.personnel.byClient[client] = 
              (this.metrics.personnel.byClient[client] || 0) + 1;
            
            // By role
            const role = person.role || 'unknown';
            this.metrics.personnel.byRole[role] = 
              (this.metrics.personnel.byRole[role] || 0) + 1;
          });
        }
      });
      
      // Calculate averages
      this.metrics.teams.averagePerformance = this.metrics.teams.count > 0 ? 
        (totalPerformance / this.metrics.teams.count).toFixed(1) : 0;
      
      this.metrics.teams.averageSize = this.metrics.teams.count > 0 ? 
        (totalPersonnel / this.metrics.teams.count).toFixed(1) : 0;
    }
    
    // Process tasks data
    if (this.appData.tasks) {
      this.appData.tasks.forEach(task => {
        // Count by status
        if (task.status === 'completed') {
          this.metrics.tasks.completion.completed++;
        } else if (task.status === 'in-progress') {
          this.metrics.tasks.completion.inProgress++;
        } else {
          this.metrics.tasks.completion.notStarted++;
        }
        
        // Count by priority
        const priority = task.priority || 'medium';
        this.metrics.tasks.byPriority[priority] = 
          (this.metrics.tasks.byPriority[priority] || 0) + 1;
      });
      
      // Calculate completion percentage
      this.metrics.tasks.completion.percentComplete = this.metrics.tasks.count > 0 ?
        (this.metrics.tasks.completion.completed / this.metrics.tasks.count * 100).toFixed(1) : 0;
    }
  },
  
  /**
   * Show the advanced reports modal
   */
  showReportsModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.id = 'reportsModal';
    
    // Create modal content
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="text-xl font-semibold">Advanced Organization Reports</h2>
          <button id="closeReportsModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto flex-grow">
          <!-- Tabs -->
          <div class="border-b mb-4">
            <div class="flex space-x-4">
              <button class="report-tab pb-2 px-1 text-blue-600 border-b-2 border-blue-600" data-tab="summary">
                Summary
              </button>
              <button class="report-tab pb-2 px-1 text-gray-500 hover:text-gray-700" data-tab="teams">
                Teams
              </button>
              <button class="report-tab pb-2 px-1 text-gray-500 hover:text-gray-700" data-tab="personnel">
                Personnel
              </button>
              <button class="report-tab pb-2 px-1 text-gray-500 hover:text-gray-700" data-tab="tasks">
                Tasks
              </button>
              <button class="report-tab pb-2 px-1 text-gray-500 hover:text-gray-700" data-tab="performance">
                Performance
              </button>
            </div>
          </div>
          
          <!-- Tab Content -->
          <div id="reportContent">
            <!-- Summary Tab (default) -->
            <div id="summaryTab" class="report-tab-content">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 class="text-sm text-blue-800 uppercase">Teams</h3>
                  <div class="text-3xl font-bold">${this.metrics.teams.count}</div>
                  <div class="text-sm text-blue-600">Avg Performance: ${this.metrics.teams.averagePerformance}%</div>
                </div>
                <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h3 class="text-sm text-green-800 uppercase">Personnel</h3>
                  <div class="text-3xl font-bold">${this.metrics.personnel.count}</div>
                  <div class="text-sm text-green-600">Avg Team Size: ${this.metrics.teams.averageSize}</div>
                </div>
                <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h3 class="text-sm text-purple-800 uppercase">Tasks</h3>
                  <div class="text-3xl font-bold">${this.metrics.tasks.count}</div>
                  <div class="text-sm text-purple-600">Completion: ${this.metrics.tasks.completion.percentComplete}%</div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow p-4">
                  <h3 class="font-semibold mb-2">Stream Distribution</h3>
                  <div id="streamDistributionChart" class="h-64"></div>
                </div>
                <div class="bg-white rounded-lg shadow p-4">
                  <h3 class="font-semibold mb-2">Team Performance</h3>
                  <div id="teamPerformanceChart" class="h-64"></div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow p-4 mb-6">
                <h3 class="font-semibold mb-2">Recent Activity</h3>
                <div id="activityTimeline" class="overflow-x-auto">
                  ${this.generateActivityTimeline()}
                </div>
              </div>
            </div>
            
            <!-- Other tabs will be populated dynamically -->
            <div id="teamsTab" class="report-tab-content hidden"></div>
            <div id="personnelTab" class="report-tab-content hidden"></div>
            <div id="tasksTab" class="report-tab-content hidden"></div>
            <div id="performanceTab" class="report-tab-content hidden"></div>
          </div>
        </div>
        
        <div class="p-4 border-t flex justify-between">
          <div>
            <span class="text-sm text-gray-500">Last updated: ${new Date().toLocaleString()}</span>
          </div>
          <div class="space-x-2">
            <button id="exportReportBtn" class="btn btn-secondary">
              <i class="fas fa-download mr-1"></i> Export Report
            </button>
            <button id="printReportBtn" class="btn btn-secondary">
              <i class="fas fa-print mr-1"></i> Print
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('closeReportsModal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.querySelectorAll('.report-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.report-tab').forEach(t => {
          t.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
          t.classList.add('text-gray-500');
        });
        
        tab.classList.remove('text-gray-500');
        tab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
        
        // Show corresponding content
        const tabId = tab.getAttribute('data-tab');
        document.querySelectorAll('.report-tab-content').forEach(content => {
          content.classList.add('hidden');
        });
        
        const contentTab = document.getElementById(`${tabId}Tab`);
        contentTab.classList.remove('hidden');
        
        // Load content for tab if needed
        this.loadTabContent(tabId);
      });
    });
    
    // Export report
    document.getElementById('exportReportBtn').addEventListener('click', () => {
      this.exportReport();
    });
    
    // Print report
    document.getElementById('printReportBtn').addEventListener('click', () => {
      this.printReport();
    });
    
    // Initialize charts for summary tab
    this.initializeSummaryCharts();
  },
  
  /**
   * Load content for a specific report tab
   * @param {string} tabId - The ID of the tab to load
   */
  loadTabContent(tabId) {
    switch (tabId) {
      case 'teams':
        this.loadTeamsTabContent();
        break;
      case 'personnel':
        this.loadPersonnelTabContent();
        break;
      case 'tasks':
        this.loadTasksTabContent();
        break;
      case 'performance':
        this.loadPerformanceTabContent();
        break;
    }
  },
  
  /**
   * Initialize charts for the summary tab
   */
  initializeSummaryCharts() {
    try {
      // Check if Chart.js is available
      if (typeof Chart === 'undefined') {
        console.error('Chart.js not available');
        
        // Show error message in chart containers
        const containers = ['streamDistributionChart', 'teamPerformanceChart'];
        containers.forEach(id => {
          const container = document.getElementById(id);
          if (container) {
            container.innerHTML = `
              <div class="flex items-center justify-center h-full">
                <div class="text-center">
                  <i class="fas fa-exclamation-circle text-red-500 text-2xl mb-2"></i>
                  <p>Chart library not available</p>
                </div>
              </div>
            `;
          }
        });
        
        return;
      }
      
      // Stream Distribution Chart
      this.createStreamDistributionChart();
      
      // Team Performance Chart
      this.createTeamPerformanceChart();
      
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  },
  
  /**
   * Create stream distribution chart
   */
  createStreamDistributionChart() {
    const ctx = document.getElementById('streamDistributionChart');
    if (!ctx) return;
    
    // Get stream distribution data
    const streamData = this.metrics.teams.byStream;
    const labels = Object.keys(streamData);
    const data = Object.values(streamData);
    
    // Get colors for each stream from config
    const colors = labels.map(stream => {
      return window.config?.colors?.[stream] || '#cccccc';
    });
    
    // Create chart
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Team Distribution by Stream'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  },
  
  /**
   * Create team performance chart
   */
  createTeamPerformanceChart() {
    const ctx = document.getElementById('teamPerformanceChart');
    if (!ctx) return;
    
    // Get team performance data
    const teams = this.appData.teams || [];
    const labels = teams.map(team => team.name);
    const performanceData = teams.map(team => team.performance || 0);
    
    // Get colors based on stream
    const colors = teams.map(team => {
      return window.config?.colors?.[team.stream] || '#cccccc';
    });
    
    // Create chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Performance',
          data: performanceData,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Performance (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Team'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Team Performance Comparison'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  },
  
  /**
   * Generate HTML for recent activity timeline
   * @return {string} HTML content
   */
  generateActivityTimeline() {
    // Get recent activities
    const activities = this.appData.activities || [];
    
    if (activities.length === 0) {
      return `<p class="text-gray-500 italic">No recent activities recorded</p>`;
    }
    
    // Sort by date (newest first)
    const sortedActivities = [...activities].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    // Take the 5 most recent
    const recentActivities = sortedActivities.slice(0, 5);
    
    // Generate timeline HTML
    return `
      <div class="relative border-l border-gray-200 pl-4 space-y-4 ml-4">
        ${recentActivities.map(activity => {
          // Determine icon and color based on activity type
          let icon = 'fa-circle';
          let colorClass = 'bg-blue-500';
          
          switch (activity.type) {
            case 'create':
              icon = 'fa-plus';
              colorClass = 'bg-green-500';
              break;
            case 'update':
              icon = 'fa-pen';
              colorClass = 'bg-blue-500';
              break;
            case 'delete':
              icon = 'fa-trash';
              colorClass = 'bg-red-500';
              break;
          }
          
          return `
            <div class="relative">
              <div class="absolute -left-10 mt-1.5 w-6 h-6 rounded-full ${colorClass} flex items-center justify-center text-white">
                <i class="fas ${icon} text-xs"></i>
              </div>
              <div>
                <h4 class="font-medium">${activity.description}</h4>
                <div class="text-sm text-gray-500">
                  ${activity.team ? `Team: ${activity.team}` : ''}
                  <span class="ml-2">${this.formatDate(activity.date)}</span>
                </div>
                ${activity.details ? `
                  <div class="text-sm mt-1">
                    ${typeof activity.details === 'object' ? 
                      (activity.details.changes ? 
                        `<div>Changes: ${activity.details.changes.join(', ')}</div>` : '') +
                      (activity.details.impact ? 
                        `<div>Impact: ${activity.details.impact}</div>` : '')
                      : activity.details}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },
  
  /**
   * Load teams tab content
   */
  loadTeamsTabContent() {
    const tabContent = document.getElementById('teamsTab');
    if (!tabContent) return;
    
    // Check if already loaded
    if (tabContent.dataset.loaded === 'true') return;
    
    // Get teams data
    const teams = this.appData.teams || [];
    
    // Generate HTML
    tabContent.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h3 class="text-lg font-semibold">Teams Analysis</h3>
          <div class="flex gap-2">
            <select id="teamStreamFilter" class="form-select text-sm px-3 py-2 rounded border">
              <option value="all">All Streams</option>
              ${Object.keys(this.metrics.teams.byStream).map(stream => 
                `<option value="${stream}">${stream.toUpperCase()}</option>`).join('')}
            </select>
            <button id="exportTeamsReportBtn" class="btn btn-sm btn-secondary">
              <i class="fas fa-download mr-1"></i> Export
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-semibold mb-2">Team Size Distribution</h3>
            <div id="teamSizeChart" class="h-64"></div>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-semibold mb-2">Team Responsibilities</h3>
            <div id="responsibilitiesChart" class="h-64"></div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <h3 class="font-semibold">Teams Comparison</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${teams.map(team => {
                  // Calculate additional metrics
                  const memberCount = team.personnel ? team.personnel.length : 0;
                  
                  // Performance color class
                  const perfColor = team.performance >= 80 ? 'bg-green-100 text-green-800' : 
                                  team.performance >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800';
                  
                  // Get stream color from config or use default
                  const streamColor = window.config?.colors?.[team.stream] || '#cccccc';
                  
                  return `
                    <tr data-team-id="${team.id}" data-stream="${team.stream}">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-gray-900">${team.name}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                              style="background-color: ${streamColor}20; color: ${streamColor}">
                          ${team.stream}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${memberCount}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs rounded ${perfColor}">
                          ${team.performance || 0}%
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        0 <!-- Placeholder, will need to calculate actual tasks -->
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-blue-600 h-2 rounded-full" style="width: ${team.performance || 0}%"></div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    // Mark as loaded
    tabContent.dataset.loaded = 'true';
    
    // Initialize team charts
    this.initializeTeamCharts();
    
    // Add event listeners
    document.getElementById('teamStreamFilter')?.addEventListener('change', (e) => {
      const streamValue = e.target.value;
      
      // Filter the team rows
      document.querySelectorAll('[data-team-id]').forEach(row => {
        if (streamValue === 'all' || row.getAttribute('data-stream') === streamValue) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
    
    document.getElementById('exportTeamsReportBtn')?.addEventListener('click', () => {
      this.exportTeamsReport();
    });
  },
  
  /**
   * Initialize charts for teams tab
   */
  initializeTeamCharts() {
    try {
      // Check if Chart.js is available
      if (typeof Chart === 'undefined') {
        console.error('Chart.js not available for team charts');
        return;
      }
      
      // Team Size Chart
      this.createTeamSizeChart();
      
      // Team Responsibilities Chart (Word cloud simulation)
      this.createResponsibilitiesChart();
      
    } catch (error) {
      console.error('Error initializing team charts:', error);
    }
  },
  
  /**
   * Create team size distribution chart
   */
  createTeamSizeChart() {
    const ctx = document.getElementById('teamSizeChart');
    if (!ctx) return;
    
    // Get team sizes
    const teams = this.appData.teams || [];
    const teamSizes = teams.map(team => team.personnel ? team.personnel.length : 0);
    
    // Count teams of each size
    const sizeDistribution = {};
    teamSizes.forEach(size => {
      sizeDistribution[size] = (sizeDistribution[size] || 0) + 1;
    });
    
    // Convert to arrays for chart
    const labels = Object.keys(sizeDistribution).sort((a, b) => parseInt(a) - parseInt(b));
    const data = labels.map(size => sizeDistribution[size]);
    
    // Create chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Number of Teams',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Teams'
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            title: {
              display: true,
              text: 'Team Size (Members)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Team Size Distribution'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  },
  
  /**
   * Create team responsibilities visualization
   */
  createResponsibilitiesChart() {
    const container = document.getElementById('responsibilitiesChart');
    if (!container) return;
    
    // Get all responsibilities text
    const teams = this.appData.teams || [];
    const allResponsibilities = teams.map(team => team.responsibilities || '').join(' ');
    
    // Parse out common words
    const words = allResponsibilities.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Only words longer than 3 chars
    
    // Count word frequency
    const wordFrequency = {};
    words.forEach(word => {
      // Skip common words
      if (['and', 'the', 'for', 'with', 'that', 'have', 'this', 'from'].includes(word)) return;
      
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Sort by frequency
    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10 words
    
    // Create chart data
    const labels = sortedWords.map(item => item[0]);
    const data = sortedWords.map(item => item[1]);
    
    // Create chart
    new Chart(container, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
            'rgba(83, 102, 255, 0.7)',
            'rgba(40, 159, 64, 0.7)',
            'rgba(210, 199, 199, 0.7)'
          ]
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Common Responsibilities'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  },
  
  /**
   * Load personnel tab content
   */
  loadPersonnelTabContent() {
    const tabContent = document.getElementById('personnelTab');
    if (!tabContent) return;
    
    // Check if already loaded
    if (tabContent.dataset.loaded === 'true') return;
    
    // Get all personnel with team info
    const personnel = window.getPersonnelWithTeamInfo ? 
      window.getPersonnelWithTeamInfo() : [];
    
    // Generate HTML
    tabContent.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h3 class="text-lg font-semibold">Personnel Analysis</h3>
          <div class="flex gap-2">
            <select id="personnelStreamFilter" class="form-select text-sm px-3 py-2 rounded border">
              <option value="all">All Streams</option>
              ${Object.keys(this.metrics.personnel.byStream || {}).map(stream => 
                `<option value="${stream}">${stream.toUpperCase()}</option>`).join('')}
            </select>
            <select id="personnelRoleFilter" class="form-select text-sm px-3 py-2 rounded border">
              <option value="all">All Roles</option>
              ${Object.keys(this.metrics.personnel.byRole || {}).map(role => 
                `<option value="${role}">${role}</option>`).join('')}
            </select>
            <button id="exportPersonnelReportBtn" class="btn btn-sm btn-secondary">
              <i class="fas fa-download mr-1"></i> Export
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-semibold mb-2">Role Distribution</h3>
            <div id="roleDistributionChart" class="h-64"></div>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-semibold mb-2">Client Distribution</h3>
            <div id="clientDistributionChart" class="h-64"></div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <h3 class="font-semibold">Personnel Listing</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${personnel.map(person => {
                  // Get stream color from config or use default
                  const streamColor = window.config?.colors?.[person.stream] || '#cccccc';
                  
                  return `
                    <tr data-person-id="${person.id}" data-stream="${person.stream}" data-role="${person.role || ''}">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-gray-900">${person.name}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${person.role || 'N/A'}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${person.teamName || 'N/A'}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                              style="background-color: ${streamColor}20; color: ${streamColor}">
                          ${person.stream || 'N/A'}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${person.client || 'N/A'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    // Mark as loaded
    tabContent.dataset.loaded = 'true';
    
    // Initialize personnel charts
    this.initializePersonnelCharts();
    
    // Add event listeners
    document.getElementById('personnelStreamFilter')?.addEventListener('change', () => {
      this.applyPersonnelFilters();
    });
    
    document.getElementById('personnelRoleFilter')?.addEventListener('change', () => {
      this.applyPersonnelFilters();
    });
    
    document.getElementById('exportPersonnelReportBtn')?.addEventListener('click', () => {
      this.exportPersonnelReport();
    });
  },
  
  /**
   * Apply filters to personnel listing
   */
  applyPersonnelFilters() {
    const streamFilter = document.getElementById('personnelStreamFilter')?.value || 'all';
    const roleFilter = document.getElementById('personnelRoleFilter')?.value || 'all';
    
    // Filter the personnel rows
    document.querySelectorAll('[data-person-id]').forEach(row => {
      const rowStream = row.getAttribute('data-stream');
      const rowRole = row.getAttribute('data-role');
      
      const streamMatch = streamFilter === 'all' || rowStream === streamFilter;
      const roleMatch = roleFilter === 'all' || rowRole === roleFilter;
      
      if (streamMatch && roleMatch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  },
  
  /**
   * Initialize charts for personnel tab
   */
  initializePersonnelCharts() {
    try {
      // Check if Chart.js is available
      if (typeof Chart === 'undefined') {
        console.error('Chart.js not available for personnel charts');
        return;
      }
      
      // Role Distribution Chart
      this.createRoleDistributionChart();
      
      // Client Distribution Chart
      this.createClientDistributionChart();
      
    } catch (error) {
      console.error('Error initializing personnel charts:', error);
    }
  },
  
  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @return {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Format as relative time if recent
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else {
        // Format as date for older dates
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  },
  
  /**
   * Export the report as PDF
   */
  exportReport() {
    alert('Full report export will be available in the next version.');
  },
  
  /**
   * Print the current report tab
   */
  printReport() {
    window.print();
  }
};

// Initialize the module when window loads
window.addEventListener('load', () => {
  // Function to check if all core dependencies are loaded
  const checkDependencies = () => {
    return window.appData && 
           window.ui && 
           typeof window.ui.showToast === 'function' &&
           document.querySelector('#tabContent') !== null;
  };

  // Function to initialize the module
  const initializeModule = () => {
    if (DashboardReports.initialized) {
      console.log('Dashboard Reports already initialized, skipping');
      return;
    }
    
    console.log('Core dependencies loaded, initializing Dashboard Reports module');
    DashboardReports.init();
  };

  // Initial check after a short delay
  setTimeout(() => {
    if (checkDependencies()) {
      initializeModule();
    } else {
      console.warn('Core dependencies not loaded yet for Dashboard Reports, using MutationObserver');
      
      // Set up an observer to wait for app initialization
      const appReadyObserver = new MutationObserver((mutations) => {
        if (checkDependencies()) {
          console.log('App ready detected, initializing Dashboard Reports');
          initializeModule();
          appReadyObserver.disconnect();
        }
      });
      
      // Start observing for app ready state
      appReadyObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Safety timeout to prevent infinite waiting
      setTimeout(() => {
        appReadyObserver.disconnect();
        if (!DashboardReports.initialized) {
          console.log('Initializing Dashboard Reports with safety timeout');
          initializeModule();
        }
      }, 5000);
    }
  }, 1000); // Wait 1 second after load event for other scripts to initialize
});

// Add initialized flag to track state
DashboardReports.initialized = false;

// Update init method to set initialized flag
const originalInit = DashboardReports.init;
DashboardReports.init = function() {
  if (this.initialized) {
    console.log('Dashboard Reports already initialized, skipping');
    return;
  }
  
  console.log('Initializing Dashboard Reports module...');
  
  try {
    // Set flag before anything else
    this.initialized = true;
    
    // Load existing data
    this.loadData();
    
    // Only add reports button if we have data
    if (this.appData && this.appData.teams) {
      // Add dashboard reports button to the main dashboard
      this.addReportsButton();
      console.log('Dashboard Reports module initialized successfully');
    } else {
      console.warn('Dashboard Reports initialized but no app data available');
    }
  } catch (error) {
    console.error('Error initializing Dashboard Reports module:', error);
    this.initialized = false; // Reset flag on error
  }
};

// Update addReportsButton method to be more reliable
DashboardReports.addReportsButton = function() {
  try {
    // First attempt - direct approach
    const dashboard = document.querySelector('.dashboard-content, #dashboard');
    if (dashboard) {
      this.insertReportsButton(dashboard);
      return;
    }
    
    // Second approach - wait for dashboard to appear
    const dashboardObserver = new MutationObserver((mutations) => {
      const dashboard = document.querySelector('.dashboard-content, #dashboard');
      
      if (dashboard) {
        this.insertReportsButton(dashboard);
        dashboardObserver.disconnect();
      }
    });
    
    // Start observing
    dashboardObserver.observe(document.body, {
      childList: true, 
      subtree: true
    });
    
    // Safety cleanup
    setTimeout(() => dashboardObserver.disconnect(), 10000);
  } catch (error) {
    console.error('Error adding reports button:', error);
  }
};

// New helper method to insert the button
DashboardReports.insertReportsButton = function(dashboard) {
  // Find a place to insert the reports button
  const actionArea = dashboard.querySelector('.dashboard-actions, .quick-actions') ||
                     dashboard.querySelector('.bg-white');
  
  if (actionArea && !document.getElementById('dashboardReportsBtn')) {
    // Create button container if needed
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-4';
    
    // Create the button
    buttonContainer.innerHTML = `
      <button id="dashboardReportsBtn" class="btn btn-secondary w-full py-2 flex items-center justify-center">
        <i class="fas fa-chart-line mr-2"></i>
        Advanced Reports
      </button>
    `;
    
    // Add to the dashboard
    actionArea.appendChild(buttonContainer);
    
    // Add click event
    document.getElementById('dashboardReportsBtn').addEventListener('click', () => {
      this.showReportsModal();
    });
    
    console.log('Reports button added successfully');
  }
};

// Make the module available immediately for emergency access
window.DashboardReports = DashboardReports;

console.log('Dashboard Reports module loaded and ready for initialization');
