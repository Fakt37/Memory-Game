let numPairs = 2,
  canBeOpened = true,
  openCards = null,
  gameDisplay = document.getElementById("game"),
  timerTemp = 60,
  timerGo = null;

const createNumbersArray = () => {
  let genArray = [];
  for (let i = 0; i < numPairs; i++) {
    genArray.push(i + 1);
    genArray.push(i + 1);
  }
  return genArray;
};
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const startGame = () => {
  createTimer();
  return shuffle(createNumbersArray());
};

const createTimer = () => {
  gameDisplay.prepend(showText(timerTemp));
  timerGo = setInterval(timer, 1000);
};

const timer = () => {
  const count = document.querySelector(".info");
  --count.textContent;
  if (count.textContent < 0) {
    clearInterval(timerGo);
    gameFinish("lose");
    count.textContent = "";
  }
};

const createStartDisplay = () => {
  const form = document.createElement("form"),
    input = document.createElement("input"),
    button = document.createElement("button");

  form.classList.add("start-display__form", "form");
  input.classList.add("form__input");
  input.type = "number";
  input.placeholder = "Введите количество пар карточек";
  button.classList.add("form__btn", "btn");
  button.textContent = "Начать игру";
  form.append(input);
  form.append(button);

  return { form, input, button };
};

const startDisplay = (container) => {
  const start = createStartDisplay();

  container.append(start.form);

  start.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!start.input.value) {
      return;
    }

    numPairs = start.input.value;

    if (numPairs >= 2 && numPairs <= 10 && numPairs % 2 === 0) {
      createGameApp(gameDisplay, startGame());
    } else {
      numPairs = 4;
      createGameApp(gameDisplay, startGame());
    }

    if (numPairs == 4 || numPairs == 8) {
      document.querySelector(".container").style.maxWidth = "600px";
    } else if (numPairs == 6) {
      document.querySelector(".container").style.maxWidth = "800px";
    }

    start.form.style.display = "none";
  });
};

const createCardWrapper = () => {
  const containerCard = document.createElement("div");
  containerCard.classList.add("card-wrapper");
  return containerCard;
};

const createCard = (value) => {
  const item = document.createElement("div"),
    cardFront = document.createElement("div"),
    cardBack = document.createElement("div");

  item.classList.add("card");
  cardFront.classList.add("card__front");
  cardBack.classList.add("card__back");
  cardBack.textContent = value;
  item.append(cardFront);
  item.append(cardBack);

  const cardModel = {
    el: item,
    value,
  };

  item.addEventListener("click", () => clickCardItem(cardModel));

  return item;
};

const clickCardItem = (cardModel) => {
  const el = cardModel.el;
  if (!el.classList.contains("card--open") && canBeOpened) {
    el.classList.add("card--open");
    if (!openCards) {
      openCards = cardModel;
    } else {
      canBeOpened = false;
      checkValues(cardModel);
    }
  }
};

const checkValues = (secondModel) => {
  if (openCards.value === secondModel.value) {
    setTimeout(() => doneCards(secondModel.el, openCards.el), 600);
  } else {
    setTimeout(() => closeCards(secondModel.el, openCards.el), 600);
  }
};

const doneCards = (card1, card2) => {
  card1.classList.add("card--done");
  card2.classList.add("card--done");
  openCards = null;
  canBeOpened = true;
  numPairs--;
  numPairs == 0 ? gameFinish("win") : null;
};

const closeCards = (card1, card2) => {
  card1.classList.remove("card--open");
  card2.classList.remove("card--open");
  openCards = null;
  canBeOpened = true;
};

const showText = (text) => {
  const info = document.createElement("h4");

  info.classList.add("info");
  info.textContent = text;

  return info;
};

const playAgain = () => {
  const btn = document.createElement("button");

  btn.classList.add("btn", "btn-again");
  btn.textContent = "Сыграть еще раз?";

  btn.addEventListener("click", gameRestart);

  gameDisplay.append(btn);
};

const gameRestart = () => {
  document.location.reload();
};

const gameFinish = (res) => {
  infoBlock = document.createElement("div");
  infoBlock.classList.add("info");

  if (res === "win") {
    clearInterval(timerGo);
    document.querySelector(".info").remove();
    gameDisplay.prepend(showText("Вы нашли все пары!"));
    playAgain();
  }
  if (res === "lose") {
    gameDisplay.prepend(showText("Время вышло"));
    playAgain();
    document.querySelectorAll(".card").forEach((el) => {
      el.classList.add("card--open");
    });
  }
  return infoBlock;
};

const createGameApp = (container, numberList) => {
  const cardWrapper = createCardWrapper();

  for (let item of numberList) {
    cardWrapper.append(createCard(item));
  }
  container.append(cardWrapper);
};

document.addEventListener("DOMContentLoaded", () => {
  startDisplay(document.getElementById("start"));
});
