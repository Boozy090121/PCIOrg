/**
 * Team Interactions Fix
 * 
 * This script fixes issues with:
 * - Team cards not being clickable
 * - Sub-team navigation not working
 * - View/Edit/Delete buttons not responding
 */

(function() {
  console.log('TEAM INTERACTIONS FIX: Initializing team interactions fix');

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFix);
  } else {
    initFix();
  }

  // Main initialization function
  function initFix() {
    console.log('TEAM INTERACTIONS FIX: Running fix');
    
    // Set up periodic checking for team cards
    setInterval(checkAndFixTeamInteractions, 2000);
    
    // Run immediately
    checkAndFixTeamInteractions();
    
    // Fix any team modals that might be open
    fixTeamModals();
  }

  // Main function to check and fix team interactions
  function checkAndFixTeamInteractions() {
    // Find all team cards
    const teamCards = document.querySelectorAll('.team-card');
    
    if (teamCards.length === 0) {
      // console.log('TEAM INTERACTIONS FIX: No team cards found');
      return;
    }
    
    console.log(`TEAM INTERACTIONS FIX: Found ${teamCards.length} team cards, fixing interactions`);
    
    // Fix team card click handlers
    fixTeamCardClicks(teamCards);
    
    // Fix view team buttons
    fixTeamActionButtons('view-team-btn', '.view-team-btn', '[data-action="view"]');
    
    // Fix edit team buttons
    fixTeamActionButtons('edit-team-btn', '.edit-team-btn', '[data-action="edit"]');
    
    // Fix delete team buttons
    fixTeamActionButtons('delete-team-btn', '.delete-team-btn', '[data-action="delete"]');
  }

  // Fix click handlers on team cards
  function fixTeamCardClicks(teamCards) {
    teamCards.forEach(card => {
      // Skip if already fixed
      if (card._clickFixed) return;
      
      const teamId = parseInt(card.getAttribute('data-team-id'));
      if (!isNaN(teamId)) {
        // Remove any existing click handlers to avoid duplication
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        card = newCard;
        
        // Add click handler to the card
        card.addEventListener('click', (e) => {
          // Only handle click if it's directly on the card (not on a button)
          if (e.target.closest('button') === null) {
            console.log(`TEAM INTERACTIONS FIX: Card clicked for team ${teamId}`);
            if (window.ui && typeof window.ui.showTeamDetails === 'function') {
              window.ui.showTeamDetails(teamId);
            } else {
              showTeamDetailsEmergency(teamId);
            }
          }
        });
        
        // Mark as fixed
        card._clickFixed = true;
      }
    });
  }

  // Fix action buttons (view, edit, delete)
  function fixTeamActionButtons(className, oldSelector, newSelector) {
    // Try both selectors to find all possible buttons
    const buttons = Array.from(document.querySelectorAll(oldSelector))
      .concat(Array.from(document.querySelectorAll(newSelector)));
    
    if (buttons.length === 0) {
      return;
    }
    
    console.log(`TEAM INTERACTIONS FIX: Found ${buttons.length} ${className} buttons`);
    
    buttons.forEach(btn => {
      // Skip if already fixed
      if (btn._actionFixed) return;
      
      // Get team ID from data attribute
      let teamId = null;
      if (btn.hasAttribute('data-team-id')) {
        teamId = parseInt(btn.getAttribute('data-team-id'));
      } else if (btn.hasAttribute('data-id')) {
        teamId = parseInt(btn.getAttribute('data-id'));
      }
      
      if (!isNaN(teamId) && teamId !== null) {
        // Remove existing event listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        btn = newBtn;
        
        // Add the standard class if it doesn't have it
        if (!btn.classList.contains(className)) {
          btn.classList.add(className);
        }
        
        // Add click handler based on action type
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent card click
          e.preventDefault();
          
          console.log(`TEAM INTERACTIONS FIX: ${className} clicked for team ${teamId}`);
          
          if (className === 'view-team-btn') {
            if (window.ui && typeof window.ui.showTeamDetails === 'function') {
              window.ui.showTeamDetails(teamId);
            } else {
              showTeamDetailsEmergency(teamId);
            }
          } else if (className === 'edit-team-btn') {
            if (window.ui && typeof window.ui.editTeam === 'function') {
              window.ui.editTeam(teamId);
            }
          } else if (className === 'delete-team-btn') {
            if (window.ui && typeof window.ui.deleteTeam === 'function') {
              window.ui.deleteTeam(teamId);
            }
          }
        });
        
        // Mark as fixed
        btn._actionFixed = true;
      }
    });
  }

  // Fix team modals - ensure sub-team cards are clickable
  function fixTeamModals() {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;
    
    // Look for sub-team sections
    const subTeamSection = modalContent.querySelector('.sub-teams-section') || 
                          modalContent.querySelector('div:has(h3:contains("Sub-Teams"))');
    
    if (subTeamSection) {
      console.log('TEAM INTERACTIONS FIX: Found sub-team section in modal, fixing interactions');
      
      // Get all sub-team cards
      const subTeamCards = subTeamSection.querySelectorAll('[onclick*="showTeamDetails"]');
      subTeamCards.forEach(card => {
        // Extract team ID from onclick attribute
        const onclickAttr = card.getAttribute('onclick');
        const matches = onclickAttr && onclickAttr.match(/showTeamDetails\((\d+)\)/);
        
        if (matches && matches[1]) {
          const teamId = parseInt(matches[1]);
          if (!isNaN(teamId)) {
            // Remove the onclick attribute and add a proper event listener
            card.removeAttribute('onclick');
            card.addEventListener('click', (e) => {
              e.preventDefault();
              console.log(`TEAM INTERACTIONS FIX: Sub-team card clicked for team ${teamId}`);
              if (window.ui && typeof window.ui.showTeamDetails === 'function') {
                window.ui.showTeamDetails(teamId);
              } else {
                showTeamDetailsEmergency(teamId);
              }
            });
          }
        }
      });
    }
  }

  // Emergency fallback function for showing team details when ui.showTeamDetails is not available
  function showTeamDetailsEmergency(teamId) {
    console.log(`TEAM INTERACTIONS FIX: Using emergency team details for team ${teamId}`);
    
    // Find the team
    const team = window.appData && window.appData.teams ? 
      window.appData.teams.find(t => t.id === teamId) : null;
    
    if (!team) {
      console.error(`TEAM INTERACTIONS FIX: Team with ID ${teamId} not found`);
      alert('Team not found');
      return;
    }
    
    // Find sub-teams (teams that reference this team as parent)
    const subTeams = window.appData && window.appData.teams ? 
      window.appData.teams.filter(t => t.parentTeamId === teamId) : [];
    
    // Create the modal
    const modal = document.createElement('div');
    modal.className = 'modal modal-lg';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-semibold text-${team.stream}">${team.name}</h2>
            <p class="text-sm text-gray-600">${team.stream.toUpperCase()} Stream</p>
          </div>
          <button class="btn-icon close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-lg font-medium mb-3">Description</h3>
            <p class="text-gray-700">${team.description || 'No description available'}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-3">Responsibilities</h3>
            <p class="text-gray-700">${team.responsibilities || 'No responsibilities defined'}</p>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Performance</h3>
          <div class="flex items-center space-x-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-${team.stream} h-2.5 rounded-full" style="width: ${team.performance || 0}%"></div>
            </div>
            <span class="text-lg font-semibold">${team.performance || 0}%</span>
          </div>
        </div>
        
        ${subTeams.length > 0 ? `
          <div class="mb-6 sub-teams-section">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Sub-Teams (${subTeams.length})</h3>
              <button class="btn-primary btn-sm add-subteam-btn" data-team-id="${team.id}">
                <i class="fas fa-plus mr-2"></i> Add Sub-Team
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${subTeams.map(subTeam => `
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 cursor-pointer subteam-card" data-team-id="${subTeam.id}">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white bg-${subTeam.stream}-600">
                      ${subTeam.name.charAt(0)}
                    </div>
                    <div>
                      <h4 class="font-medium">${subTeam.name}</h4>
                      <p class="text-xs text-gray-500">${subTeam.personnel ? subTeam.personnel.length : 0} members</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Sub-Teams (0)</h3>
              <button class="btn-primary btn-sm add-subteam-btn" data-team-id="${team.id}">
                <i class="fas fa-plus mr-2"></i> Add Sub-Team
              </button>
            </div>
            <p class="text-gray-500">No sub-teams available</p>
          </div>
        `}
        
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Personnel (${team.personnel ? team.personnel.length : 0})</h3>
            <button class="btn-primary btn-sm add-personnel-btn" data-team-id="${team.id}">
              <i class="fas fa-user-plus mr-2"></i> Add Personnel
            </button>
          </div>
          
          ${team.personnel && team.personnel.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${team.personnel.map(person => `
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gray-600">
                      ${person.name ? person.name.charAt(0) : '?'}
                    </div>
                    <div>
                      <h4 class="font-medium">${person.name || 'Unknown'}</h4>
                      <p class="text-xs text-gray-500">${person.role || 'No role'}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-gray-500">No personnel assigned to this team</p>
          `}
        </div>
      </div>
    `;
    
    // Add to the DOM
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    // Fix sub-team cards
    const subTeamCards = modal.querySelectorAll('.subteam-card');
    subTeamCards.forEach(card => {
      const subTeamId = parseInt(card.getAttribute('data-team-id'));
      if (!isNaN(subTeamId)) {
        card.addEventListener('click', () => {
          modal.remove();
          showTeamDetailsEmergency(subTeamId);
        });
      }
    });
    
    // Handle add sub-team button
    const addSubTeamBtn = modal.querySelector('.add-subteam-btn');
    if (addSubTeamBtn) {
      addSubTeamBtn.addEventListener('click', () => {
        if (window.ui && typeof window.ui.showAddSubTeamModal === 'function') {
          modal.remove();
          window.ui.showAddSubTeamModal(teamId);
        } else {
          alert('Add sub-team functionality is not available');
        }
      });
    }
    
    // Handle add personnel button
    const addPersonnelBtn = modal.querySelector('.add-personnel-btn');
    if (addPersonnelBtn) {
      addPersonnelBtn.addEventListener('click', () => {
        if (window.ui && typeof window.ui.showAddPersonnelModal === 'function') {
          modal.remove();
          window.ui.showAddPersonnelModal(teamId);
        } else {
          alert('Add personnel functionality is not available');
        }
      });
    }
  }

  // Add the fix as a global object
  window.teamInteractionsFix = {
    checkAndFixTeamInteractions,
    fixTeamModals,
    showTeamDetailsEmergency
  };
})();

// Run the fix when the script loads
console.log('TEAM INTERACTIONS FIX: Script loaded'); 