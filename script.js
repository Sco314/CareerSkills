// API Configuration
const API_URL = window.location.origin;

// Game State
let careers = [];
let defaultCareers = [];
let customCareers = [];
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
const addCareerSectionEl = document.getElementById('addCareerSection');
const customCareersSectionEl = document.getElementById('customCareersSection');
const startBtn = document.getElementById('startBtn');
const addCareerBtn = document.getElementById('addCareerBtn');
const nextBtn = document.getElementById('nextBtn');
const nextBtnContainer = document.getElementById('nextBtnContainer');
const questionTextEl = document.getElementById('questionText');
const centerFeedbackEl = document.getElementById('centerFeedback');
const playAgainBtn = document.getElementById('playAgainBtn');
const viewStatsBtn = document.getElementById('viewStatsBtn');

// Score Elements
const correctEl = document.getElementById('correct');
const roundEl = document.getElementById('round');
const streakEl = document.getElementById('streak');

// Initialize the game
async function init() {
    try {
        // Load default careers from JSON
        const response = await fetch('data/careers.json');
        defaultCareers = await response.json();

        // Load custom careers from localStorage
        loadCustomCareers();

        // Merge careers
        mergeCareers();

        // Event Listeners - Game Controls
        startBtn.addEventListener('click', startGame);
        nextBtn.addEventListener('click', nextRound);
        playAgainBtn.addEventListener('click', resetGame);
        viewStatsBtn.addEventListener('click', continueGame);
        document.getElementById('selectBtn1').addEventListener('click', () => selectCareer(0));
        document.getElementById('selectBtn2').addEventListener('click', () => selectCareer(1));

        // Event Listeners - Custom Career Management
        addCareerBtn.addEventListener('click', showAddCareerSection);
        document.getElementById('cancelAddCareerBtn').addEventListener('click', hideAddCareerSection);
        document.getElementById('addCareerForm').addEventListener('submit', handleAddCareer);
        document.getElementById('viewCustomCareersBtn').addEventListener('click', showCustomCareersSection);
        document.getElementById('backFromCustomCareersBtn').addEventListener('click', hideCustomCareersSection);

        // Event Listener - Send to Teacher
        document.getElementById('sendToTeacherBtn').addEventListener('click', sendToTeacher);

    } catch (error) {
        console.error('Error loading career data:', error);
        alert('Error loading career data. Please refresh the page.');
    }
}

// Load custom careers from localStorage
function loadCustomCareers() {
    const stored = localStorage.getItem('customCareers');
    if (stored) {
        try {
            customCareers = JSON.parse(stored);
            console.log(`Loaded ${customCareers.length} custom careers from storage`);
        } catch (error) {
            console.error('Error parsing custom careers:', error);
            customCareers = [];
        }
    }
}

// Save custom careers to localStorage
function saveCustomCareers() {
    localStorage.setItem('customCareers', JSON.stringify(customCareers));
}

// Merge default and custom careers
function mergeCareers() {
    // Combine both arrays
    careers = [...defaultCareers, ...customCareers];
    console.log(`Total careers available: ${careers.length} (${defaultCareers.length} default + ${customCareers.length} custom)`);
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
    // If we've used all careers, reset the pool
    if (usedCareerIds.length >= careers.length - 1) {
        usedCareerIds = [];
    }

    let career1, career2;

    // Get first career
    do {
        career1 = careers[Math.floor(Math.random() * careers.length)];
    } while (usedCareerIds.includes(career1.id));

    // Get second career (different from first)
    do {
        career2 = careers[Math.floor(Math.random() * careers.length)];
    } while (career2.id === career1.id || usedCareerIds.includes(career2.id));

    // Mark as used
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

    // Disable buttons
    disableButtons();

    // Update statistics
    totalRounds++;

    if (isCorrect) {
        score += 10;
        streak++;
        totalCorrect++;

        if (streak > bestStreak) {
            bestStreak = streak;
        }

        // Add bonus points for streak
        if (streak >= 3) {
            score += 5;
        }
        if (streak >= 5) {
            score += 10;
        }

        showFeedback(true, selectedCareer, otherCareer);
        highlightCorrectChoice(index);
    } else {
        streak = 0;
        showFeedback(false, selectedCareer, otherCareer);
        highlightIncorrectChoice(index);
    }

    // Reveal salaries
    revealSalaries();

    // Update display
    updateScoreDisplay();
}

// Reveal both salaries
function revealSalaries() {
    // Hide select buttons and show salary in header
    document.getElementById('selectBtn1').classList.add('hidden');
    document.getElementById('selectBtn2').classList.add('hidden');

    // Show header salaries
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

    // Hide question text and show feedback
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

    // Show/hide student name and block inputs based on round
    const studentNameInput = document.getElementById('studentName');
    const studentBlockInput = document.getElementById('studentBlock');
    const sendToTeacherBtn = document.getElementById('sendToTeacherBtn');

    if (round > 20) {
        studentNameInput.parentElement.classList.remove('hidden');
        studentBlockInput.parentElement.classList.remove('hidden');
        sendToTeacherBtn.parentElement.classList.remove('hidden');
    } else {
        studentNameInput.parentElement.classList.add('hidden');
        studentBlockInput.parentElement.classList.add('hidden');
        sendToTeacherBtn.parentElement.classList.add('hidden');
    }
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

// Show results screen
function showResults() {
    gameAreaEl.classList.add('hidden');
    resultsScreenEl.classList.remove('hidden');

    const accuracy = totalRounds > 0 ? ((totalCorrect / totalRounds) * 100).toFixed(1) : 0;

    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalRounds').textContent = totalRounds;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalStreak').textContent = bestStreak;

    const resultsMessage = document.getElementById('resultsMessage');

    if (accuracy >= 80) {
        resultsMessage.textContent = "Outstanding! You have an excellent understanding of career salaries. You're well-prepared to make informed career decisions!";
    } else if (accuracy >= 60) {
        resultsMessage.textContent = "Great work! You have a good grasp of career salaries. Keep exploring to learn even more about different career paths!";
    } else if (accuracy >= 40) {
        resultsMessage.textContent = "Nice effort! You're learning about career salaries. Keep playing to improve your knowledge and discover new careers!";
    } else {
        resultsMessage.textContent = "Keep learning! Career salaries can be surprising. Play more rounds to discover which careers earn more than you might expect!";
    }
}

// UI Navigation Functions
function showAddCareerSection() {
    instructionsEl.classList.add('hidden');
    addCareerSectionEl.classList.remove('hidden');
}

function hideAddCareerSection() {
    addCareerSectionEl.classList.add('hidden');
    instructionsEl.classList.remove('hidden');
    document.getElementById('careerUrl').value = '';
    hideStatus();
}

function showCustomCareersSection() {
    addCareerSectionEl.classList.add('hidden');
    customCareersSectionEl.classList.remove('hidden');
    renderCustomCareersList();
}

function hideCustomCareersSection() {
    customCareersSectionEl.classList.add('hidden');
    addCareerSectionEl.classList.remove('hidden');
}

// Preprocess and normalize BLS URL input
function normalizeBlsUrl(url) {
    // Trim whitespace
    url = url.trim();

    // Convert to lowercase for consistency
    url = url.toLowerCase();

    // Ensure https protocol
    if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
    }

    // Add www. if missing
    if (url.match(/^https?:\/\/bls\.gov/)) {
        url = url.replace(/^(https?:\/\/)bls\.gov/, '$1www.bls.gov');
    }

    return url;
}

// Handle add career form submission
async function handleAddCareer(event) {
    event.preventDefault();

    const urlInput = document.getElementById('careerUrl');

    if (!urlInput.value.trim()) {
        showStatus('Please enter a valid URL', 'error');
        return;
    }

    // Auto-prepend https:// if protocol is missing
    let url = urlInput.value.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    // Normalize URL before submission
    const normalizedUrl = normalizeBlsUrl(url);
    urlInput.value = normalizedUrl; // Update input field

    // Log for diagnostics
    console.log('✅ Normalized BLS URL:', normalizedUrl);

    // Validate BLS URL with comprehensive regex
    // Allows any OOH occupation page: https://www.bls.gov/ooh/category/occupation-name.htm
    // Relaxed pattern to accept any characters in the path (periods, parentheses, etc.)
    const blsUrlPattern = /^https?:\/\/(www\.)?bls\.gov\/ooh\/.+\.htm\/?(\?.*|#.*)?$/i;

    if (!blsUrlPattern.test(normalizedUrl)) {
        showStatus('Please enter a valid BLS.gov Occupational Outlook Handbook URL ending in .htm', 'error');
        return;
    }

    showStatus('Fetching career data from BLS.gov...', 'loading');

    try {
        const response = await fetch(`${API_URL}/api/scrape-career`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: normalizedUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch career data');
        }

        // Generate a unique ID for the custom career
        const newId = Date.now();
        const newCareer = {
            id: newId,
            ...data,
            isCustom: true
        };

        // Add to custom careers
        customCareers.push(newCareer);
        saveCustomCareers();
        mergeCareers();

        showStatus(`Successfully added "${newCareer.title}" to your career list!`, 'success');

        // Clear the form
        urlInput.value = '';

        // Optionally redirect back to instructions after a delay
        setTimeout(() => {
            hideAddCareerSection();
        }, 2000);

    } catch (error) {
        console.error('Error adding career:', error);
        showStatus(error.message || 'Failed to add career. Please try again.', 'error');
    }
}

// Render custom careers list
function renderCustomCareersList() {
    const listContainer = document.getElementById('customCareersList');

    if (customCareers.length === 0) {
        listContainer.innerHTML = '<p class="no-careers">You haven\'t added any custom careers yet.</p>';
        return;
    }

    listContainer.innerHTML = customCareers.map(career => `
        <div class="custom-career-item">
            <div class="custom-career-info">
                <h3>${career.title}</h3>
                <p class="career-salary">${formatSalary(career.salary)}/year</p>
                <p class="career-source"><a href="${career.source}" target="_blank" rel="noopener">View on BLS.gov</a></p>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteCustomCareer(${career.id})">Delete</button>
        </div>
    `).join('');
}

// Delete custom career
function deleteCustomCareer(careerId) {
    if (!confirm('Are you sure you want to delete this career?')) {
        return;
    }

    customCareers = customCareers.filter(career => career.id !== careerId);
    saveCustomCareers();
    mergeCareers();
    renderCustomCareersList();

    // Clear used career IDs if we deleted a career that was in the pool
    usedCareerIds = usedCareerIds.filter(id => id !== careerId);
}

// Show status message
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('scrapeStatus');
    const messageEl = document.getElementById('scrapeMessage');

    messageEl.textContent = message;
    statusEl.className = 'scrape-status';
    statusEl.classList.remove('hidden');

    if (type === 'error') {
        statusEl.classList.add('status-error');
    } else if (type === 'success') {
        statusEl.classList.add('status-success');
    } else if (type === 'loading') {
        statusEl.classList.add('status-loading');
    }
}

// Hide status message
function hideStatus() {
    const statusEl = document.getElementById('scrapeStatus');
    statusEl.classList.add('hidden');
}

// Send results to teacher
async function sendToTeacher() {
    const name = document.getElementById('studentName').value.trim();
    const block = document.getElementById('studentBlock').value.trim();

    // Validate inputs
    if (!name) {
        alert('Please enter your name before sending to teacher.');
        return;
    }

    if (!block) {
        alert('Please enter your block/class period before sending to teacher.');
        return;
    }

    // Calculate accuracy
    const accuracy = totalRounds > 0 ? ((totalCorrect / totalRounds) * 100).toFixed(1) : 0;

    // Format the results as a readable message
    const resultsText = `Career Skills Game - Student Results

Student Name: ${name}
Block/Class Period: ${block}
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

GAME STATISTICS:
- Total Correct: ${totalCorrect}
- Current Round: ${round}
- Total Rounds Played: ${totalRounds}
- Accuracy: ${accuracy}%
- Best Streak: ${bestStreak}

This student has completed the Career Skills salary comparison game.`;

    try {
        // Copy to clipboard
        await navigator.clipboard.writeText(resultsText);

        alert('Your results have been copied to the clipboard!\n\nYou can now paste them into an email or message to send to your teacher.');
    } catch (error) {
        // Fallback if clipboard API fails
        console.error('Error copying to clipboard:', error);

        // Show results in an alert as fallback
        alert(`Please copy the following results and send them to your teacher:\n\n${resultsText}`);
    }
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

// Collapse all sections on mobile devices (first 3 visible sections start collapsed)
function collapseAllOnMobile() {
    if (window.innerWidth <= 768) {
        // Get all collapsible sections for both career cards
        const career1Sections = document.querySelectorAll('#career1 .collapsible');
        const career2Sections = document.querySelectorAll('#career2 .collapsible');

        // Collapse the first 3 sections (Description, Education, Job Demand)
        // Note: Sections 4 and 5 (Work Environment, Key Skills) are hidden via CSS on mobile
        [career1Sections, career2Sections].forEach(sections => {
            sections.forEach((section, index) => {
                // Collapse first 3 sections (last 2 are hidden via CSS)
                if (index < 3) {
                    section.classList.add('collapsed');
                }
            });
        });
    }
}

// Load a new round with two random careers
function loadNewRound() {
    // Reset UI
    questionTextEl.classList.remove('hidden');
    centerFeedbackEl.classList.add('hidden');

    // Get two random careers
    currentCareers = getRandomCareers();

    // Randomly swap the careers to ensure left/right positioning is random
    if (Math.random() < 0.5) {
        currentCareers = [currentCareers[1], currentCareers[0]];
    }

    // Display careers
    displayCareer(currentCareers[0], 1);
    displayCareer(currentCareers[1], 2);

    // Enable buttons
    enableButtons();

    // Reset button and salary visibility
    document.getElementById('selectBtn1').classList.remove('hidden');
    document.getElementById('selectBtn2').classList.remove('hidden');
    document.getElementById('headerSalary1').classList.add('hidden');
    document.getElementById('headerSalary2').classList.add('hidden');

    // Reset card states
    document.getElementById('career1').classList.remove('correct', 'incorrect', 'disabled');
    document.getElementById('career2').classList.remove('correct', 'incorrect', 'disabled');

    // Update round display
    updateScoreDisplay();

    // Collapse sections on mobile
    collapseAllOnMobile();
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    init();
    initCollapsibles();
    collapseAllOnMobile();
});
