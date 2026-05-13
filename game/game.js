// Game script file
let playerCharacter = null;
let gameMoney = 0;
let characters = [];
let relationships = {}; // Track relationships with each character
let nextCharacterId = 1;
let playerXP = 0;
let playerLevel = 1;

const NAMES = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Quinn', 'Sage', 'River', 'Paris', 'Sky', 'Devon', 'Blake', 'Drew', 'Reese', 'Skyler', 'Charlie', 'Cameron', 'Jamie', 'Avery', 'Sam', 'Kai', 'Noah', 'Mika'];
const GENDERS = ['male', 'female', 'non-binary', 'other'];
const SEXUALITIES = ['gay', 'straight', 'lonely', 'bisexual', 'pan', 'asexual'];
const BACKGROUNDS = ['Asian', 'American', 'Canadian', 'Australian', 'British', 'Ukrainian', 'Lab Grown', 'African', 'Mystery'];

// Pixel art sprite image files (relative to game/ folder)
const PIXEL_SPRITES = {
    male: 'assets/male.png',
    female: 'assets/female.png',
    'non-binary': 'assets/nonbinary.png',
    other: 'assets/other.png'
};

// Makes sure that when you cheat on someone you have to select who to cheat on:

const CHEAT_OPTIONS = ['Cheat on your current partner', 'Cheat on a random character', 'Cheat on a specific character'];

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve character data from cookie
    playerCharacter = getCookie('characterData');

    if (!playerCharacter) {
        window.location.href = '../index.html';
        return;
    }

    // Display welcome message
    document.getElementById('welcome-message').textContent = `🎮 ${playerCharacter.name.toUpperCase()}'S LIFE GAME 🎮`;
    
    // Initialize game
    initializeGame();
});

function initializeGame() {
    gameMoney = 1000; // Starting money
    playerXP = 0;
    playerLevel = 1;
    updateMoneyDisplay();
    updateXpDisplay();
    generateCharacters(12);
    setupModal();
}

function addCharacter() {
    const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
    const character = {
        id: nextCharacterId++,
        name: NAMES[Math.floor(Math.random() * NAMES.length)] + ' ' + NAMES[Math.floor(Math.random() * NAMES.length)],
        gender: gender,
        sexuality: SEXUALITIES[Math.floor(Math.random() * SEXUALITIES.length)],
        background: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)],
        sprite: PIXEL_SPRITES[gender] || PIXEL_SPRITES['male']
    };
    return character;
}

function generateCharacters(count) {
    characters = [];
    relationships = {};
    nextCharacterId = 1;
    for (let i = 0; i < count; i++) {
        const c = addCharacter();
        characters.push(c);
        relationships[c.id] = { status: 'none', liked: null };
    }
    displayCharacters();
}

function displayCharacters() {
    const grid = document.getElementById('characters-grid');
    grid.innerHTML = '';
    
    characters.forEach(character => {
        const charDiv = document.createElement('div');
        charDiv.className = 'character-card';
        charDiv.innerHTML = `
            <img src="${character.sprite}" alt="${character.name}" class="pixel-sprite">
            <div class="character-name">${character.name}</div>
        `;
        charDiv.addEventListener('click', () => showCharacterModal(character));
        grid.appendChild(charDiv);
    });
}

function showCharacterModal(character) {
    const modal = document.getElementById('character-modal');
    const relationship = relationships[character.id];
    
    // Add character sprite to modal
    const spriteContainer = document.getElementById('modal-sprite-container');
    spriteContainer.innerHTML = `<img src="${character.sprite}" alt="${character.name}" class="modal-pixel-sprite">`;
    
    document.getElementById('modal-name').textContent = character.name;
    document.getElementById('modal-gender').textContent = character.gender;
    document.getElementById('modal-sexuality').textContent = character.sexuality;
    document.getElementById('modal-background').textContent = character.background;
    
    // Check compatibility
    const compatible = isCompatible(playerCharacter, character);
    const compatStatus = document.getElementById('compatibility-status');
    
    if (compatible) {
        compatStatus.textContent = '✨ POSSIBLE RELATIONSHIP! ✨';
        compatStatus.style.color = '#27ae60';
    } else {
        compatStatus.textContent = '❌ NOT COMPATIBLE ❌';
        compatStatus.style.color = '#e74c3c';
    }
    
    // Show relationship status
    const relStatus = document.getElementById('relationship-status');
    if (relationship.status === 'none') {
        relStatus.textContent = '📍 Status: SINGLE';
    } else if (relationship.status === 'dating') {
        relStatus.textContent = `💕 Status: DATING (${relationship.liked ? 'They like you ♥' : 'They dislike you'})`;
    } else if (relationship.status === 'married') {
        relStatus.textContent = '💍 Status: MARRIED 💍';
    }
    
    // Setup action buttons
    setupModalActions(character, compatible);
    
    modal.style.display = 'block';
}

function setupModalActions(character, compatible) {
    const actionsDiv = document.getElementById('modal-actions');
    actionsDiv.innerHTML = '';
    
    const relationship = relationships[character.id];
    
    if (!compatible) {
        actionsDiv.innerHTML = '<p style="color: #e74c3c; font-size: 14px;">❌ Not compatible for dating</p>';
        return;
    }
    
    if (relationship.status === 'none') {
        const askBtn = document.createElement('button');
        askBtn.textContent = '💕 ASK ON DATE 💕';
        askBtn.className = 'action-btn date-btn';
        askBtn.addEventListener('click', () => goOnDate(character));
        actionsDiv.appendChild(askBtn);
    } else if (relationship.status === 'dating') {
        const proposeBtn = document.createElement('button');
        proposeBtn.textContent = '💍 PROPOSE MARRIAGE 💍';
        proposeBtn.className = 'action-btn propose-btn';
        proposeBtn.addEventListener('click', () => proposeMarriage(character));
        actionsDiv.appendChild(proposeBtn);
        
        const breakupBtn = document.createElement('button');
        breakupBtn.textContent = '💔 BREAK UP 💔';
        breakupBtn.className = 'action-btn break-btn';
        breakupBtn.addEventListener('click', () => breakUp(character));
        actionsDiv.appendChild(breakupBtn);
        
        const cheatBtn = document.createElement('button');
        cheatBtn.textContent = '😈 CHEAT (+500 💰) 😈';
        cheatBtn.className = 'action-btn cheat-btn';
        cheatBtn.addEventListener('click', () => cheat(character));
        actionsDiv.appendChild(cheatBtn);
    } else if (relationship.status === 'married') {
        const divorceBtn = document.createElement('button');
        divorceBtn.textContent = '⚖️ DIVORCE ⚖️';
        divorceBtn.className = 'action-btn break-btn';
        divorceBtn.addEventListener('click', () => divorce(character));
        actionsDiv.appendChild(divorceBtn);
        
        const cheatBtn = document.createElement('button');
        cheatBtn.textContent = '😈 CHEAT (+500 💰) 😈';
        cheatBtn.className = 'action-btn cheat-btn';
        cheatBtn.addEventListener('click', () => cheat(character));
        actionsDiv.appendChild(cheatBtn);
    }
}

function attracted(a, b) {
    if (!a || !b) return false;
    if (a.sexuality === 'lonely') return true;
    if (a.sexuality === 'bisexual' || a.sexuality === 'pan') return true;
    if (a.sexuality === 'asexual') return false;
    if (a.sexuality === 'gay') return a.gender === b.gender;
    if (a.sexuality === 'straight') return a.gender !== b.gender;
    return false;
}

function isCompatible(player, target) {
    // Mutual attraction required
    return attracted(player, target) && attracted(target, player);
}

function goOnDate(character) {
    const relationship = relationships[character.id];
    const succeeded = Math.random() < 0.6; // 60% chance
    if (succeeded) {
        relationship.status = 'dating';
        relationship.liked = true;
        playerXP += 10;
        alert(`🎉 ${character.name} SAID YES! YOU'RE NOW DATING! (+10 XP) 🎉`);
    } else {
        relationship.status = 'none';
        relationship.liked = false;
        playerXP += 2;
        alert(`😢 ${character.name} SAID NO. YOU'RE STILL FRIENDS. (+2 XP)`);
    }
    updateXpDisplay();
    closeModal();
}

function proposeMarriage(character) {
    relationships[character.id].status = 'married';
    playerXP += 50;
    gameMoney -= 100;
    if (gameMoney < 0) gameMoney = 0;
    alert(`💍 CONGRATULATIONS! YOU MARRIED ${character.name}! (+50 XP, -100 💰) 💍`);
    updateMoneyDisplay();
    updateXpDisplay();
    closeModal();
}

function cheat(character) {
    const originalPartner = character;
    let caught = Math.random() < 0.5; // 50% chance of getting caught

    // Offer different cheating options (keeps fun)
    const option = CHEAT_OPTIONS[Math.floor(Math.random() * CHEAT_OPTIONS.length)];
    let cheatingTarget = originalPartner;
    if (option === 'Cheat on a random character') {
        cheatingTarget = characters[Math.floor(Math.random() * characters.length)];
    } else if (option === 'Cheat on a specific character') {
        const characterNames = characters.map(c => c.name).join(', ');
        const selectedName = prompt(`Who do you want to cheat on? Available characters: ${characterNames}`);
        const selectedCharacter = characters.find(c => c.name.toLowerCase() === (selectedName || '').toLowerCase());
        if (selectedCharacter) {
            cheatingTarget = selectedCharacter;
        }
    }

    if (caught) {
        gameMoney -= 500;
        if (gameMoney < 0) gameMoney = 0;
        alert(`💔 ${originalPartner.name} CAUGHT YOU CHEATING! THEY LEFT YOU AND DISAPPEARED! (-500 💰)`);
        removeCharacter(originalPartner.id);
    } else {
        gameMoney += 500;
        playerXP += 20;
        alert(`😈 YOU GOT AWAY WITH IT! YOU GAINED 500 💰 and +20 XP! 😈`);
    }
    updateMoneyDisplay();
    updateXpDisplay();
    closeModal();
}
function breakUp(character) {
    relationships[character.id] = { status: 'none', liked: null };
    playerXP = Math.max(0, playerXP - 5);
    alert(`💔 YOU BROKE UP WITH ${character.name}. (-5 XP)`);
    updateXpDisplay();
    closeModal();
}

function divorce(character) {
    gameMoney -= 250; // Divorce costs money
    if (gameMoney < 0) gameMoney = 0;
    playerXP = Math.max(0, playerXP - 30);
    alert(`⚖️ DIVORCE COSTS 250 💰. ${character.name} LEFT AND DISAPPEARED. (-30 XP)`);
    removeCharacter(character.id);
    updateMoneyDisplay();
    updateXpDisplay();
    closeModal();
}

function removeCharacter(id) {
    const idx = characters.findIndex(c => c.id === id);
    if (idx !== -1) characters.splice(idx, 1);
    delete relationships[id];
    const newChar = addCharacter();
    characters.push(newChar);
    relationships[newChar.id] = { status: 'none', liked: null };
    displayCharacters();
}

function updateMoneyDisplay() {
    document.getElementById('money').textContent = gameMoney;
}

function updateXpDisplay() {
    // Simple leveling: every 100 XP of current level increases level
    while (playerXP >= playerLevel * 100) {
        playerXP -= playerLevel * 100;
        playerLevel += 1;
        alert(`🎉 LEVEL UP! You reached level ${playerLevel}! 🎉`);
    }
    const xpEl = document.getElementById('xp');
    const lvlEl = document.getElementById('level');
    if (xpEl) xpEl.textContent = playerXP;
    if (lvlEl) lvlEl.textContent = playerLevel;
}

function setupModal() {
    const modal = document.getElementById('character-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('character-modal');
    modal.style.display = 'none';
    displayCharacters(); // Refresh character display
}

// Cookie function
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return JSON.parse(cookie.substring(nameEQ.length));
        }
    }
    return null;
}