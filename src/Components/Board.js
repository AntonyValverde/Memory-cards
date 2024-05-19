// src/Board.js
import React from 'react';
import Card from './Card';
import '../Styles/Board.css';

const Board = ({ cards, onCardClick }) => {
  return (
    <div className="board">
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
};

export default Board;
