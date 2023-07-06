import { Trick, arr } from '../../utils';
import { socket } from '../App';
import SeatIndicator from './SeatIndicator';

import './LastTrick.css'

interface LastTrickProps {
    lastTrick: Trick;
}

function LastTrick(props: LastTrickProps) {
    let seat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);

    return (
        <div className="lastTrick">
            <div className="playingCards simpleCards">
                {Array.from(props.lastTrick.cards).map(({ rank, suit, symbol }, index) => (
                    <ul className={`played-space-small-${(index - seat + 5) % 4}`}> {/* TODO: czemu 5 xd */}
                        <li key={rank + suit + symbol}>
                            <a className={`card rank-${rank} ${suit} myAllCards`}>
                                <span className="rank">{rank.toUpperCase()}</span>
                                <span className="suit">{symbol}</span>
                            </a>
                        </li>
                    </ul>
                ))}
            </div>

            {arr.map((sth, index) => 
                <SeatIndicator seat={index} relative={(index - seat + 4) % 4} close={true}/>
            )}
        </div>
    )
    
}

export default LastTrick