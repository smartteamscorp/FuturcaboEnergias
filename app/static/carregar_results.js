document.addEventListener('DOMContentLoaded', function() {
    const teamSection = document.getElementById('team-section');
    const individualResultsSection = document.getElementById('individual-results-section');
    const addUserToTeamSection = document.getElementById('add-user-to-team-section');

    const teamBtn = document.getElementById('team-btn');
    const individualResultsBtn = document.getElementById('individual-results-btn');
    const addUserToTeamBtn = document.getElementById('add-user-to-team-btn');

    teamBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showSection(teamSection);
    });

    individualResultsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showSection(individualResultsSection);
    });

    addUserToTeamBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showSection(addUserToTeamSection);
    });

    function showSection(section) {
        const sections = document.querySelectorAll('section');
        sections.forEach(function(sec) {
            sec.style.display = 'none';
        });
        section.style.display = 'block';
    }
});
