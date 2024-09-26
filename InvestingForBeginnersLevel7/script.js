const crossword = [
    [{}, {}, {}, { letter: 'v', number: 1 }, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, { letter: 'a' }, {}, {}, {}, {}, {}, { letter: 's', number: 2 }, {}],
    [{}, {}, {}, { letter: 'l' }, {}, {}, {}, {}, {}, { letter: 'e' }, {}],
    [{ letter: 'g', number: 3 }, {}, {}, { letter: 'u' }, {}, { letter: 'f', number: 4 }, {}, {}, {}, { letter: 'c' }, {}],
    [{ letter: 'r', number: 5 }, { letter: 'e' }, { letter: 'v' }, { letter: 'e' }, { letter: 'n' }, { letter: 'u' }, { letter: 'e' }, {}, {}, { letter: 't' }, {}],
    [{ letter: 'o' }, {}, {}, {}, {}, { letter: 'n' }, {}, {}, {}, { letter: 'o' }, {}],
    [{ letter: 'w' }, {}, {}, { letter: 'i', number: 6 }, { letter: 'n' }, { letter: 'd' }, { letter: 'u' }, { letter: 's' }, { letter: 't' }, { letter: 'r' }, { letter: 'y' }],
    [{ letter: 't' }, {}, {}, {}, {}, { letter: 'a' }, {}, {}, {}, {}, {}],
    [{ letter: 'h' }, {}, {}, {}, {}, { letter: 'm' }, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, { letter: 'e' }, {}, {}, {}, {}, {}],
    [{}, { letter: 'd', number: 7 }, { letter: 'e' }, { letter: 'f' }, { letter: 'e' }, { letter: 'n' }, { letter: 's' }, { letter: 'i' }, { letter: 'v' }, { letter: 'e' }, {}],
    [{}, {}, {}, {}, {}, { letter: 't' }, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, { letter: 'a' }, {}, {}, {}, {}, {}],
    [{}, {}, { letter: 'c', number: 8 }, { letter: 'y' }, { letter: 'c' }, { letter: 'l' }, { letter: 'i' }, { letter: 'c' }, { letter: 'a' }, { letter: 'l' }, {}],
];

const clues = {
    across: [
        '5. The total amount of money a company earns from its business activities.',
        '6. A specific group of companies within a sector.',
        '7. A stock whose price remains relatively stable during economic downturns.',
        '8. A stock whose price fluctuates with economic conditions.',
    ],
    down: [
        '1. A stock perceived as undervalued relative to its intrinsic value.',
        '2. A group of companies engaged in similar business activities.',
        '3. A stock of a company expected to grow rapidly.',
        '4. Evaluating a companys financial health to determine its worth.',
    ]
};

let score = 0;
let fullScore = 0;
let isMusicPlaying = true;

document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('background-music');
    const congratsMusic = document.getElementById('congrats-music');
    const cluesModal = document.getElementById('clues-modal');
    const cluesModalClose = document.querySelector('#clues-modal .close-button');

    calculateFullScore();
    createCrosswordGrid();

    document.getElementById('solve-puzzle').addEventListener('click', solvePuzzle);
    document.getElementById('show-hint').addEventListener('click', showHint);
    document.getElementById('restart-game').addEventListener('click', restartGame);
    document.getElementById('toggle-music').addEventListener('click', function() {
        toggleMusic(backgroundMusic);
    });
    document.getElementById('show-clues').addEventListener('click', function() {
        openCluesModal();
    });

    cluesModalClose.addEventListener('click', () => {
        cluesModal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target === cluesModal) {
            cluesModal.style.display = "none";
        }
    });
});

function openCluesModal() {
    const popupAcrossClues = document.getElementById('popup-across-clues');
    const popupDownClues = document.getElementById('popup-down-clues');

    popupAcrossClues.innerHTML = '';
    popupDownClues.innerHTML = '';

    // Populate the clues modal with clues from the existing clues object
    clues.across.forEach((clue, index) => {
        const clueItem = document.createElement('div');
        clueItem.textContent = `${clue}`;
        popupAcrossClues.appendChild(clueItem);
    });

    clues.down.forEach((clue, index) => {
        const clueItem = document.createElement('div');
        clueItem.textContent = `${clue}`;
        popupDownClues.appendChild(clueItem);
    });

    document.getElementById('clues-modal').style.display = "block";
}


function toggleMusic(backgroundMusic) {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        document.getElementById('toggle-music').textContent = "Play Music";
    } else {
        backgroundMusic.play();
        document.getElementById('toggle-music').textContent = "Mute Music";
    }
    isMusicPlaying = !isMusicPlaying;
}

function calculateFullScore() {
    crossword.forEach(row => {
        row.forEach(cell => {
            if (cell.letter) {
                fullScore++;
            }
        });
    });
}

function createCrosswordGrid() {
    const grid = document.getElementById('crossword-grid');
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }    

    crossword.forEach((row, rowIndex) => {
        row.forEach((cellData, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (Object.keys(cellData).length !== 0) {
                if (cellData.number) {
                    const number = document.createElement('div');
                    number.className = 'clue-number';
                    number.textContent = cellData.number;
                    cell.appendChild(number);
                }

                const input = document.createElement('input');
                input.maxLength = 1;
                input.dataset.row = rowIndex;
                input.dataset.col = colIndex;

                // Handle arrow key navigation
                input.addEventListener('keydown', (e) => handleArrowNavigation(e, rowIndex, colIndex));

                input.addEventListener('input', (e) => checkLetter(e.target, rowIndex, colIndex));

                cell.appendChild(input);
            } else {
                cell.classList.add('empty');
            }

            grid.appendChild(cell);
        });
    });
}

function handleArrowNavigation(e, row, col) {
    switch (e.key) {
        case 'ArrowUp':
            moveFocus(row - 1, col);
            break;
        case 'ArrowDown':
            moveFocus(row + 1, col);
            break;
        case 'ArrowLeft':
            moveFocus(row, col - 1);
            break;
        case 'ArrowRight':
            moveFocus(row, col + 1);
            break;
    }
}

function moveFocus(row, col) {
    if (row >= 0 && row < crossword.length && col >= 0 && col < crossword[row].length) {
        const targetCell = crossword[row][col];
        if (targetCell && Object.keys(targetCell).length !== 0) {
            const input = document.querySelector(`.cell input[data-row="${row}"][data-col="${col}"]`);
            if (input) {
                input.focus();
            }
        }
    }
}

function displayClues() {
    const acrossCluesContainer = document.getElementById('across-clues');
    const downCluesContainer = document.getElementById('down-clues');

    clues.across.forEach((clue, index) => {
        const clueItem = document.createElement('div');
        clueItem.textContent = `${clue}`;
        acrossCluesContainer.appendChild(clueItem);
    });

    clues.down.forEach((clue, index) => {
        const clueItem = document.createElement('div');
        clueItem.textContent = `${clue}`;
        downCluesContainer.appendChild(clueItem);
    });
}

function checkLetter(input, row, col) {
    const correctLetter = crossword[row][col].letter.toUpperCase();
    if (input.value.toUpperCase() === correctLetter) {
        input.classList.add('correct');
        input.classList.remove('incorrect');
        input.parentElement.classList.add('correct-cell');
        input.parentElement.classList.remove('incorrect-cell');
        score++;
    } else {
        input.classList.add('incorrect');
        input.classList.remove('correct');
        input.parentElement.classList.add('incorrect-cell');
        input.parentElement.classList.remove('correct-cell');
    }
    updateScore();
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    
    if (score === fullScore) {
        showCongratulationsModal();
    }
}

function solvePuzzle() {
    const inputs = document.querySelectorAll('.cell input');
    inputs.forEach(input => {
        const row = input.dataset.row;
        const col = input.dataset.col;
        const correctLetter = crossword[row][col].letter.toLowerCase();
        input.value = correctLetter;
        input.classList.add('correct');
        input.classList.remove('incorrect');
        input.parentElement.classList.add('correct-cell');
        input.parentElement.classList.remove('incorrect-cell');
    });
    score = fullScore;
    updateScore();
}

function showHint() {
    const randomEmptyCell = findRandomEmptyCell();
    if (randomEmptyCell) {
        const { row, col } = randomEmptyCell;
        const correctLetter = crossword[row][col].letter.toLowerCase();
        const input = document.querySelector(`.cell input[data-row="${row}"][data-col="${col}"]`);
        input.value = correctLetter;
        input.classList.add('correct');
        input.classList.remove('incorrect');
        input.parentElement.classList.add('correct-cell');
        input.parentElement.classList.remove('incorrect-cell');
        score++;
        updateScore();
    }
}

function findRandomEmptyCell() {
    const inputs = document.querySelectorAll('.cell input');
    const emptyCells = Array.from(inputs).filter(input => input.value === '');
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells[randomIndex];
        return {
            row: randomCell.dataset.row,
            col: randomCell.dataset.col,
        };
    }
    return null;
}

function restartGame() {
    score = 0;
    document.getElementById('score').textContent = "Score: 0";
    const inputs = document.querySelectorAll('.cell input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
        input.parentElement.classList.remove('correct-cell', 'incorrect-cell');
    });
    backgroundMusic.currentTime = 0; 
    backgroundMusic.play(); 
}

function showCongratulationsModal() {
    const modal = document.getElementById('congratulations-modal');
    modal.style.display = "block";
    
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
        
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    backgroundMusic.pause();
}