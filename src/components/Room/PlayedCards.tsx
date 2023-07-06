import './cards.css';
import { Card, checkCorrectCard } from '../../utils';
import { socket } from '../App';
import React, { useEffect, useState } from 'react';

function PlayedCards() {
    const [playedCards, setPlayedCards] = useState(new Map<number, Card>());

    useEffect(() => {
        if (playedCards.size === 4) {
            // Clearing ended trick.
            setPlayedCards(new Map<number, Card>([]));
            return;
        }
    }, [playedCards]);


    function playCard(card: Card, index: number) {
        const seat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);
        console.log("seat: " + seat);
        console.log("index: " + index);
        const playedByRelativePosition = (index - seat + 4) % 4;
        console.log("relative position: " + playedByRelativePosition);


        const newPlayedCards = new Map(playedCards);
        newPlayedCards.set(playedByRelativePosition, card);
        setPlayedCards(newPlayedCards);
    }

    socket.on("card-played", (card: Card, currentSuit: string, playedBy: number) => {
        console.log("Current suit: " + currentSuit);
        console.log("Player number " + playedBy + " played card: " + card.rank + " of " + card.suit);
        localStorage.setItem(`suit-${socket.id}`, currentSuit);
        localStorage.setItem(`nextPlayer-${socket.id}`, ((playedBy + 1) % 4).toString());
        socket.emit("get-hands");
        playCard(card, playedBy);
    });


    return (
        <div className="playedCards">
            <div className="playingCards faceImages">
                {Array.from(playedCards).map(([index, { rank, suit, symbol }]) => (
                    <ul className={`played-space-${index}`}>
                        <li key={rank + suit + symbol}>
                            <a className={`card rank-${rank} ${suit} myAllCards`}>
                                <span className="rank">{rank.toUpperCase()}</span>
                                <span className="suit">{symbol}</span>
                            </a>
                        </li>
                    </ul>
                ))}
            </div>
        </div>
    );
}

export default PlayedCards;