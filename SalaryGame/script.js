// Game State
let allCareers = [];  // Complete careers library loaded from JSON
let gameCareers = [];  // Careers available in the game (default + added)
let addedCareers = []; // User-added careers (stored in localStorage)
let currentCareers = [];
let usedCareerIds = [];
let score = 0;
let round = 1;
let streak = 0;
let bestStreak = 0;
let totalCorrect = 0;
let totalRounds = 0;
let gameStarted = false;

// DOM Elements
const instructionsEl = document.getElementById('instructions');
const gameAreaEl = document.getElementById('gameArea');
const resultsScreenEl = document.getElementById('resultsScreen');
const searchCareerSectionEl = document.getElementById('searchCareerSection');
const addedCareersSectionEl = document.getElementById('addedCareersSection');
const startBtn = document.getElementById('startBtn');
const addCareerBtn = document.getElementById('addCareerBtn');
const nextBtn = document.getElementById('nextBtn');
const questionTextEl = document.getElementById('questionText');
const centerFeedbackEl = document.getElementById('centerFeedback');
const playAgainBtn = document.getElementById('playAgainBtn');
const viewStatsBtn = document.getElementById('viewStatsBtn');

// Score Elements
const correctEl = document.getElementById('correct');
const roundEl = document.getElementById('round');
const streakEl = document.getElementById('streak');

// Search Elements
const careerSearchEl = document.getElementById('careerSearch');
const searchResultsEl = document.getElementById('searchResults');

// Initialize the game
async function init() {
    try {
        // Load careers library from JSON
        const response = await fetch('public/careers.min.json');
        allCareers = await response.json();

        console.log(`📚 Loaded ${allCareers.length} careers from library`);

        // Load added careers from localStorage
        loadAddedCareers();

        // Start with default set (all careers by default, or could be a subset)
        mergeCareers();

        // Event Listeners - Game Controls
        startBtn.addEventListener('click', startGame);
        nextBtn.addEventListener('click', nextRound);
        playAgainBtn.addEventListener('click', resetGame);
        viewStatsBtn.addEventListener('click', continueGame);
        document.getElementById('selectBtn1').addEventListener('click', () => selectCareer(0));
        document.getElementById('selectBtn2').addEventListener('click', () => selectCareer(1));

        // Event Listeners - Search & Add
        addCareerBtn.addEventListener('click', showSearchSection);
        document.getElementById('cancelSearchBtn').addEventListener('click', hideSearchSection);
        document.getElementById('viewAddedCareersBtn').addEventListener('click', showAddedCareersSection);
        document.getElementById('backFromAddedCareersBtn').addEventListener('click', hideAddedCareersSection);

        // Search functionality
        careerSearchEl.addEventListener('input', handleSearch);

    } catch (error) {
        console.error('Error loading career data:', error);
        alert('Error loading career data. Please refresh the page.');
    }
}

// Load added careers from localStorage
function loadAddedCareers() {
    const stored = localStorage.getItem('addedCareers_sg');
    if (stored) {
        try {
            const ids = JSON.parse(stored);
            addedCareers = allCareers.filter(c => ids.includes(c.id));
            console.log(`Loaded ${addedCareers.length} added careers from storage`);
        } catch (error) {
            console.error('Error parsing added careers:', error);
            addedCareers = [];
        }
    }
}

// Save added careers to localStorage
function saveAddedCareers() {
    const ids = addedCareers.map(c => c.id);
    localStorage.setItem('addedCareers_sg', JSON.stringify(ids));
}

// Merge game careers (all available by default)
function mergeCareers() {
    // For SalaryGame: all careers are available immediately
    // User can "add" careers to track which ones they're interested in
    gameCareers = [...allCareers];
    console.log(`Total careers available: ${gameCareers.length}`);
}

// Handle search input
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();

    if (query.length === 0) {
        searchResultsEl.classList.add('hidden');
        return;
    }

    // Search in title and altTitles
    const results = allCareers.filter(career => {
        const titleMatch = career.title.toLowerCase().includes(query);
        // Note: altTitles might not be in careers.min.json, check if exists
        const altTitlesMatch = career.altTitles && career.altTitles.some(alt =>
            alt.toLowerCase().includes(query)
        );
        return titleMatch || altTitlesMatch;
    }).slice(0, 10); // Limit to top 10 results

    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResultsEl.innerHTML = '<div class="no-results">No careers found matching "' + query + '"</div>';
        searchResultsEl.classList.remove('hidden');
        return;
    }

    const html = results.map(career => {
        const isAdded = addedCareers.some(c => c.id === career.id);
        return `
            <div class="search-result-item ${isAdded ? 'added' : ''}" data-id="${career.id}">
                <div class="search-result-info">
                    <h4>${career.title}</h4>
                    <p class="search-result-salary">${formatSalary(career.salary)}/year</p>
                    <p>${career.education} • ${career.demand.split('–')[0].trim()} demand</p>
                </div>
                <div class="search-result-actions">
                    ${isAdded ?
                        '<span class="added-badge">✓ Added</span>' :
                        '<button class="btn-add-career" onclick="addCareerToGame(' + career.id + ')">Add to Game</button>'
                    }
                </div>
            </div>
        `;
    }).join('');

    searchResultsEl.innerHTML = html;
    searchResultsEl.classList.remove('hidden');
}

// Add career to game
function addCareerToGame(careerId) {
    const career = allCareers.find(c => c.id === careerId);
    if (!career) return;

    if (addedCareers.some(c => c.id === careerId)) {
        return; // Already added
    }

    addedCareers.push(career);
    saveAddedCareers();
    mergeCareers();

    // Refresh search results
    handleSearch({ target: careerSearchEl });

    console.log(`Added career: ${career.title}`);
}

// Remove career from added list
function removeCareerFromGame(careerId) {
    if (!confirm('Remove this career from your added list?')) {
        return;
    }

    addedCareers = addedCareers.filter(c => c.id !== careerId);
    saveAddedCareers();
    mergeCareers();
    renderAddedCareersList();

    // Clear used career IDs if we removed a career that was in the pool
    usedCareerIds = usedCareerIds.filter(id => id !== careerId);
}

// UI Navigation Functions
function showSearchSection() {
    instructionsEl.classList.add('hidden');
    searchCareerSectionEl.classList.remove('hidden');
    careerSearchEl.value = '';
    searchResultsEl.classList.add('hidden');
    careerSearchEl.focus();
}

function hideSearchSection() {
    searchCareerSectionEl.classList.add('hidden');
    instructionsEl.classList.remove('hidden');
}

function showAddedCareersSection() {
    searchCareerSectionEl.classList.add('hidden');
    addedCareersSectionEl.classList.remove('hidden');
    renderAddedCareersList();
}

function hideAddedCareersSection() {
    addedCareersSectionEl.classList.add('hidden');
    searchCareerSectionEl.classList.remove('hidden');
}

// Render added careers list
function renderAddedCareersList() {
    const listContainer = document.getElementById('addedCareersList');

    if (addedCareers.length === 0) {
        listContainer.innerHTML = '<p class="no-careers">You haven\'t added any careers yet. Use the search to find and add careers!</p>';
        return;
    }

    listContainer.innerHTML = addedCareers.map(career => `
        <div class="custom-career-item">
            <div class="custom-career-info">
                <h3>${career.title}</h3>
                <p class="career-salary">${formatSalary(career.salary)}/year</p>
                <p class="career-source">${career.education} • ${career.demand.split('–')[0].trim()} demand</p>
            </div>
            <button class="btn btn-danger btn-small" onclick="removeCareerFromGame(${career.id})">Remove</button>
        </div>
    `).join('');
}

// Start the game
function startGame() {
    instructionsEl.classList.add('hidden');
    gameAreaEl.classList.remove('hidden');
    gameStarted = true;
    loadNewRound();
}

// Continue game from results screen
function continueGame() {
    resultsScreenEl.classList.add('hidden');
    gameAreaEl.classList.remove('hidden');
    loadNewRound();
}

// Reset game completely
function resetGame() {
    score = 0;
    round = 1;
    streak = 0;
    bestStreak = 0;
    totalCorrect = 0;
    totalRounds = 0;
    usedCareerIds = [];

    updateScoreDisplay();
    resultsScreenEl.classList.add('hidden');
    gameAreaEl.classList.remove('hidden');
    loadNewRound();
}

// Get two random careers
function getRandomCareers() {
    if (usedCareerIds.length >= gameCareers.length - 1) {
        usedCareerIds = [];
    }

    let career1, career2;

    do {
        career1 = gameCareers[Math.floor(Math.random() * gameCareers.length)];
    } while (usedCareerIds.includes(career1.id));

    do {
        career2 = gameCareers[Math.floor(Math.random() * gameCareers.length)];
    } while (career2.id === career1.id || usedCareerIds.includes(career2.id));

    usedCareerIds.push(career1.id, career2.id);

    return [career1, career2];
}

// Display career information
function displayCareer(career, position) {
    const titleElement = document.getElementById(`title${position}`);
    const titleTextSpan = titleElement.querySelector('.career-title-text');
    titleTextSpan.textContent = career.title;
    document.getElementById(`description${position}`).textContent = career.description;
    document.getElementById(`education${position}`).textContent = career.education;
    document.getElementById(`demand${position}`).textContent = career.demand;
    document.getElementById(`environment${position}`).textContent = career.workEnvironment;
    document.getElementById(`skills${position}`).textContent = career.skills.join(', ');
}

// Handle career selection
function selectCareer(index) {
    const selectedCareer = currentCareers[index];
    const otherCareer = currentCareers[index === 0 ? 1 : 0];

    const isCorrect = selectedCareer.salary >= otherCareer.salary;

    disableButtons();

    totalRounds++;

    if (isCorrect) {
        score += 10;
        streak++;
        totalCorrect++;

        if (streak > bestStreak) {
            bestStreak = streak;
        }

        if (streak >= 3) score += 5;
        if (streak >= 5) score += 10;

        showFeedback(true, selectedCareer, otherCareer);
        highlightCorrectChoice(index);
    } else {
        streak = 0;
        showFeedback(false, selectedCareer, otherCareer);
        highlightIncorrectChoice(index);
    }

    revealSalaries();
    updateScoreDisplay();
}

// Reveal both salaries
function revealSalaries() {
    document.getElementById('selectBtn1').classList.add('hidden');
    document.getElementById('selectBtn2').classList.add('hidden');

    document.getElementById('headerSalary1').classList.remove('hidden');
    document.getElementById('headerSalary2').classList.remove('hidden');
    document.getElementById('headerSalary1Value').textContent = formatSalary(currentCareers[0].salary);
    document.getElementById('headerSalary2Value').textContent = formatSalary(currentCareers[1].salary);
}

// Format salary with commas and dollar sign
function formatSalary(salary) {
    return '$' + salary.toLocaleString('en-US');
}

// Show feedback message
function showFeedback(isCorrect, selectedCareer, otherCareer) {
    const feedbackTitle = document.getElementById('centerFeedbackTitle');
    const feedbackMessage = document.getElementById('centerFeedbackMessage');

    questionTextEl.classList.add('hidden');
    centerFeedbackEl.classList.remove('hidden');

    if (isCorrect) {
        feedbackTitle.textContent = streak > 1 ? `Correct! Streak: ${streak}!` : 'Correct!';
        feedbackTitle.className = 'correct';

        const salaryDiff = Math.abs(selectedCareer.salary - otherCareer.salary);
        const percentDiff = ((salaryDiff / otherCareer.salary) * 100).toFixed(1);

        let message = `Great job! ${selectedCareer.title} earns ${formatSalary(selectedCareer.salary)} per year, `;
        message += `which is ${formatSalary(salaryDiff)} (${percentDiff}%) more than ${otherCareer.title}.`;

        if (streak >= 3) {
            message += ` You're on fire with a ${streak}-round streak! Keep it up!`;
        }

        feedbackMessage.textContent = message;
    } else {
        feedbackTitle.textContent = 'Not Quite!';
        feedbackTitle.className = 'incorrect';

        const salaryDiff = Math.abs(selectedCareer.salary - otherCareer.salary);
        const percentDiff = ((salaryDiff / selectedCareer.salary) * 100).toFixed(1);

        let message = `Actually, ${otherCareer.title} earns ${formatSalary(otherCareer.salary)} per year, `;
        message += `which is ${formatSalary(salaryDiff)} (${percentDiff}%) more than ${selectedCareer.title}. `;
        message += `Don't worry - keep playing to learn more about career salaries!`;

        feedbackMessage.textContent = message;
    }
}

// Highlight correct choice
function highlightCorrectChoice(index) {
    const selectedCard = document.getElementById(`career${index + 1}`);
    const otherCard = document.getElementById(`career${index === 0 ? 2 : 1}`);

    selectedCard.classList.add('correct');
    otherCard.classList.add('disabled');
}

// Highlight incorrect choice
function highlightIncorrectChoice(index) {
    const selectedCard = document.getElementById(`career${index + 1}`);
    const correctIndex = currentCareers[0].salary > currentCareers[1].salary ? 0 : 1;
    const correctCard = document.getElementById(`career${correctIndex + 1}`);

    selectedCard.classList.add('incorrect');
    correctCard.classList.add('correct');
}

// Move to next round
function nextRound() {
    round++;
    loadNewRound();
}

// Update score display
function updateScoreDisplay() {
    correctEl.textContent = totalCorrect;
    roundEl.textContent = round;
    streakEl.textContent = streak;
}

// Enable selection buttons
function enableButtons() {
    document.getElementById('selectBtn1').disabled = false;
    document.getElementById('selectBtn2').disabled = false;
}

// Disable selection buttons
function disableButtons() {
    document.getElementById('selectBtn1').disabled = true;
    document.getElementById('selectBtn2').disabled = true;
}

// Initialize collapsible sections
function initCollapsibles() {
    const headers = document.querySelectorAll('.collapsible-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const parent = this.closest('.collapsible');
            parent.classList.toggle('collapsed');
        });
    });
}

// Collapse all sections on mobile devices
function collapseAllOnMobile() {
    if (window.innerWidth <= 768) {
        const career1Sections = document.querySelectorAll('#career1 .collapsible');
        const career2Sections = document.querySelectorAll('#career2 .collapsible');

        [career1Sections, career2Sections].forEach(sections => {
            sections.forEach((section, index) => {
                if (index < 3) {
                    section.classList.add('collapsed');
                }
            });
        });
    }
}

// Load a new round with two random careers
function loadNewRound() {
    questionTextEl.classList.remove('hidden');
    centerFeedbackEl.classList.add('hidden');

    currentCareers = getRandomCareers();

    if (Math.random() < 0.5) {
        currentCareers = [currentCareers[1], currentCareers[0]];
    }

    displayCareer(currentCareers[0], 1);
    displayCareer(currentCareers[1], 2);

    enableButtons();

    document.getElementById('selectBtn1').classList.remove('hidden');
    document.getElementById('selectBtn2').classList.remove('hidden');
    document.getElementById('headerSalary1').classList.add('hidden');
    document.getElementById('headerSalary2').classList.add('hidden');

    document.getElementById('career1').classList.remove('correct', 'incorrect', 'disabled');
    document.getElementById('career2').classList.remove('correct', 'incorrect', 'disabled');

    updateScoreDisplay();
    collapseAllOnMobile();
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    init();
    initCollapsibles();
    collapseAllOnMobile();
});
