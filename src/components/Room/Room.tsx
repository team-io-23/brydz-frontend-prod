import HandView from "./HandView/HandView";
import TopBar from "./TopBar/TopBar";
import { socket } from "../App";
import { Contract, Hand, Score, seats, Trick } from "../../utils";
import { useEffect, useState } from "react";
import PlayedCards from "./PlayedCards";
import BiddingHistory from "../Bidding/BiddingHistory";
import NextPlayerIndicator from "./NextPlayerIndicator"; // TODO - coś jest bardzo spierdolone z tym
import SeatIndicator from "./SeatIndicator";
import LastTrick from "./LastTrick";

import "./Room.css";
import "./Table.css";

function Room() {
    let [result, setResult] = useState<Score>({ teamOne: 0, teamTwo: 0 });
    let [hands, setHands] = useState<Hand[]>([
        { cards: [], player: 0 },
        { cards: [], player: 1 },
        { cards: [], player: 2 },
        { cards: [], player: 3 },
    ]);
    let [dummy, setDummy] = useState<number>(-1);
    let [lastTrick, setLastTrick] = useState<Trick>({ cards: [], winner: -1 });
    let [turn, setTurn] = useState<number>(1);

    useEffect(() => {
        socket.emit("get-hands");
        socket.emit("get-dummy");
        console.log("Getting hands");
    }, []);

    socket.on("trick-over", (results: Score, endedTrick: Trick) => {
        // TODO: Clear table when trick is over.
        localStorage.setItem(`suit-${socket.id}`, ""); // Reset current suit
        setLastTrick(endedTrick);
        setTurn(turn+1);
        console.log("Trick over");
        console.log(lastTrick);
        console.log(endedTrick);

        // Updating score.
        setResult(results);
    });


    socket.on("hand-update", (hands: Array<Hand>) => {
        setHands(hands);
        console.log("setting hands:");
        console.log(hands);
    }); 

    socket.on("dummy-info", (dummy: number) => {
        setDummy(dummy);
        localStorage.setItem(`dummy-${socket.id}`, dummy.toString());
    });

    let contract:Contract = JSON.parse(localStorage.getItem(`contract-${socket.id}`)!);
    let seat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);

    // TODO - połączyć w jedno
    function backHand(playerSeat: number) { 
        let relativeSeat = (playerSeat - seat + 4) % 4;
        let direction = seats.get(relativeSeat)!.toLowerCase() + "Hand";
        let declarer = (dummy + 2) % 4;

        if (playerSeat !== seat && (playerSeat !== dummy || (playerSeat === dummy && seat !== declarer))) {
            return (
                <HandView player={playerSeat} position={direction} hand={hands[playerSeat]}/>
            )
        }
    }

    function frontHand(playerSeat: number) {
        let declarer = (dummy + 2) % 4;

        if (playerSeat === dummy && seat === declarer) {
            return (
                <HandView player={playerSeat} position='northHandDummy' hand={hands[playerSeat]}/>
            )
        } else if (playerSeat === seat) {
            return (
                <HandView player={playerSeat} position='southHand' hand={hands[playerSeat]}/>
            )
        }
    }

    // TODO - ten widok jest bardzo podobny tutaj i w Bidding - fajnie byłoby to jakoś połączyć
    return (
        <div>
            <div className="play-area-container">
                <TopBar result={result} contract={contract} turn={turn}/>
                <div className="play-table">
                    {hands.map((sth, index) => 
                        backHand(index)
                    )}

                    {hands.map((sth, index) => 
                        <SeatIndicator seat={index} relative={(index - seat + 4) % 4}/>
                    )}
                    <PlayedCards />
                </div>

                {hands.map((sth, index) => 
                    frontHand(index)
                )}
                
            </div>
            <div className="info-container">
                <BiddingHistory />
                <LastTrick lastTrick={lastTrick}/>
            </div>
        </div>
    )
}

export default Room;