// Skills Matrix Component
const skillsMatrix = {
  // Initialize the skills matrix component
  init(containerId = 'tabContent') {
    console.log('Initializing Skills Matrix...');
    try {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error('Container element not found');
        return;
      }
      
      // Load skills matrix data
      this.loadData();
      
      // Render the skills matrix UI
      this.render();
      
      // Set up event listeners
      this.setupEventListeners();
      
      console.log('Skills Matrix initialized');
    } catch (error) {
      console.error('Error initializing Skills Matrix:', error);
      this.showError('Failed to initialize Skills Matrix');
    }
  },
  
  // Load matrix data (skills, people, ratings)
  loadData() {
    console.log('Loading Skills Matrix data...');
    try {
      // Get current value stream
      const currentStream = window.appData?.state?.currentStream || 'bbv';
      
      // In a real app, this would likely be an API call
      // For now, we'll use mock data
      this.skills = [
        { id: 'skill1', name: 'Quality Auditing', category: 'Quality Systems', critical: true },
        { id: 'skill2', name: 'Document Control', category: 'Quality Systems', critical: true },
        { id: 'skill3', name: 'CAPA Management', category: 'Quality Systems', critical: true },
        { id: 'skill4', name: 'Risk Management', category: 'Quality Systems', critical: true },
        { id: 'skill5', name: 'Regulatory Compliance', category: 'Regulatory', critical: true },
        { id: 'skill6', name: '510(k) Submissions', category: 'Regulatory', critical: false },
        { id: 'skill7', name: 'CE Marking', category: 'Regulatory', critical: false },
        { id: 'skill8', name: 'ISO 13485', category: 'Quality Standards', critical: true },
        { id: 'skill9', name: 'FDA QSR 21 CFR 820', category: 'Quality Standards', critical: true },
        { id: 'skill10', name: 'Root Cause Analysis', category: 'Problem Solving', critical: false },
        { id: 'skill11', name: 'Verification Activities', category: 'Validation', critical: false },
        { id: 'skill12', name: 'Validation Activities', category: 'Validation', critical: true }
      ];
      
      // Filter and sort skills by value stream relevance
      this.filterSkillsByValueStream(currentStream);
      
      // People data with roles
      this.people = [
        { id: 'person1', name: 'John Smith', role: 'Quality Account Manager', stream: 'bbv' },
        { id: 'person2', name: 'Jane Doe', role: 'Quality Engineer', stream: 'bbv' },
        { id: 'person3', name: 'Michael Brown', role: 'Quality Coordinator', stream: 'bbv' },
        { id: 'person4', name: 'Sarah Johnson', role: 'Quality Account Manager', stream: 'add' },
        { id: 'person5', name: 'Robert Williams', role: 'Document Control Specialist', stream: 'add' },
        { id: 'person6', name: 'Emily Davis', role: 'Quality Lead', stream: 'arb' },
        { id: 'person7', name: 'James Wilson', role: 'Quality Specialist', stream: 'arb' },
        { id: 'person8', name: 'Lisa Thompson', role: 'Quality Engineer', stream: 'shared' }
      ];
      
      // Filter people by value stream
      this.filterPeopleByValueStream(currentStream);
      
      // Skills matrix ratings
      this.ratings = [
        { personId: 'person1', skillId: 'skill1', rating: 4, certified: true, lastUpdated: '2023-11-15' },
        { personId: 'person1', skillId: 'skill2', rating: 5, certified: true, lastUpdated: '2023-10-20' },
        { personId: 'person1', skillId: 'skill3', rating: 3, certified: true, lastUpdated: '2023-09-05' },
        { personId: 'person1', skillId: 'skill8', rating: 4, certified: true, lastUpdated: '2023-11-10' },
        
        { personId: 'person2', skillId: 'skill1', rating: 3, certified: true, lastUpdated: '2023-08-12' },
        { personId: 'person2', skillId: 'skill2', rating: 4, certified: true, lastUpdated: '2023-07-22' },
        { personId: 'person2', skillId: 'skill5', rating: 3, certified: false, lastUpdated: '2023-10-15' },
        { personId: 'person2', skillId: 'skill10', rating: 5, certified: true, lastUpdated: '2023-09-30' },
        
        { personId: 'person3', skillId: 'skill1', rating: 2, certified: false, lastUpdated: '2023-11-01' },
        { personId: 'person3', skillId: 'skill2', rating: 3, certified: true, lastUpdated: '2023-10-18' },
        { personId: 'person3', skillId: 'skill3', rating: 1, certified: false, lastUpdated: '2023-08-25' },
        
        { personId: 'person4', skillId: 'skill1', rating: 5, certified: true, lastUpdated: '2023-11-05' },
        { personId: 'person4', skillId: 'skill3', rating: 4, certified: true, lastUpdated: '2023-09-12' },
        { personId: 'person4', skillId: 'skill5', rating: 4, certified: true, lastUpdated: '2023-10-08' },
        
        { personId: 'person5', skillId: 'skill2', rating: 5, certified: true, lastUpdated: '2023-10-30' },
        { personId: 'person5', skillId: 'skill8', rating: 3, certified: true, lastUpdated: '2023-09-15' },
        
        { personId: 'person6', skillId: 'skill1', rating: 5, certified: true, lastUpdated: '2023-11-12' },
        { personId: 'person6', skillId: 'skill4', rating: 4, certified: true, lastUpdated: '2023-10-05' },
        { personId: 'person6', skillId: 'skill5', rating: 5, certified: true, lastUpdated: '2023-09-20' },
        
        { personId: 'person7', skillId: 'skill2', rating: 4, certified: true, lastUpdated: '2023-08-15' },
        { personId: 'person7', skillId: 'skill3', rating: 3, certified: true, lastUpdated: '2023-10-10' },
        
        { personId: 'person8', skillId: 'skill1', rating: 4, certified: true, lastUpdated: '2023-09-25' },
        { personId: 'person8', skillId: 'skill2', rating: 4, certified: true, lastUpdated: '2023-08-30' },
        { personId: 'person8', skillId: 'skill3', rating: 4, certified: true, lastUpdated: '2023-10-15' },
        { personId: 'person8', skillId: 'skill4', rating: 3, certified: true, lastUpdated: '2023-11-05' },
        { personId: 'person8', skillId: 'skill5', rating: 3, certified: true, lastUpdated: '2023-09-10' }
      ];
      
      // Calculate summary statistics
      this.calculateStatistics();
      
      console.log('Skills Matrix data loaded');
    } catch (error) {
      console.error('Error loading Skills Matrix data:', error);
      throw error;
    }
  },
  
  // Filter skills by value stream relevance
  filterSkillsByValueStream(streamId) {
    console.log(`Filtering skills by value stream: ${streamId}`);
    try {
      // In a real app, this would likely use backend data specific to each stream
      // For now, we'll just sort the skills to prioritize those that match the stream's focus
      
      // Define stream priorities (which skills are most important per stream)
      const streamPriorities = {
        bbv: ['skill1', 'skill2', 'skill8', 'skill9'],
        add: ['skill3', 'skill5', 'skill6', 'skill7'],
        arb: ['skill4', 'skill10', 'skill11', 'skill12'],
        shared: ['skill1', 'skill2', 'skill3', 'skill4', 'skill5']
      };
      
      // Get priority skills for this stream
      const prioritySkills = streamPriorities[streamId] || [];
      
      // Sort skills to put priority ones first
      this.skills.sort((a, b) => {
        const aIsPriority = prioritySkills.includes(a.id);
        const bIsPriority = prioritySkills.includes(b.id);
        
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        return 0;
      });
      
      console.log(`Skills filtered for ${streamId}`);
    } catch (error) {
      console.error(`Error filtering skills by value stream ${streamId}:`, error);
    }
  },
  
  // Filter people by value stream
  filterPeopleByValueStream(streamId) {
    console.log(`Filtering people by value stream: ${streamId}`);
    try {
      // Filter people to include those in the selected stream and shared services
      this.filteredPeople = this.people.filter(person => 
        person.stream === streamId || person.stream === 'shared'
      );
      
      console.log(`People filtered for ${streamId}: ${this.filteredPeople.length} people`);
    } catch (error) {
      console.error(`Error filtering people by value stream ${streamId}:`, error);
    }
  },
  
  // Calculate matrix statistics
  calculateStatistics() {
    console.log('Calculating matrix statistics...');
    try {
      // Calculate overall skill coverage
      const totalPossibleRatings = this.filteredPeople.length * this.skills.length;
      const actualRatings = this.ratings.filter(r => 
        this.filteredPeople.some(p => p.id === r.personId)
      ).length;
      
      this.stats = {
        skillCoverage: Math.round((actualRatings / totalPossibleRatings) * 100),
        averageRating: 0,
        certificationRate: 0,
        criticalSkillGaps: 0
      };
      
      // Calculate average rating
      const totalRating = this.ratings.filter(r => 
        this.filteredPeople.some(p => p.id === r.personId)
      ).reduce((sum, r) => sum + r.rating, 0);
      
      this.stats.averageRating = Math.round((totalRating / actualRatings) * 10) / 10;
      
      // Calculate certification rate
      const certifiedRatings = this.ratings.filter(r => 
        this.filteredPeople.some(p => p.id === r.personId) && r.certified
      ).length;
      
      this.stats.certificationRate = Math.round((certifiedRatings / actualRatings) * 100);
      
      // Calculate critical skill gaps
      const criticalSkills = this.skills.filter(s => s.critical).map(s => s.id);
      let totalCriticalGaps = 0;
      
      for (const person of this.filteredPeople) {
        for (const skillId of criticalSkills) {
          const hasSkill = this.ratings.some(r => 
            r.personId === person.id && 
            r.skillId === skillId && 
            r.rating >= 3
          );
          
          if (!hasSkill) {
            totalCriticalGaps++;
          }
        }
      }
      
      this.stats.criticalSkillGaps = totalCriticalGaps;
      
      console.log('Statistics calculated:', this.stats);
    } catch (error) {
      console.error('Error calculating statistics:', error);
    }
  },
  
  // Render the skills matrix UI
  render() {
    console.log('Rendering Skills Matrix...');
    try {
      // Get current value stream for theming
      const currentStream = window.appData?.state?.currentStream || 'bbv';
      
      // Create main container
      let html = `
        <div class="matrix-container">
          <!-- KPI Cards -->
          <div class="matrix-kpi-cards">
            <div class="card">
              <div class="card-body">
                <h3>Skill Coverage</h3>
                <p class="text-lg font-semibold">${this.stats.skillCoverage}%</p>
                <div class="progress">
                  <div class="progress-bar" style="width: ${this.stats.skillCoverage}%"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h3>Average Rating</h3>
                <p class="text-lg font-semibold">${this.stats.averageRating} / 5</p>
                <div class="rating">
                  ${this.renderRatingStars(this.stats.averageRating)}
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h3>Certification Rate</h3>
                <p class="text-lg font-semibold">${this.stats.certificationRate}%</p>
                <div class="progress">
                  <div class="progress-bar" style="width: ${this.stats.certificationRate}%"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h3>Critical Skill Gaps</h3>
                <p class="text-lg font-semibold">${this.stats.criticalSkillGaps}</p>
                <span class="badge ${this.stats.criticalSkillGaps > 5 ? 'badge-danger' : 'badge-warning'}">
                  ${this.stats.criticalSkillGaps > 5 ? 'High Risk' : 'Moderate Risk'}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Matrix Controls -->
          <div class="matrix-controls">
            <div class="filter-group">
              <label for="categoryFilter">Category:</label>
              <select id="categoryFilter" class="form-control">
                <option value="all">All Categories</option>
                ${this.getCategoryOptions()}
              </select>
            </div>
            <div class="filter-group">
              <label for="criticalFilter">Critical Skills:</label>
              <div class="toggle-switch">
                <input type="checkbox" id="criticalFilter">
                <span class="toggle-slider"></span>
              </div>
            </div>
            <div class="filter-group">
              <label for="certifiedFilter">Certified Only:</label>
              <div class="toggle-switch">
                <input type="checkbox" id="certifiedFilter">
                <span class="toggle-slider"></span>
              </div>
            </div>
            <div class="search-group">
              <div class="input-with-icon">
                <input type="text" id="matrixSearch" placeholder="Search skills or people..." class="form-control">
                <div class="input-icon">
                  <i class="fas fa-search"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Matrix Table -->
          <div class="matrix-table-container">
            <table class="matrix-table" id="skillsMatrixTable">
              <thead>
                <tr>
                  <th class="fixed-column">Skills</th>
                  ${this.renderPeopleHeaders()}
                </tr>
              </thead>
              <tbody>
                ${this.renderSkillRows()}
              </tbody>
            </table>
          </div>
          
          <!-- Matrix Legend -->
          <div class="matrix-legend">
            <h4>Skill Rating Legend</h4>
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-color rating-1"></div>
                <div class="legend-label">1 - Awareness</div>
              </div>
              <div class="legend-item">
                <div class="legend-color rating-2"></div>
                <div class="legend-label">2 - Basic Knowledge</div>
              </div>
              <div class="legend-item">
                <div class="legend-color rating-3"></div>
                <div class="legend-label">3 - Practitioner</div>
              </div>
              <div class="legend-item">
                <div class="legend-color rating-4"></div>
                <div class="legend-label">4 - Advanced</div>
              </div>
              <div class="legend-item">
                <div class="legend-color rating-5"></div>
                <div class="legend-label">5 - Expert</div>
              </div>
            </div>
            <div class="legend-items">
              <div class="legend-item">
                <div class="training-badge">C</div>
                <div class="legend-label">Certified</div>
              </div>
              <div class="legend-item">
                <div class="badge badge-danger badge-sm">Critical</div>
                <div class="legend-label">Critical Skill</div>
              </div>
            </div>
          </div>
          
          <!-- Training Plan Section (Collapsible) -->
          <div class="collapsible-section" id="trainingPlanSection">
            <div class="collapsible-header">
              <h3>Training Plans</h3>
              <i class="fas fa-chevron-down collapsible-icon"></i>
            </div>
            <div class="collapsible-content">
              <div class="collapsible-body">
                <div class="training-plans-content">
                  <p>This section will display recommended training plans based on skill gaps.</p>
                  <div class="card">
                    <div class="card-header">
                      <h4 class="card-title">Recommended Training</h4>
                    </div>
                    <div class="card-body">
                      <ul class="training-list">
                        ${this.renderTrainingRecommendations()}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Gap Analysis Section (Collapsible) -->
          <div class="collapsible-section" id="gapAnalysisSection">
            <div class="collapsible-header">
              <h3>Gap Analysis</h3>
              <i class="fas fa-chevron-down collapsible-icon"></i>
            </div>
            <div class="collapsible-content">
              <div class="collapsible-body">
                <div class="gap-analysis-content">
                  <p>This section will display detailed gap analysis for critical skills.</p>
                  <div class="card">
                    <div class="card-header">
                      <h4 class="card-title">Critical Skill Coverage</h4>
                    </div>
                    <div class="card-body">
                      ${this.renderGapAnalysis()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Update container
      this.container.innerHTML = html;
      
      console.log('Skills Matrix rendered');
    } catch (error) {
      console.error('Error rendering Skills Matrix:', error);
      this.showError('Failed to render Skills Matrix');
    }
  },
  
  // Render the headers for people in the matrix
  renderPeopleHeaders() {
    let html = '';
    
    for (const person of this.filteredPeople) {
      html += `
        <th>
          <div class="avatar-circle" title="${person.name} - ${person.role}">
            ${person.name.charAt(0)}${person.name.split(' ')[1]?.charAt(0) || ''}
          </div>
        </th>
      `;
    }
    
    return html;
  },
  
  // Render skill rows in the matrix
  renderSkillRows() {
    let html = '';
    
    for (const skill of this.skills) {
      html += `
        <tr>
          <td class="fixed-column">
            ${skill.name}
            ${skill.critical ? '<span class="badge badge-danger badge-sm">Critical</span>' : ''}
            <div class="text-sm text-gray-600">${skill.category}</div>
          </td>
          ${this.renderSkillRatings(skill.id)}
        </tr>
      `;
    }
    
    return html;
  },
  
  // Render ratings for a skill across people
  renderSkillRatings(skillId) {
    let html = '';
    
    for (const person of this.filteredPeople) {
      const rating = this.ratings.find(r => 
        r.personId === person.id && r.skillId === skillId
      );
      
      if (rating) {
        html += `
          <td>
            <div class="rating" data-person="${person.id}" data-skill="${skillId}">
              <div class="rating-value rating-${rating.rating}">
                ${rating.rating}
                ${rating.certified ? '<div class="training-badge">C</div>' : ''}
              </div>
            </div>
          </td>
        `;
      } else {
        html += `
          <td>
            <div class="rating empty" data-person="${person.id}" data-skill="${skillId}">
              <div class="rating-value">-</div>
            </div>
          </td>
        `;
      }
    }
    
    return html;
  },
  
  // Get category options for the filter dropdown
  getCategoryOptions() {
    const categories = [...new Set(this.skills.map(s => s.category))];
    let html = '';
    
    for (const category of categories) {
      html += `<option value="${category}">${category}</option>`;
    }
    
    return html;
  },
  
  // Render rating stars for average rating
  renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let html = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      html += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
      html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      html += '<i class="far fa-star"></i>';
    }
    
    return html;
  },
  
  // Render training recommendations based on skill gaps
  renderTrainingRecommendations() {
    // In a real app, this would analyze skill gaps and recommend courses
    // For now, we'll just show some mock recommendations
    let html = '';
    
    const recommendations = [
      { person: 'John Smith', skill: 'CAPA Management', course: 'Advanced CAPA Techniques', dueDate: '2023-12-15' },
      { person: 'Jane Doe', skill: 'Regulatory Compliance', course: 'Regulatory Affairs Certification', dueDate: '2023-12-30' },
      { person: 'Michael Brown', skill: 'Quality Auditing', course: 'Internal Auditor Training', dueDate: '2023-11-30' }
    ];
    
    for (const rec of recommendations) {
      html += `
        <li class="training-item">
          <div class="training-info">
            <div class="training-person">${rec.person}</div>
            <div class="training-skill">${rec.skill}</div>
            <div class="training-course">${rec.course}</div>
            <div class="training-due">Due: ${rec.dueDate}</div>
          </div>
          <div class="training-actions">
            <button class="btn btn-sm btn-outline">Assign</button>
          </div>
        </li>
      `;
    }
    
    return html;
  },
  
  // Render gap analysis for critical skills
  renderGapAnalysis() {
    // In a real app, this would show detailed gap analysis
    // For now, we'll just show a sample visualization
    let html = `
      <div class="gap-analysis-chart">
        <div class="gap-skill">
          <div class="gap-skill-name">Quality Auditing</div>
          <div class="gap-skill-bar">
            <div class="gap-filled" style="width: 75%">75%</div>
          </div>
        </div>
        <div class="gap-skill">
          <div class="gap-skill-name">Document Control</div>
          <div class="gap-skill-bar">
            <div class="gap-filled" style="width: 90%">90%</div>
          </div>
        </div>
        <div class="gap-skill">
          <div class="gap-skill-name">CAPA Management</div>
          <div class="gap-skill-bar">
            <div class="gap-filled" style="width: 60%">60%</div>
          </div>
        </div>
        <div class="gap-skill">
          <div class="gap-skill-name">Risk Management</div>
          <div class="gap-skill-bar">
            <div class="gap-filled" style="width: 50%">50%</div>
          </div>
        </div>
        <div class="gap-skill">
          <div class="gap-skill-name">ISO 13485</div>
          <div class="gap-skill-bar">
            <div class="gap-filled" style="width: 80%">80%</div>
          </div>
        </div>
      </div>
    `;
    
    return html;
  },
  
  // Set up event listeners for interactivity
  setupEventListeners() {
    console.log('Setting up Skills Matrix event listeners...');
    try {
      // Listen for value stream changes
      document.addEventListener('valueStreamChanged', (e) => {
        const streamId = e.detail.streamId;
        this.handleValueStreamChange(streamId);
      });
      
      // Set up collapsible sections
      this.setupCollapsibleSections();
      
      // Set up filters
      this.setupFilters();
      
      // Set up rating click handlers
      this.setupRatingHandlers();
      
      console.log('Skills Matrix event listeners set up');
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  },
  
  // Handle value stream changes
  handleValueStreamChange(streamId) {
    console.log(`Handling value stream change to ${streamId} in Skills Matrix`);
    try {
      // Re-filter data by the new value stream
      this.filterSkillsByValueStream(streamId);
      this.filterPeopleByValueStream(streamId);
      
      // Recalculate statistics
      this.calculateStatistics();
      
      // Re-render the matrix
      this.render();
      
      // Re-setup event listeners
      this.setupEventListeners();
      
      console.log('Skills Matrix updated for new value stream');
    } catch (error) {
      console.error('Error handling value stream change:', error);
    }
  },
  
  // Set up collapsible sections
  setupCollapsibleSections() {
    try {
      const sections = document.querySelectorAll('.collapsible-section');
      
      sections.forEach(section => {
        const header = section.querySelector('.collapsible-header');
        
        if (header) {
          header.addEventListener('click', () => {
            section.classList.toggle('expanded');
          });
        }
      });
    } catch (error) {
      console.error('Error setting up collapsible sections:', error);
    }
  },
  
  // Set up filter functionality
  setupFilters() {
    try {
      const categoryFilter = document.getElementById('categoryFilter');
      const criticalFilter = document.getElementById('criticalFilter');
      const certifiedFilter = document.getElementById('certifiedFilter');
      const matrixSearch = document.getElementById('matrixSearch');
      
      // Combine all filters into a single function
      const applyFilters = () => {
        const category = categoryFilter ? categoryFilter.value : 'all';
        const criticalOnly = criticalFilter ? criticalFilter.checked : false;
        const certifiedOnly = certifiedFilter ? certifiedFilter.checked : false;
        const searchTerm = matrixSearch ? matrixSearch.value.toLowerCase() : '';
        
        const rows = document.querySelectorAll('#skillsMatrixTable tbody tr');
        
        rows.forEach(row => {
          const skillCell = row.querySelector('.fixed-column');
          const skillName = skillCell.textContent.trim();
          const skillCategory = skillCell.querySelector('.text-gray-600').textContent;
          const isCritical = skillCell.querySelector('.badge-danger') !== null;
          
          let visible = true;
          
          // Apply category filter
          if (category !== 'all' && skillCategory !== category) {
            visible = false;
          }
          
          // Apply critical skills filter
          if (criticalOnly && !isCritical) {
            visible = false;
          }
          
          // Apply search filter
          if (searchTerm && !skillName.toLowerCase().includes(searchTerm)) {
            visible = false;
          }
          
          // Apply certified filter (this requires checking cells)
          if (certifiedOnly && visible) {
            const cells = row.querySelectorAll('td:not(.fixed-column)');
            let hasCertified = false;
            
            cells.forEach(cell => {
              if (cell.querySelector('.training-badge')) {
                hasCertified = true;
              }
            });
            
            if (!hasCertified) {
              visible = false;
            }
          }
          
          // Show/hide row
          row.style.display = visible ? '' : 'none';
        });
      };
      
      // Add event listeners
      if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
      }
      
      if (criticalFilter) {
        criticalFilter.addEventListener('change', applyFilters);
      }
      
      if (certifiedFilter) {
        certifiedFilter.addEventListener('change', applyFilters);
      }
      
      if (matrixSearch) {
        matrixSearch.addEventListener('input', applyFilters);
      }
    } catch (error) {
      console.error('Error setting up filters:', error);
    }
  },
  
  // Set up rating cell click handlers
  setupRatingHandlers() {
    try {
      const ratingCells = document.querySelectorAll('.rating');
      
      ratingCells.forEach(cell => {
        cell.addEventListener('click', () => {
          const personId = cell.getAttribute('data-person');
          const skillId = cell.getAttribute('data-skill');
          
          this.showRatingDialog(personId, skillId);
        });
      });
    } catch (error) {
      console.error('Error setting up rating handlers:', error);
    }
  },
  
  // Show a dialog to edit a rating
  showRatingDialog(personId, skillId) {
    try {
      // Find person and skill
      const person = this.people.find(p => p.id === personId);
      const skill = this.skills.find(s => s.id === skillId);
      
      if (!person || !skill) return;
      
      // Find current rating if it exists
      const currentRating = this.ratings.find(r => 
        r.personId === personId && r.skillId === skillId
      );
      
      // Create modal dynamically
      const modalHTML = `
        <div class="modal" id="ratingModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Edit Skill Rating</h3>
              <button class="modal-close" id="closeRatingModal">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Person: ${person.name}</label>
              </div>
              <div class="form-group">
                <label>Skill: ${skill.name}</label>
              </div>
              <div class="form-group">
                <label for="ratingValue">Rating (1-5):</label>
                <input type="range" min="1" max="5" class="range-slider-input" id="ratingValue" value="${currentRating ? currentRating.rating : 1}">
                <div class="range-slider-labels">
                  <span>1 - Awareness</span>
                  <span>5 - Expert</span>
                </div>
              </div>
              <div class="form-group">
                <label for="certifiedCheckbox">Certified:</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="certifiedCheckbox" ${currentRating && currentRating.certified ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </div>
              </div>
              <div class="form-group">
                <label for="lastUpdatedDate">Last Updated:</label>
                <input type="date" class="form-control" id="lastUpdatedDate" value="${currentRating ? currentRating.lastUpdated : new Date().toISOString().split('T')[0]}">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="cancelRatingBtn">Cancel</button>
              <button class="btn btn-primary" id="saveRatingBtn">Save Changes</button>
            </div>
          </div>
        </div>
      `;
      
      // Add modal to document
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalHTML;
      document.body.appendChild(modalContainer);
      
      // Get modal elements
      const modal = document.getElementById('ratingModal');
      const closeBtn = document.getElementById('closeRatingModal');
      const cancelBtn = document.getElementById('cancelRatingBtn');
      const saveBtn = document.getElementById('saveRatingBtn');
      
      // Show modal
      modal.classList.add('show');
      
      // Set up close handlers
      const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(modalContainer);
        }, 300);
      };
      
      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);
      
      // Save button handler
      saveBtn.addEventListener('click', () => {
        const ratingValue = parseInt(document.getElementById('ratingValue').value, 10);
        const certified = document.getElementById('certifiedCheckbox').checked;
        const lastUpdated = document.getElementById('lastUpdatedDate').value;
        
        this.updateRating(personId, skillId, ratingValue, certified, lastUpdated);
        closeModal();
      });
    } catch (error) {
      console.error('Error showing rating dialog:', error);
    }
  },
  
  // Update a skill rating
  updateRating(personId, skillId, rating, certified, lastUpdated) {
    try {
      // Find existing rating
      const existingRatingIndex = this.ratings.findIndex(r => 
        r.personId === personId && r.skillId === skillId
      );
      
      // Update or add rating
      if (existingRatingIndex >= 0) {
        this.ratings[existingRatingIndex] = {
          personId,
          skillId,
          rating,
          certified,
          lastUpdated
        };
      } else {
        this.ratings.push({
          personId,
          skillId,
          rating,
          certified,
          lastUpdated
        });
      }
      
      // Recalculate statistics
      this.calculateStatistics();
      
      // Re-render the matrix
      this.render();
      
      // Re-setup event listeners
      this.setupEventListeners();
      
      // Show success message
      this.showToast('success', 'Skill rating updated successfully');
    } catch (error) {
      console.error('Error updating rating:', error);
      this.showToast('error', 'Failed to update skill rating');
    }
  },
  
  // Show error message
  showError(message) {
    const errorHTML = `
      <div class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="error-message">
          <h3>Error</h3>
          <p>${message}</p>
        </div>
      </div>
    `;
    
    if (this.container) {
      this.container.innerHTML = errorHTML;
    }
  },
  
  // Show toast notification
  showToast(type, message) {
    // Check if ui.showToast exists and use it
    if (window.ui && typeof window.ui.showToast === 'function') {
      window.ui.showToast(type, message);
      return;
    }
    
    // Fallback toast implementation
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                        type === 'warning' ? 'fa-exclamation-triangle' : 
                        type === 'error' ? 'fa-times-circle' : 
                        'fa-info-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">×</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show animation
    setTimeout(() => {
      toast.classList.add('toast-visible');
    }, 10);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('toast-visible');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      });
    }
    
    // Auto close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.remove('toast-visible');
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 5000);
  }
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Register the skills matrix component with UI
  if (window.ui) {
    window.ui.skillsMatrix = skillsMatrix;
  }
});

// Export the module
window.skillsMatrix = skillsMatrix; 