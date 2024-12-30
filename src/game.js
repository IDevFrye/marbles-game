'use strict';

(() => {
  const RPS = ['камень', 'ножницы', 'бумага'];
  const SCENARIO = {
    greeting: '',
    playingMove: '',
    firstMove: '',
    botMove: '',
    playerMove: '',
    resultMove: '',
    summary: '',
    input_error: '',
    exit_confirm: '',
  };

  let marbles = {
    player: 5,
    bot: 5,
  };

  const getRandomIntInclusive = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
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

    const botChoice = figures[getRandomIntInclusive(0, figures.length - 1)];
    let userInput = prompt(scenario.playingMove);
    let userChoice = normalizeInput(userInput);

    while ((!userChoice || userInput.trim() === '') && userInput !== null) {
      alert(scenario.input_error_rps);
      userInput = prompt(scenario.playingMove);
      userChoice = normalizeInput(userInput);
    }

    if (userInput === null) {
      const exitConfirm = confirm(scenario.exit_confirm);
      if (exitConfirm) {
        return 'EXIT';
      }
    };

    const matchResult = checkResult(userChoice, botChoice);
    if (matchResult === 'DRAW') {
      alert(scenario.drawFirst);
      playMove();
    }

    return matchResult;
  };

  const playMarbles = (first, scenario, rps) => {
    const move = ['BOT', 'PLAYER'];
    let currentMove = move[first];
    while (marbles.player > 0 || marbles.bot > 0) {
      if (currentMove === 'BOT') { // бот загадывает количество, мы угадаываем
        const botBet = getRandomIntInclusive(1, marbles.bot);
        const playerGuess = confirm(scenario.isEven);
        if (playerGuess && botBet % 2 === 0) {
          alert(scenario.player_positive);
          marbles.player += botBet;
          marbles.bot -= botBet;
        } else if (playerGuess && botBet % 2 !== 0) {
          alert(scenario.player_negative);
          marbles.bot += botBet;
          marbles.player -= botBet;
        };

        alert(scenario.now_player);
        currentMove = 'PLAYER';
      } else if (currentMove === 'PLAYER') { // мы загадываем количество, бот угадывает
        let playerBet;
        while (!Number.isInteger(Number(playerBet)) || playerBet === '') {
          playerBet = prompt(scenario.get_bet);
          if (playerBet === null) {
            return 'EXIT';
          };
          const playerNum = Number(playerBet);
          const playerTrim = playerBet.trim();
          if (isNaN(playerNum) || !Number.isInteger(playerNum) ||
            playerTrim === '' || playerNum < 1 || playerNum > marbles.player) {
            alert(scenario.input_error_numb);
            continue;
          }
        };
        const botGuess = getRandomIntInclusive(0, 1);
        if (botGuess === playerBet % 2) {
          alert(scenario.bot_positive);
          marbles.bot += playerBet;
          marbles.player -= playerBet;
        } else {
          alert(scenario.bot_negative);
          marbles.player += playerBet;
          marbles.bot -= playerBet;
        };

        alert(scenario.now_bot);
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
    const figures = RPS;

    alert(scenario.greeting);
    const firstMove = playMove();
    if (firstMove === 'EXIT') {
      alert(scenario.bye);
      return;
    };
    const winner,  = playMarbles(firstMove, scenario, figures);

    alert(scenario.summary);
    const again = confirm(scenario.again);
    if (again) {
      playGame();
    } else {
      alert(scenario.bye);
      return;
    };
  };

  window.rpc = playGame;
});
