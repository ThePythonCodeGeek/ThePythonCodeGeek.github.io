// Game script file
let playerCharacter = null;
let gameMoney = 0;
let characters = [];
let relationships = {}; // Track relationships with each character

const NAMES = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Quinn', 'Sage', 'River', 'Paris', 'Sky', 'Devon', 'Blake', 'Drew', 'Reese', 'Skyler', 'Charlie', 'Cameron', 'Jamie', 'Avery'];
const GENDERS = ['male', 'female', 'non-binary', 'other'];
const SEXUALITIES = ['gay', 'straight', 'aromatntic'];
const BACKGROUNDS = ['Asain', 'American', 'Canadian', 'Australian', 'British', 'Ukrain', 'Lab Grown', 'African', 'They do not know...'];

// Pixel art SVG sprites
const PIXEL_SPRITES = {
    male: 'assets/male.png" viewBox="0 0 32 32"%3E%3Crect x="8" y="2" width="16" height="8" fill="%23FFDBAC"/%3E%3Crect x="6" y="10" width="20" height="8" fill="%234169E1"/%3E%3Crect x="4" y="18" width="24" height="14" fill="%23333333"/%3E%3Crect x="4" y="18" width="6" height="14" fill="%23FF6B6B"/%3E%3Crect x="22" y="18" width="6" height="14" fill="%23FF6B6B"/%3E%3C/svg%3E',
    female: 'assets/female.png" viewBox="0 0 32 32"%3E%3Crect x="8" y="2" width="16" height="8" fill="%23FFDBAC"/%3E%3Crect x="4" y="10" width="24" height="10" fill="%23FF69B4"/%3E%3Crect x="2" y="20" width="28" height="12" fill="%23FFB6C1"/%3E%3Crect x="2" y="20" width="6" height="12" fill="%23FF69B4"/%3E%3Crect x="24" y="20" width="6" height="12" fill="%23FF69B4"/%3E%3C/svg%3E',
    'non-binary': 'assets/nonbinary.png" viewBox="0 0 32 32"%3E%3Crect x="8" y="2" width="16" height="8" fill="%23FFDBAC"/%3E%3Crect x="6" y="10" width="20" height="8" fill="%23FFD700"/%3E%3Crect x="4" y="18" width="24" height="14" fill="%2392278F"/%3E%3Crect x="4" y="18" width="6" height="14" fill="%23FF6B6B"/%3E%3Crect x="22" y="18" width="6" height="14" fill="%23FF6B6B"/%3E%3C/svg%3E',
    other: 'assets/other.png" viewBox="0 0 32 32"%3E%3Crect x="8" y="2" width="16" height="8" fill="%23FFDBAC"/%3E%3Crect x="6" y="10" width="20" height="8" fill="%2300CED1"/%3E%3Crect x="4" y="18" width="24" height="14" fill="%239370DB"/%3E%3Crect x="4" y="18" width="6" height="14" fill="%23FF6B6B"/%3E%3Crect x="22" y="18" width="6" height="14" fill="%23FF6B6B"/%3E%3C/svg%3E'
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
    updateMoneyDisplay();
    generateCharacters(12);
    setupModal();
}

function generateCharacters(count) {
    characters = [];
    for (let i = 0; i < count; i++) {
        const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
        const character = {
            id: i,
            name: NAMES[Math.floor(Math.random() * NAMES.length)] + ' ' + NAMES[Math.floor(Math.random() * NAMES.length)],
            gender: gender,
            sexuality: SEXUALITIES[Math.floor(Math.random() * SEXUALITIES.length)],
            background: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)],
            sprite: PIXEL_SPRITES[gender] || PIXEL_SPRITES['male']
        };
        characters.push(character);
        relationships[character.id] = { status: 'none', liked: null }; // 'none', 'dating', 'married'
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

function isCompatible(player, target) {
    // Check sexuality compatibility
    if (target.sexuality === 'lonely') return true; // Lonely people will date anyone
    
    if (player.sexuality === 'gay') {
        return target.sexuality === 'gay';
    } else if (player.sexuality === 'straight') {
        return target.sexuality === 'straight';
    }
    
    return false;
}

function goOnDate(character) {
    const succeeded = Math.random() < 0.5; // 50% chance
    const relationship = relationships[character.id];
    
    if (succeeded) {
        relationship.status = 'dating';
        relationship.liked = true;
        alert(`🎉 ${character.name} SAID YES! YOU'RE NOW DATING! 🎉`);
    } else {
        relationship.liked = false;
        alert(`😢 ${character.name} SAID NO. BUT THEY STILL WANT TO BE FRIENDS.`);
        relationship.status = 'dating'; // They still date, but don't like you
    }
    
    closeModal();
}

function proposeMarriage(character) {
    relationships[character.id].status = 'married';
    alert(`💍 CONGRATULATIONS! YOU MARRIED ${character.name}! 💍`);
    closeModal();
}

function cheat(character) {
    const relationship = relationships[character.id];
    const caught = Math.random() < 0.4; // 40% chance of getting caught

    // Code for selecting who to cheat on if the player has multiple relationships

    switch (CHEAT_OPTIONS[Math.floor(Math.random() * CHEAT_OPTIONS.length)]) {
        case 'Cheat on your current partner':
            // Already cheating on the current partner
            break;
        case 'Cheat on a random character':
            // Randomly select a character to cheat on
            const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
            character = randomCharacter;
            break;
        case 'Cheat on a specific character':
            // Prompt the player to select a specific character to cheat on
            const characterNames = characters.map(c => c.name).join(', ');
            const selectedName = prompt(`Who do you want to cheat on? Available characters: ${characterNames}`);
            const selectedCharacter = characters.find(c => c.name.toLowerCase() === selectedName.toLowerCase());
            if (selectedCharacter) {
                character = selectedCharacter;
            } else {
                alert('Character not found. Cheating on current partner by default.');
            }
            break;
    }
    
    if (caught) {
        gameMoney -= 500;
        relationship.status = 'none';
        alert(`💔 ${character.name} CAUGHT YOU CHEATING! THEY TOOK 500 💰 AND LEFT YOU! 💔`);
        if (gameMoney < 0) gameMoney = 0;
    } else {
        gameMoney += 500;
        alert(`😈 YOU GOT AWAY WITH IT! YOU GAINED 500 💰! 😈`);
    }
    
    updateMoneyDisplay();
    closeModal();
}

function breakUp(character) {
    relationships[character.id] = { status: 'none', liked: null };
    alert(`💔 YOU BROKE UP WITH ${character.name}.`);
    closeModal();
}

function divorce(character) {
    gameMoney -= 250; // Divorce costs money
    relationships[character.id] = { status: 'none', liked: null };
    alert(`⚖️ DIVORCE COSTS 250 💰. YOU'RE NOW SINGLE. ⚖️`);
    if (gameMoney < 0) gameMoney = 0;
    updateMoneyDisplay();
    closeModal();
}

function updateMoneyDisplay() {
    document.getElementById('money').textContent = gameMoney;
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