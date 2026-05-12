// Main script file
let characterData = {
    name: '',
    gender: '',
    sexuality: '',
    background: ''
};

document.addEventListener('DOMContentLoaded', function() {
    const optionButtons = document.querySelectorAll('.option-btn');
    const saveBtn = document.getElementById('save-btn');
    const nameInput = document.getElementById('name');
    const backgroundSelect = document.getElementById('background');

    // Handle option button clicks
    optionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const type = this.dataset.type;
            const value = this.dataset.value;

            // Remove selected class from other buttons of same type
            document.querySelectorAll(`.option-btn[data-type="${type}"]`).forEach(btn => {
                btn.classList.remove('selected');
            });

            // Add selected class to clicked button
            this.classList.add('selected');
            characterData[type] = value;
        });
    });

    // Handle name input
    nameInput.addEventListener('input', function() {
        characterData.name = this.value;
    });

    // Handle background selection
    backgroundSelect.addEventListener('change', function() {
        characterData.background = this.value;
    });

    // Handle save button
    saveBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Validate required fields
        if (!characterData.name) {
            alert('Please enter a character name');
            return;
        }
        if (!characterData.gender) {
            alert('Please select a gender');
            return;
        }
        if (!characterData.sexuality) {
            alert('Please select a sexuality');
            return;
        }
        if (!characterData.background) {
            alert('Please select a background');
            return;
        }

        // Create cookie
        setCookie('characterData', JSON.stringify(characterData), 365);
        alert('Character saved successfully!');
        console.log('Character data saved:', characterData);
        window.location.href = "game/index.html";
    });
});

// Cookie functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

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
