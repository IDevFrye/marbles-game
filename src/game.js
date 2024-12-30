'use strict';

(() => {
  const RPS = ['камень', 'ножницы', 'бумага'];
  const SCENARIO = {
    greeting: 'Добро пожаловать в игру "Марблы"!\nСначала сыграем в "Камень, ножницы, бумага", чтобы определить, кто начнёт первым.',
    playingMove: 'Ваш ход в "Камень, ножницы, бумага".\nВведите: камень, ножницы или бумага:',
    drawFirst: 'Ничья! Давайте попробуем ещё раз.',
    isEven: 'Бот загадал число. Как думаете, оно чётное?\nOK - да, Отмена - нет',
    player_positive: 'Поздравляем! Вы угадали.\nБот загадал число шариков: ""\nВаши шарики: ""\nШарики бота: ""',
    player_negative: 'Увы, вы не угадали.\nБот загадал число шариков: ""\nВаши шарики: ""\nШарики бота: ""',
    get_bet: 'Ваш ход!\nВаши шарики: ""\nШарики бота: ""\nВведите количество шариков, которое хотите поставить:',
    bot_positive: 'Бот угадал ваше число. Шарики переходят к нему.\nВаши шарики: ""\nШарики бота: ""',
    bot_negative: 'Бот ошибся. Вы получаете шарики.\nВаши шарики: ""\nШарики бота: ""',
    now_move: 'Ход ""`a!',
    summary: 'Игра завершена!\nПобедитель: ""\nШарики бота: ""\nШарики игрока: ""',
    bye: 'Спасибо за игру! До встречи!',
    again: 'Хотите сыграть ещё раз?',
    input_error_rps: 'Ошибка ввода! Введите "камень", "ножницы" или "бумага".',
    input_error_number: 'Ошибка ввода! Введите число от 1 до количества ваших шариков.',
    exit_confirm: 'Вы уверены, что хотите выйти из игры?',
  };
  let marbles = {
    player: 5,
    bot: 5,
  };

  const getRandomIntInclusive = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Number(Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled));
  };

  const normalizeInput = (input) => {
    if (!input) return null;
    const figures = RPS;
    input = input.trim().toLowerCase();

    return figures.find(figure => figure.startsWith(input)) || null;
  };

  const checkResult = (userVar, botVar) => {
    const winningRules = {
      камень: 'ножницы',
      ножницы: 'бумага',
      бумага: 'камень',
    };

    if (userVar === botVar) return 'DRAW';
    return winningRules[userVar] === botVar ? 1 : 0;
  };

  const playMove = () => {
    const scenario = SCENARIO;
    const figures = RPS;

    let botChoice;
    let userInput;
    let userChoice;
    let matchResult = 'DRAW';

    while (matchResult === 'DRAW') {
      botChoice = figures[getRandomIntInclusive(0, figures.length - 1)];
      userInput = prompt(scenario.playingMove);
      userChoice = normalizeInput(userInput);


      while ((!userChoice || userInput.trim() === '') && userInput !== null) {
        alert(scenario.input_error_rps);
        userInput = prompt(scenario.playingMove);
        userChoice = normalizeInput(userInput);
      }

      if (userInput === null) {
        const exitConfirm = confirm(scenario.exit_confirm);
        if (exitConfirm) {
          return 'EXIT';
        } else {
          continue;
        }
      };

      matchResult = checkResult(userChoice, botChoice);
      if (matchResult === 'DRAW') {
        alert(scenario.drawFirst);
      }
    };

    return matchResult;
  };

  const playMarbles = (first, scenario) => {
    const move = ['BOT', 'PLAYER'];
    let currentMove = move[first];
    while (marbles.player > 0 && marbles.bot > 0) {
      alert(scenario.now_move.replace('""', currentMove));
      if (currentMove === 'BOT') {
        const botBet = getRandomIntInclusive(1, marbles.bot);
        const playerGuess = confirm(scenario.isEven);
        if (playerGuess === (botBet % 2 === 0)) {
          marbles.player += botBet;
          marbles.bot -= botBet;
          alert(scenario.player_positive
            .replace('""', botBet)
            .replace('""', marbles.player)
            .replace('""', marbles.bot));
        } else {
          marbles.bot += botBet;
          marbles.player -= botBet;
          alert(scenario.player_negative
            .replace('""', botBet)
            .replace('""', marbles.player)
            .replace('""', marbles.bot));
        };

        currentMove = 'PLAYER';
      } else if (currentMove === 'PLAYER') {
        let playerBet;
        let playerNum = 0;
        while (!Number.isInteger(Number(playerBet)) ||
          playerBet === '' || playerNum < 1 || playerNum > marbles.player) {
          playerBet = prompt(scenario.get_bet
            .replace('""', marbles.player)
            .replace('""', marbles.bot));
          if (playerBet === null) {
            return 'EXIT';
          };
          playerNum = Number(playerBet);
          const playerTrim = playerBet.trim();
          if (isNaN(playerNum) || !Number.isInteger(playerNum) ||
            playerTrim === '' || playerNum < 1 || playerNum > marbles.player) {
            alert(scenario.input_error_number);
            continue;
          }
        };
        const botGuess = getRandomIntInclusive(0, 1);
        if (botGuess === playerNum % 2) {
          marbles.bot += playerNum;
          marbles.player -= playerNum;
          alert(scenario.bot_positive
            .replace('""', marbles.player)
            .replace('""', marbles.bot));
        } else {
          marbles.player += playerNum;
          marbles.bot -= playerNum;
          alert(scenario.bot_negative
            .replace('""', marbles.player)
            .replace('""', marbles.bot));
        };

        currentMove = 'BOT';
      }
    };

    if (marbles.bot < 1) {
      return ['PLAYER', marbles.bot, marbles.player];
    } else {
      return ['BOT', marbles.bot, marbles.player];
    }
  };

  const playGame = () => {
    const scenario = SCENARIO;
    marbles.bot = 5;
    marbles.player = 5;

    alert(scenario.greeting);
    const firstMove = playMove();
    if (firstMove === 'EXIT') {
      alert(scenario.bye);
      return;
    };
    const [winner, bot, player] = playMarbles(firstMove, scenario);

    alert(scenario.summary.replace('""', winner)
      .replace('""', bot)
      .replace('""', player));

    const again = confirm(scenario.again);
    if (again) {
      playGame();
    } else {
      alert(scenario.bye);
      return;
    };
  };

  window.marbles = playGame;
})();
