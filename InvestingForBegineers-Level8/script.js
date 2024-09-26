document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector('.start-button');
    const nextButton = document.querySelector('.next-button');
    const resetButton = document.querySelector('.reset-button');
    const congratsModal = document.querySelector('.modal');
    const congratsMessage = document.querySelector('.congrats-message');
    const closeModal = document.querySelector('.close-modal');
    const balanceAmount = document.getElementById('balance-amount');
    const investmentAmountInput = document.querySelector('.investment-amount');
    const investmentDurationInput = document.querySelector('.investment-duration');

    let savings = 1000;
    let round = 1;
    const maxRounds = 10;
    let gameOver = false; 

    const companies = [
        {
            name: 'Tech Company:',
            description: 'A growing technology company.',
            situation: 'Expanding rapidly',
            outcome: 'gain'
        },
        {
            name: 'Health Company:',
            description: 'A stable healthcare company.',
            situation: 'Stable growth',
            outcome: 'no_change'
        },
        {
            name: 'Finance Company:',
            description: 'A risky finance company.',
            situation: 'Facing market challenges',
            outcome: 'loss'
        },
        {
            name: 'Retail Company:',
            description: 'A popular retail company.',
            situation: 'Expanding rapidly',
            outcome: 'gain'
        },
        {
            name: 'Energy Company:',
            description: 'An energy company with fluctuating prices.',
            situation: 'Uncertain market',
            outcome: 'loss'
        },
        {
            name: 'Auto Company:',
            description: 'An automobile company innovating new tech.',
            situation: 'Investing in R&D',
            outcome: 'gain'
        },
        {
            name: 'Food Company:',
            description: 'A popular food chain with a stable market presence.',
            situation: 'Steady demand',
            outcome: 'no_change'
        },
        {
            name: 'Pharma Company:',
            description: 'A pharmaceutical company launching new drugs.',
            situation: 'High risk, high reward',
            outcome: 'gain'
        },
        {
            name: 'Transport Company:',
            description: 'A logistics company dealing with fluctuating fuel prices.',
            situation: 'Fuel price volatility',
            outcome: 'loss'
        }
    ];

    function setupEventListeners() {
        startButton.addEventListener('click', startGame);
        nextButton.addEventListener('click', handleSlideChange);
        resetButton.addEventListener('click', resetGame);
        closeModal.addEventListener('click', hideModal);
    }

    setupEventListeners();

 function startGame() {
        round = 1;
        savings = 1000;
        gameOver = false; 
        updateBalanceDisplay();
        showSlide(2);
        playRound();
    }

    function handleSlideChange() {
        if (!gameOver) {
            playRound();
        }
    }

    function playRound() {
        if (round > maxRounds) {
            endGame();
            return;
        }

        const selectedCompanies = [];
        while (selectedCompanies.length < 5) { // Show 5 companies
            const company = companies[Math.floor(Math.random() * companies.length)];
            if (!selectedCompanies.includes(company)) {
                selectedCompanies.push(company);
            }
        }

        showCompanyChoices(selectedCompanies);
    }

    function showCompanyChoices(companyArray) {
        const companyList = document.querySelector('.company-list');
        clearElementContent(companyList);

        companyArray.forEach(company => {
            const companyCard = document.createElement('div');
            companyCard.className = 'company-card';

            const strongElement = document.createElement('strong');
            strongElement.textContent = company.name;

            const descriptionText = document.createTextNode(` ${company.description}`);
            
            const lineBreak = document.createElement('br');

            const emElement = document.createElement('em');
            emElement.textContent = company.situation;

            companyCard.appendChild(strongElement);
            companyCard.appendChild(descriptionText);
            companyCard.appendChild(lineBreak);
            companyCard.appendChild(emElement);

            companyCard.addEventListener('click', () => makeInvestment(company));

            companyList.appendChild(companyCard);
        });

        nextButton.classList.remove('hidden');
    }    

    function makeInvestment(company) {
        const investmentAmount = parseFloat(investmentAmountInput.value);
        const investmentDuration = parseInt(investmentDurationInput.value, 10);

        let outcomeMessage;
        let outcomeValue = 0;

        switch (company.outcome) {
            case 'gain':
                outcomeValue = investmentAmount * (0.1 * investmentDuration);
                savings += outcomeValue;
                outcomeMessage = `Great choice! Your savings increased by $${outcomeValue.toFixed(2)}.`;
                break;
            case 'loss':
                outcomeValue = investmentAmount * (0.05 * investmentDuration);
                savings -= outcomeValue;
                outcomeMessage = `Oops! Your savings decreased by $${outcomeValue.toFixed(2)}.`;
                break;
            case 'no_change':
            default:
                outcomeMessage = `No change in your savings this round.`;
                break;
        }

        updateBalanceDisplay();
        showOutcome(outcomeMessage);
        round += 1;
    }

    function updateBalanceDisplay() {
        balanceAmount.textContent = savings.toFixed(2);
    }

    function showOutcome(message) {
        nextButton.classList.add('hidden');
        congratsMessage.textContent = `${message} You now have $${savings.toFixed(2)}.`;
        congratsModal.classList.remove('hidden');
        congratsModal.classList.add('active');
    }

    function hideModal() {
        congratsModal.classList.remove('active');
        congratsModal.classList.add('hidden');
        if (gameOver) {
            return;
        } else if (round > maxRounds) {
            endGame();
        } else {
            playRound();
        }
    }

    function endGame() {
        gameOver = true; 
        const winMessage = savings >= 2000
            ? `Congratulations! You grew your savings to $${savings.toFixed(2)}.`
            : `Game over. You ended with $${savings.toFixed(2)}. Try again to make better choices!`;
        showModal(winMessage);

        resetButton.classList.add('hidden');
    }

    function showModal(message) {
        congratsMessage.textContent = message;
        congratsModal.classList.remove('hidden');
        congratsModal.classList.add('active');
    }

    function resetGame() {
        if (gameOver) {
            startGame(); 
            hideModal();
        } else {
            showSlide(2);
            hideModal();
        }

        resetButton.classList.remove('hidden');
    }

    function clearElementContent(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    
    function showSlide(slideNumber) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            slide.classList.add('hidden');
            if (index + 1 === slideNumber) {
                slide.classList.add('active');
                slide.classList.remove('hidden');
            }
        });
    }
});