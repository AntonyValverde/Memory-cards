import React, { useState, useEffect } from 'react';
import Board from './Components/Board';
import './App.css';

const levels = {
  easy: { pairs: 4, time: 60 },
  medium: { pairs: 8, time: 120 },
  hard: { pairs: 10, time: 180 }
};

const generateInitialCards = (pairsCount) => {
  let cards = [];
  for (let i = 1; i <= pairsCount; i++) {
    cards.push({ id: i * 2 - 1, pairId: i, flipped: false, found: false, image: `/Images/${i}.jpg` });
    cards.push({ id: i * 2, pairId: i, flipped: false, found: false, image: `/Images/${i}.jpg` });
  }
  return shuffle(cards);
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  const [level, setLevel] = useState('easy');
  const [cards, setCards] = useState(generateInitialCards(levels[level].pairs));
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(levels[level].time);
  const [timerActive, setTimerActive] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  // Cargar sonidos
  const flipSound = new Audio('/sounds/flip.mpeg');
  const matchSound = new Audio('/sounds/win.mpeg');
  const winSound = new Audio('/sounds/match.mpeg');
  const loseSound = new Audio('/sounds/lose.mpeg');

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => {
        setTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            setTimerActive(false);
            setGameLost(true);
            loseSound.play();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      setMoves(prevMoves => prevMoves + 1);
      if (firstCard.pairId === secondCard.pairId) {
        matchSound.play();
        setCards(prevCards =>
          prevCards.map(card =>
            card.pairId === firstCard.pairId ? { ...card, found: true } : card
          )
        );
        resetCards();
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          resetCards();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  useEffect(() => {
    if (cards.every(card => card.found)) {
      setGameWon(true);
      setTimerActive(false);
      winSound.play();
    }
  }, [cards]);

  const handleCardClick = (id) => {
    if (disabled) return;
    if (!timerActive) setTimerActive(true);
    const clickedCard = cards.find(card => card.id === id);
    if (clickedCard.flipped || clickedCard.found) return;

    flipSound.play();
    clickedCard.flipped = true;
    setCards([...cards]);

    if (!firstCard) {
      setFirstCard(clickedCard);
    } else {
      setSecondCard(clickedCard);
    }
  };

  const resetCards = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  const resetGame = (selectedLevel) => {
    setCards(generateInitialCards(levels[selectedLevel].pairs));
    resetCards();
    setMoves(0);
    setTime(levels[selectedLevel].time);
    setTimerActive(false);
    setGameWon(false);
    setGameLost(false);
  };

  const handleLevelChange = (event) => {
    const selectedLevel = event.target.value;
    setLevel(selectedLevel);
    resetGame(selectedLevel);
  };

  return (
    <div className="App">
      <h1>Juego de Memoria</h1>
      <div className="stats">
        <p>Movimientos: {moves}</p>
        <p>Tiempo: {time}s</p>
      </div>
      <div className="controls">
        <label htmlFor="level">Nivel de dificultad:</label>
        <select id="level" value={level} onChange={handleLevelChange}>
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
        </select>
        <button onClick={() => resetGame(level)}>Reiniciar Juego</button>
      </div>
      <Board cards={cards} onCardClick={handleCardClick} />
      {gameWon && (
        <div className="game-won">
          <h2>¡Nivel logrado!</h2>
          <p>Movimientos: {moves}</p>
          <p>Tiempo: {time}s</p>
          <button onClick={() => resetGame(level)}>Jugar de nuevo</button>
        </div>
      )}
      {gameLost && (
        <div className="game-won">
          <h2>¡Se acabó el tiempo!</h2>
          <button onClick={() => resetGame(level)}>Intentar de nuevo</button>
        </div>
      )}
    </div>
  );
}

export default App;
