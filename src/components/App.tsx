import React from 'react';
import StartPage from './StartPage/StartPage';
import Room from './Room/Room';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import io from 'socket.io-client';
import { SERVER } from '../config';
import WaitingRoom from './WaitingRoom/WaitingRoom';
import Bidding from './Bidding/Bidding';
import MainMenu from './MainMenu/MainMenu';

function App() {
  const theme =createTheme({
    palette: {
      primary: {
        main: '#C41E3A',
      },
      secondary: {
        main: '#D22B2B',
      },
    },
  });
  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path = "/"       element = {<StartPage/>}/>
            <Route path = "*"       element = {<StartPage/>}/>
            <Route path = "/mainMenu" element = {<MainMenu/>}/>
            <Route path = "/room"   element = {<Room/>}/>
            <Route path = "/waitingRoom"   element = {<WaitingRoom/>}/>
            <Route path = "/bidding"   element = {<Bidding/>}/>
            <Route path = "/link/:roomLink" element = {<StartPage/>}/>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CssBaseline>

  );
}

export default App;

export const socket = io(SERVER);
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("set-turn", (turn: number) => {
  localStorage.setItem(`turn-${socket.id}`, turn.toString());
});