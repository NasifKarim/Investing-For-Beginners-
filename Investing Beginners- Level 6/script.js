const terms = [
  { term: "Investment account", definition: "An account for holding and investing money.", color: "#FF5733" },
  { term: "Brokerage account", definition: "An account for investing in various securities.", color: "#33FF57" },
  { term: "Broker", definition: "An individual or firm that executes trades on behalf of clients.", color: "#3357FF" },
  { term: "Retirement account", definition: "A tax-advantaged account for saving for retirement.", color: "#FF33A6" },
  { term: "Individual Retirement Account (IRA)", definition: "A retirement savings account for individuals.", color: "#FF8F33" },
  { term: "401(k) plan", definition: "An employer-sponsored retirement savings plan.", color: "#FF3333" },
  { term: "403(b) plan", definition: "A retirement savings plan for non-profit organizations.", color: "#FF5733" },
  { term: "529 plan", definition: "A tax-advantaged savings plan for education costs.", color: "#57FF33" },
  { term: "Custodial account", definition: "An account held for a minor by a custodian.", color: "#3357FF" },
  { term: "Trust account", definition: "An account managed by a trustee for beneficiaries.", color: "#FF33FF" },
  { term: "Joint account", definition: "An account held by two or more people.", color: "#33FFD7" },
  { term: "Fees", definition: "Charges associated with an investment account.", color: "#FFB833" },
  { term: "Investment options", definition: "The types of investments available within an account.", color: "#8FFF33" },
  { term: "Customer service", definition: "Support provided by an investment firm.", color: "#33FF8F" },
];

const numPairs = 6;
let selectedTerms = getRandomTerms(terms, numPairs);
let gameBoard = document.getElementById("game-board");
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let termToDefinitionMap = new Map();

function getRandomTerms(terms, numPairs) {
  const shuffled = terms.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPairs).map(item => ({
    term: item.term,
    definition: item.definition,
    color: item.color,
  }));
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function createCards() {
  selectedTerms.forEach(item => {
    cards.push(createCard(item.term, "term", item.color));
    cards.push(createCard(item.definition, "definition", item.color));

    termToDefinitionMap.set(item.term, item.definition);
  });

  shuffle(cards);

  cards.forEach(card => {
    gameBoard.appendChild(card);
  });
}

function createCard(content, type, color) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.content = content;
  card.dataset.type = type;
  card.dataset.color = color;

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-face", "card-front");
  cardFront.textContent = "MyFiLi";

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-face", "card-back");

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);
  card.addEventListener("click", handleCardClick);

  return card;
}

function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (flippedCards.length < 2 && !clickedCard.classList.contains("flipped") && !clickedCard.classList.contains("matched")) {
    clickedCard.classList.add("flipped");
    const cardBack = clickedCard.querySelector(".card-back");
    cardBack.textContent = clickedCard.dataset.content;
    clickedCard.style.borderColor = clickedCard.dataset.color;
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 1000);
    }
  }
}

const correctSound = new Audio("https://www.myfili.com/wp-content/uploads/2024/08/correct-match.mp3");
const incorrectSound = new Audio("https://www.myfili.com/wp-content/uploads/2024/08/incorrect-match.mp3");
const congratSound = new Audio("https://www.myfili.com/wp-content/uploads/2024/08/MatchCardCongrats.wav");

function checkForMatch() {
  const [card1, card2] = flippedCards;
  const content1 = card1.dataset.content.trim();
  const content2 = card2.dataset.content.trim();

  const card1DataSetTerm = card1.dataset.type === "term";
  const card2DataSetTerm = card2.dataset.type === "term";
  const card1DataSetDefinition = card1.dataset.type === "definition";
  const card2DataSetDefinition = card2.dataset.type === "definition";

  if ((card1DataSetTerm && card2DataSetDefinition && termToDefinitionMap.get(content1) === content2) || 
      (card1DataSetDefinition && card2DataSetTerm && termToDefinitionMap.get(content2) === content1)) {
  // if ((card1.dataset.type === "term" && card2.dataset.type === "definition" && termToDefinitionMap.get(content1) === content2) || 
  //     (card1.dataset.type === "definition" && card2.dataset.type === "term" && termToDefinitionMap.get(content2) === content1)) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;
    correctSound.play();

    if (matchedPairs === numPairs) {
      setTimeout(showCongratsModal, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.querySelector(".card-back").textContent = "";
      card2.querySelector(".card-back").textContent = "";
      card1.style.borderColor = "transparent";
      card2.style.borderColor = "transparent";
      incorrectSound.play();
    }, 1000);
  }

  flippedCards = [];
}

function showCongratsModal() {
  const congratsModal = document.getElementById("congrats-modal");
  congratsModal.style.display = "flex";
  
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalText = document.createElement("p");
  modalText.textContent = "Congratulations! You matched all pairs. Well done!";

  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Game";
  restartButton.classList.add("restart-button");
  restartButton.addEventListener("click", restartGame);

  const closeButton = document.createElement("button");
  closeButton.textContent = "x";
  closeButton.classList.add("close-button");

  closeButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });


  modalContent.appendChild(modalText);
  modalContent.appendChild(restartButton);
  congratsModal.appendChild(modalContent);

  congratSound.play();
}

function restartGame() {
  const congratsModal = document.getElementById("congrats-modal");
  congratsModal.style.display = "none";
  
  while (congratsModal.firstChild) {
    congratsModal.removeChild(congratsModal.firstChild);
  }

  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }  
  termToDefinitionMap.clear();
  selectedTerms = getRandomTerms(terms, numPairs);

  createCards();
}

createCards();
