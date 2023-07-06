import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { NavigateFunction} from "react-router-dom";
import {joinRoom} from '../../utils';

const cellStyles = {
    textAlign: 'center',
    fontSize: '1.15rem',
}

interface RoomListProps {
    rooms: Array<string>;
    seats: Array<number>;
    navigate: NavigateFunction;
}


function RoomList(props: RoomListProps) {
    let it = Array.from(Array(props.rooms.length).keys());
    return (
        <div className='roomlist-container'>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">room number</TableCell>
                        <TableCell align="center">players</TableCell>
                        <TableCell align="center">join</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {it.map((i: number) => (
                        <TableRow className="row">
                            <TableCell sx={cellStyles}>
                                {props.rooms[i]}
                            </TableCell>
                            <TableCell align="center"> {props.seats[i]}/4 </TableCell>
                            <TableCell align="center"> 
                            {props.seats[i] < 4 &&
                                <Button
                                    variant="contained"
                                    onClick={() => {joinRoom(+props.rooms[i], props.navigate)}}
                                >join</Button>
                            }
                            {props.seats[i] >= 4 &&
                                <Button
                                    variant="contained"
                                    disabled
                                >join</Button>
                            }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default RoomList