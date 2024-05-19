// src/Card.js
import React from 'react';
import '../Styles/Card.css';

const Card = ({ card, onClick }) => {
    return (
      <div className={`card ${card.flipped ? 'flipped' : ''}`} onClick={onClick}>
        <div className="card-front">?</div>
        <div className="card-back">
          <img src={card.image} alt={`Card ${card.pairId}`} />
        </div>
      </div>
    );
  };
  
  export default Card;