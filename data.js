// Data module - used for additional data if needed
console.log('Data module loaded');

// This file contains supplementary data functions rather than duplicate data

// Ensure we don't overwrite existing appData from app.js
if (!window.appData) {
  console.warn('appData not found - this is unexpected, app.js should define it first');
  window.appData = {};
}

// Helper functions for data manipulation

/**
 * Gets a team by ID from the appData
 * @param {number} id - The team ID to look for
 * @return {object|null} The team object or null if not found
 */
window.getTeamById = function(id) {
  if (!window.appData || !window.appData.teams) return null;
  return window.appData.teams.find(team => team.id === parseInt(id)) || null;
};

/**
 * Gets personnel by ID from any team
 * @param {number} id - The personnel ID to look for
 * @return {object|null} The personnel object or null if not found
 */
window.getPersonnelById = function(id) {
  if (!window.appData || !window.appData.teams) return null;
  
  for (const team of window.appData.teams) {
    if (!team.personnel) continue;
    
    const person = team.personnel.find(p => p.id === parseInt(id));
    if (person) return person;
  }
  
  return null;
};

/**
 * Gets a document by ID
 * @param {number} id - The document ID to look for
 * @return {object|null} The document object or null if not found
 */
window.getDocumentById = function(id) {
  if (!window.appData || !window.appData.documents) return null;
  return window.appData.documents.find(doc => doc.id === parseInt(id)) || null;
};

/**
 * Generates a unique ID for a new item
 * @param {Array} collection - The collection to check against
 * @return {number} A unique ID number
 */
window.generateUniqueId = function(collection) {
  if (!collection || !Array.isArray(collection) || collection.length === 0) {
    return 1;
  }
  
  const maxId = Math.max(...collection.map(item => item.id));
  return maxId + 1;
};

console.log('Data utility functions loaded successfully');

// Data handling utilities
var data = {
  // Initialize the data module
  init() {
    return new Promise((resolve, reject) => {
      try {
        console.log('Initializing data module...');
        
        // Try to load data from localStorage
        this.loadFromStorage();
        
        // Initialize analytics
        this.initializeAnalytics();
        
        console.log('Data module initialized successfully');
        resolve();
      } catch (error) {
        console.error('Error initializing data module:', error);
        reject(error);
      }
    });
  },
  
  // Load data from localStorage
  loadFromStorage() {
    try {
      const storedData = localStorage.getItem('appData');
      if (storedData) {
        window.appData = JSON.parse(storedData);
        console.log('Data loaded from localStorage');
      } else {
        console.log('No data found in localStorage, initializing with default data');
        this.initializeDefaultData();
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      this.initializeDefaultData();
    }
  },
  
  // Initialize with default data
  initializeDefaultData() {
    window.appData = {
      teams: [],
      documents: [],
      tasks: [],
      activities: [],
      analytics: {
        lastUpdate: new Date().toISOString(),
        metrics: {},
        reports: []
      },
      state: {
        isLoggedIn: true,
        currentTab: 'dashboard',
        userName: "Admin User",
        userRole: "Administrator"
      }
    };
    
    this.saveToStorage();
  },
  
  // Save data to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('appData', JSON.stringify(window.appData));
      console.log('Data saved to localStorage');
      
      // Update analytics last update timestamp
      if (window.appData.analytics) {
        window.appData.analytics.lastUpdate = new Date().toISOString();
      }
      
      // Create an activity log entry
      this.recordActivity('save', 'Data saved to storage');
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  },
  
  // Record an activity
  recordActivity(type, description, details = {}) {
    if (!window.appData.activities) {
      window.appData.activities = [];
    }
    
    const activity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: type,
      description: description,
      details: details
    };
    
    window.appData.activities.unshift(activity);
    
    // Keep only the most recent 50 activities
    if (window.appData.activities.length > 50) {
      window.appData.activities = window.appData.activities.slice(0, 50);
    }
    
    // No need to save here as it would create a loop with saveToStorage
  },
  
  // Initialize analytics system
  initializeAnalytics() {
    if (!window.appData.analytics) {
      window.appData.analytics = {
        lastUpdate: new Date().toISOString(),
        metrics: {},
        reports: []
      };
    }
    
    // Schedule regular analytics updates
    setInterval(() => this.updateAnalytics(), 60000);
    
    // Initial analytics update
    this.updateAnalytics();
  },
  
  // Update analytics data
  updateAnalytics() {
    try {
      if (!window.appData.analytics) return;
      
      const analytics = window.appData.analytics;
      analytics.lastUpdate = new Date().toISOString();
      
      // Calculate key metrics
      const metrics = {
        totalTeams: 0,
        totalPersonnel: 0,
        streamDistribution: {},
        clientDistribution: {},
        averageTeamSize: 0,
        teamsCreatedThisMonth: 0,
        activeTeams: 0
      };
      
      // Process teams data
      if (window.appData.teams && Array.isArray(window.appData.teams)) {
        metrics.totalTeams = window.appData.teams.length;
        
        let personnelCount = 0;
        const streamCounts = {};
        const clientCounts = {};
        let teamsThisMonth = 0;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        window.appData.teams.forEach(team => {
          if (!team) return;
          
          // Count by stream
          const stream = team.stream || 'unknown';
          streamCounts[stream] = (streamCounts[stream] || 0) + 1;
          
          // Count personnel
          if (team.personnel && Array.isArray(team.personnel)) {
            personnelCount += team.personnel.length;
            
            // Count by client
            team.personnel.forEach(person => {
              if (person && person.client) {
                const client = person.client;
                clientCounts[client] = (clientCounts[client] || 0) + 1;
              }
            });
          }
          
          // Teams created this month
          if (team.createdAt) {
            const createdDate = new Date(team.createdAt);
            if (createdDate >= monthStart) {
              teamsThisMonth++;
            }
          }
          
          // Active teams (with recent activity or updates)
          if (team.lastUpdated) {
            const lastUpdated = new Date(team.lastUpdated);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (lastUpdated >= thirtyDaysAgo) {
              metrics.activeTeams++;
            }
          }
        });
        
        // Save calculated metrics
        metrics.totalPersonnel = personnelCount;
        metrics.streamDistribution = streamCounts;
        metrics.clientDistribution = clientCounts;
        metrics.averageTeamSize = metrics.totalTeams > 0 ? personnelCount / metrics.totalTeams : 0;
        metrics.teamsCreatedThisMonth = teamsThisMonth;
      }
      
      // Update the metrics in analytics
      window.appData.analytics.metrics = metrics;
      
      // Generate reports if needed
      this.generateReports();
      
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  },
  
  // Generate analytics reports
  generateReports() {
    try {
      if (!window.appData.analytics) return;
      
      const analytics = window.appData.analytics;
      if (!analytics.reports) {
        analytics.reports = [];
      }
      
      // Only generate new reports once a day
      const lastReport = analytics.reports[0];
      if (lastReport) {
        const lastReportDate = new Date(lastReport.timestamp);
        const today = new Date();
        
        if (lastReportDate.toDateString() === today.toDateString()) {
          return; // Already generated a report today
        }
      }
      
      // Create a new report
      const report = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        title: 'Organization Status Report',
        metrics: { ...analytics.metrics },
        insights: this.generateInsights(analytics.metrics)
      };
      
      // Add to reports array
      analytics.reports.unshift(report);
      
      // Keep only the most recent 30 reports
      if (analytics.reports.length > 30) {
        analytics.reports = analytics.reports.slice(0, 30);
      }
      
    } catch (error) {
      console.error('Error generating reports:', error);
    }
  },
  
  // Generate insights from metrics
  generateInsights(metrics) {
    const insights = [];
    
    try {
      // Team size insights
      if (metrics.averageTeamSize > 0) {
        if (metrics.averageTeamSize < 3) {
          insights.push({
            type: 'warning',
            message: 'Average team size is below optimal levels (< 3 members)',
            recommendation: 'Consider consolidating teams or adding more personnel'
          });
        } else if (metrics.averageTeamSize > 10) {
          insights.push({
            type: 'warning',
            message: 'Some teams may be too large (avg > 10 members)',
            recommendation: 'Consider splitting larger teams for better management'
          });
        } else {
          insights.push({
            type: 'success',
            message: 'Team sizes are within optimal range',
            recommendation: null
          });
        }
      }
      
      // Stream distribution insights
      if (metrics.streamDistribution) {
        const streams = Object.keys(metrics.streamDistribution);
        
        if (streams.length === 1) {
          insights.push({
            type: 'warning',
            message: 'All teams are in a single stream: ' + streams[0],
            recommendation: 'Consider diversifying streams for better coverage'
          });
        }
        
        // Check if any stream has too few teams
        for (const stream of streams) {
          const count = metrics.streamDistribution[stream];
          const percentage = (count / metrics.totalTeams) * 100;
          
          if (percentage < 10 && metrics.totalTeams > 5) {
            insights.push({
              type: 'info',
              message: `Stream ${stream} has very few teams (${count})`,
              recommendation: 'Review resource allocation for this stream'
            });
          }
        }
      }
      
      // Client distribution insights
      if (metrics.clientDistribution) {
        const clients = Object.keys(metrics.clientDistribution);
        
        if (clients.length === 1 && metrics.totalPersonnel > 10) {
          insights.push({
            type: 'warning',
            message: 'All personnel are assigned to a single client',
            recommendation: 'Diversify client assignments to reduce dependency risk'
          });
        }
        
        // Find the client with the most personnel
        let maxClient = '';
        let maxCount = 0;
        
        for (const client of clients) {
          const count = metrics.clientDistribution[client];
          if (count > maxCount) {
            maxCount = count;
            maxClient = client;
          }
        }
        
        if (maxCount > 0) {
          const percentage = (maxCount / metrics.totalPersonnel) * 100;
          if (percentage > 70) {
            insights.push({
              type: 'warning',
              message: `${maxClient} has ${percentage.toFixed(0)}% of all personnel`,
              recommendation: 'High concentration risk. Consider balancing client assignments.'
            });
          }
        }
      }
      
      // Growth insights
      if (metrics.teamsCreatedThisMonth > 0) {
        const growthRate = (metrics.teamsCreatedThisMonth / metrics.totalTeams) * 100;
        
        if (growthRate > 20) {
          insights.push({
            type: 'success',
            message: `Strong growth: ${metrics.teamsCreatedThisMonth} new teams this month (${growthRate.toFixed(0)}%)`,
            recommendation: 'Ensure proper onboarding and resource allocation'
          });
        }
      } else if (metrics.totalTeams > 5) {
        insights.push({
          type: 'info',
          message: 'No new teams created this month',
          recommendation: 'Review growth strategy and expansion opportunities'
        });
      }
      
      // Activity insights
      if (metrics.activeTeams > 0) {
        const activePercentage = (metrics.activeTeams / metrics.totalTeams) * 100;
        
        if (activePercentage < 50 && metrics.totalTeams > 5) {
          insights.push({
            type: 'warning',
            message: `Only ${activePercentage.toFixed(0)}% of teams have recent activity`,
            recommendation: 'Check for inactive teams and consider reorganization'
          });
        } else if (activePercentage > 80) {
          insights.push({
            type: 'success',
            message: `Strong team activity: ${activePercentage.toFixed(0)}% of teams active`,
            recommendation: null
          });
        }
      }
      
    } catch (error) {
      console.error('Error generating insights:', error);
      insights.push({
        type: 'error',
        message: 'Error generating insights',
        recommendation: 'Check console for details'
      });
    }
    
    return insights;
  },
  
  // Get analytics data
  getAnalytics() {
    return window.appData.analytics || {
      lastUpdate: new Date().toISOString(),
      metrics: {},
      reports: []
    };
  },
  
  // Get the latest analytics report
  getLatestReport() {
    if (window.appData.analytics && window.appData.analytics.reports && window.appData.analytics.reports.length > 0) {
      return window.appData.analytics.reports[0];
    }
    return null;
  },
  
  // Export data to CSV format
  exportToCSV(dataType) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    switch (dataType) {
      case 'teams':
        csvContent += "Team ID,Team Name,Stream,Personnel Count,Performance\n";
        
        if (window.appData.teams) {
          window.appData.teams.forEach(team => {
            if (!team) return;
            
            const personnelCount = team.personnel ? team.personnel.length : 0;
            csvContent += `${team.id},"${team.name}",${team.stream},${personnelCount},${team.performance || 0}\n`;
          });
        }
        break;
        
      case 'personnel':
        csvContent += "Name,Role,Team,Stream,Client\n";
        
        if (window.appData.teams) {
          window.appData.teams.forEach(team => {
            if (!team || !team.personnel) return;
            
            team.personnel.forEach(person => {
              if (!person) return;
              csvContent += `"${person.name}","${person.role || ''}","${team.name}","${team.stream}","${person.client || ''}"\n`;
            });
          });
        }
        break;
        
      case 'analytics':
        // Export analytics report
        if (window.appData.analytics && window.appData.analytics.metrics) {
          const metrics = window.appData.analytics.metrics;
          
          csvContent += "Metric,Value\n";
          csvContent += `Total Teams,${metrics.totalTeams}\n`;
          csvContent += `Total Personnel,${metrics.totalPersonnel}\n`;
          csvContent += `Average Team Size,${metrics.averageTeamSize.toFixed(2)}\n`;
          csvContent += `Active Teams,${metrics.activeTeams}\n`;
          csvContent += `Teams Created This Month,${metrics.teamsCreatedThisMonth}\n\n`;
          
          // Stream distribution
          csvContent += "\nStream Distribution\nStream,Count\n";
          for (const stream in metrics.streamDistribution) {
            csvContent += `${stream},${metrics.streamDistribution[stream]}\n`;
          }
          
          // Client distribution
          csvContent += "\nClient Distribution\nClient,Count\n";
          for (const client in metrics.clientDistribution) {
            csvContent += `${client},${metrics.clientDistribution[client]}\n`;
          }
        }
        break;
        
      default:
        console.error('Invalid export type:', dataType);
        return null;
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quality_org_${dataType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  },
  
  // Get all activities
  getActivities(limit = 0) {
    if (!window.appData.activities) {
      return [];
    }
    
    if (limit > 0) {
      return window.appData.activities.slice(0, limit);
    }
    
    return window.appData.activities;
  },
  
  // Search across all data
  search(query, options = {}) {
    const results = {
      teams: [],
      personnel: [],
      documents: [],
      tasks: []
    };
    
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return results;
    }
    
    query = query.toLowerCase().trim();
    
    // Search teams
    if (window.appData.teams && (!options.types || options.types.includes('teams'))) {
      results.teams = window.appData.teams.filter(team => {
        if (!team) return false;
        
        return (
          team.name.toLowerCase().includes(query) ||
          (team.description && team.description.toLowerCase().includes(query)) ||
          (team.responsibilities && team.responsibilities.toLowerCase().includes(query))
        );
      });
    }
    
    // Search personnel
    if (window.appData.teams && (!options.types || options.types.includes('personnel'))) {
      const personnel = [];
      window.appData.teams.forEach(team => {
        if (!team || !team.personnel) return;
        
        team.personnel.forEach(person => {
          if (!person) return;
          
          if (
            person.name.toLowerCase().includes(query) ||
            (person.role && person.role.toLowerCase().includes(query)) ||
            (person.client && person.client.toLowerCase().includes(query))
          ) {
            personnel.push({
              ...person,
              team: team.name,
              stream: team.stream
            });
          }
        });
      });
      results.personnel = personnel;
    }
    
    // Search documents
    if (window.appData.documents && (!options.types || options.types.includes('documents'))) {
      results.documents = window.appData.documents.filter(doc => {
        if (!doc) return false;
        
        return (
          doc.title.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query)) ||
          (doc.content && doc.content.toLowerCase().includes(query))
        );
      });
    }
    
    // Search tasks
    if (window.appData.tasks && (!options.types || options.types.includes('tasks'))) {
      results.tasks = window.appData.tasks.filter(task => {
        if (!task) return false;
        
        return (
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
        );
      });
    }
    
    return results;
  }
};

// Add enhanced data utility functions
// These functions will help with advanced data operations and analysis

/**
 * Get team hierarchy with personnel
 * @return {object} Hierarchical tree of teams with personnel
 */
window.getTeamHierarchy = function() {
  if (!window.appData || !window.appData.teams) return null;
  
  // Create a deep copy of teams to avoid modifying original data
  const teams = JSON.parse(JSON.stringify(window.appData.teams));
  
  // Create a map of teams by ID for quick lookup
  const teamsMap = new Map();
  teams.forEach(team => {
    teamsMap.set(team.id, team);
    team.children = []; // Initialize children array for subteams
  });
  
  // Identify root teams vs subteams
  const rootTeams = [];
  teams.forEach(team => {
    if (team.parentId) {
      // This is a subteam, add to parent's children
      const parent = teamsMap.get(team.parentId);
      if (parent) {
        parent.children.push(team);
      } else {
        // Parent not found, treat as root
        rootTeams.push(team);
      }
    } else {
      // No parent, this is a root team
      rootTeams.push(team);
    }
  });
  
  return rootTeams;
};

/**
 * Get complete personnel data with team info
 * @return {Array} List of personnel with additional team data
 */
window.getPersonnelWithTeamInfo = function() {
  if (!window.appData || !window.appData.teams) return [];
  
  const personnel = [];
  
  window.appData.teams.forEach(team => {
    if (!team.personnel) return;
    
    team.personnel.forEach(person => {
      personnel.push({
        ...person,
        teamId: team.id,
        teamName: team.name,
        stream: team.stream
      });
    });
  });
  
  return personnel;
};

/**
 * Get personnel stats by various dimensions
 * @return {object} Personnel statistics
 */
window.getPersonnelStats = function() {
  const personnel = window.getPersonnelWithTeamInfo();
  
  // Initialize stats object
  const stats = {
    totalCount: personnel.length,
    byStream: {},
    byClient: {},
    byRole: {},
    averageTeamSize: 0
  };
  
  // Count by stream
  personnel.forEach(person => {
    // By stream
    const stream = person.stream || 'Unknown';
    stats.byStream[stream] = (stats.byStream[stream] || 0) + 1;
    
    // By client
    const client = person.client || 'Unknown';
    stats.byClient[client] = (stats.byClient[client] || 0) + 1;
    
    // By role
    const role = person.role || 'Unknown';
    stats.byRole[role] = (stats.byRole[role] || 0) + 1;
  });
  
  // Calculate average team size
  if (window.appData.teams && window.appData.teams.length > 0) {
    let totalWithPersonnel = 0;
    
    window.appData.teams.forEach(team => {
      if (team.personnel && team.personnel.length > 0) {
        totalWithPersonnel++;
      }
    });
    
    stats.averageTeamSize = totalWithPersonnel > 0 ? 
      (personnel.length / totalWithPersonnel).toFixed(1) : 0;
  }
  
  return stats;
};

/**
 * Search across all data types
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @return {object} Search results by category
 */
window.searchAll = function(query, options = {}) {
  if (!query) return { teams: [], personnel: [], documents: [] };
  
  // Default options
  const opts = {
    caseSensitive: false,
    includeTeams: true,
    includePersonnel: true,
    includeDocuments: true,
    ...options
  };
  
  // Normalize query for case-insensitive search
  const normalizedQuery = opts.caseSensitive ? query : query.toLowerCase();
  
  const results = {
    teams: [],
    personnel: [],
    documents: []
  };
  
  // Search function for string fields
  const matchesQuery = (text) => {
    if (!text) return false;
    const normalizedText = opts.caseSensitive ? text : text.toLowerCase();
    return normalizedText.includes(normalizedQuery);
  };
  
  // Search teams
  if (opts.includeTeams && window.appData.teams) {
    window.appData.teams.forEach(team => {
      if (
        matchesQuery(team.name) ||
        matchesQuery(team.stream) ||
        matchesQuery(team.description) ||
        matchesQuery(team.responsibilities)
      ) {
        results.teams.push(team);
      }
    });
  }
  
  // Search personnel
  if (opts.includePersonnel) {
    const allPersonnel = window.getPersonnelWithTeamInfo();
    
    allPersonnel.forEach(person => {
      if (
        matchesQuery(person.name) ||
        matchesQuery(person.role) ||
        matchesQuery(person.client) ||
        matchesQuery(person.teamName)
      ) {
        results.personnel.push(person);
      }
    });
  }
  
  // Search documents
  if (opts.includeDocuments && window.appData.documents) {
    window.appData.documents.forEach(doc => {
      if (
        matchesQuery(doc.title) ||
        matchesQuery(doc.description) ||
        matchesQuery(doc.category) ||
        matchesQuery(doc.owner)
      ) {
        results.documents.push(doc);
      }
    });
  }
  
  return results;
};

/**
 * Get performance data for all teams
 * @return {Array} Team performance data with additional metrics
 */
window.getTeamPerformanceData = function() {
  if (!window.appData || !window.appData.teams) return [];
  
  return window.appData.teams.map(team => {
    // Calculate additional metrics
    const personnelCount = team.personnel ? team.personnel.length : 0;
    
    // Calculate task completion rate if tasks exist
    let taskCompletionRate = 0;
    let taskCount = 0;
    
    if (window.appData.tasks) {
      const teamTasks = window.appData.tasks.filter(task => {
        // Check if task is assigned to someone on this team
        if (!task.assignedTo) return false;
        
        return team.personnel && team.personnel.some(person => 
          person.name === task.assignedTo);
      });
      
      taskCount = teamTasks.length;
      const completedTasks = teamTasks.filter(task => task.status === 'completed');
      taskCompletionRate = taskCount > 0 ? 
        (completedTasks.length / taskCount * 100).toFixed(1) : 0;
    }
    
    return {
      id: team.id,
      name: team.name,
      stream: team.stream,
      performance: team.performance || 0,
      personnelCount,
      taskCount,
      taskCompletionRate,
      // Calculate an overall score based on multiple factors
      overallScore: (
        (team.performance || 0) * 0.6 + // 60% weight to performance
        (personnelCount > 0 ? 100 : 0) * 0.2 + // 20% weight to having personnel
        (parseFloat(taskCompletionRate) || 0) * 0.2 // 20% weight to task completion
      ).toFixed(1)
    };
  });
};

/**
 * Download data as file
 * @param {object} data - Data to export
 * @param {string} filename - Filename
 * @param {string} type - File type (json, csv)
 */
window.downloadData = function(data, filename, type = 'json') {
  let contentType = 'application/json';
  let content = JSON.stringify(data, null, 2);
  
  if (type === 'csv' && Array.isArray(data)) {
    if (typeof Papa !== 'undefined') {
      content = Papa.unparse(data);
      contentType = 'text/csv';
    } else {
      console.error('PapaParse library not available for CSV export');
      return;
    }
  } else if (type === 'excel' && Array.isArray(data)) {
    if (typeof XLSX !== 'undefined') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, filename);
      return; // Direct file download, don't use Blob
    } else {
      console.error('XLSX library not available for Excel export');
      return;
    }
  }
  
  // Create and download the file
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Add these utility functions to the data module
Object.assign(data, {
  // Get personnel by stream
  getPersonnelByStream(stream) {
    return window.getPersonnelWithTeamInfo().filter(person => 
      person.stream === stream);
  },
  
  // Get personnel by client
  getPersonnelByClient(client) {
    return window.getPersonnelWithTeamInfo().filter(person => 
      person.client === client);
  },
  
  // Get teams by stream
  getTeamsByStream(stream) {
    if (!window.appData || !window.appData.teams) return [];
    return window.appData.teams.filter(team => team.stream === stream);
  },
  
  // Get team performance benchmark
  getTeamPerformanceBenchmark() {
    if (!window.appData || !window.appData.teams || window.appData.teams.length === 0) {
      return { average: 0, min: 0, max: 0, median: 0 };
    }
    
    const performances = window.appData.teams
      .map(team => team.performance || 0)
      .sort((a, b) => a - b);
    
    const sum = performances.reduce((total, perf) => total + perf, 0);
    const average = sum / performances.length;
    const min = performances[0];
    const max = performances[performances.length - 1];
    
    // Calculate median
    const mid = Math.floor(performances.length / 2);
    const median = performances.length % 2 === 0
      ? (performances[mid - 1] + performances[mid]) / 2
      : performances[mid];
    
    return { average, min, max, median };
  }
});

console.log('Enhanced data utility functions loaded');
