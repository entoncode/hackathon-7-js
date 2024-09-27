'use strict';

import { io } from 'socket.io-client';
import Solver from './solver.js';

const SECRET = '29526e07-6d5a-4ee5-8bc8-e7df715467bb'; // Das Secret des Bot
const GAMESERVER = 'https://games.uhno.de'; // URL zum Gameserver

if (SECRET === '') {
    console.error('NO SECRET.');
    return;
}

const socket = io(GAMESERVER, {
    transports: ['websocket']
});

let solver;
socket.on('connect', () => {
    console.log('Connecting...');
    socket.emit('authenticate', SECRET, (success) => {
        if (success) {
            console.log('Connected successfully.');
            solver = new Solver();
            return;
        }

        console.error('Could not connect to the server.');
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected.');
});

socket.on('data', (data, callback) => {
    switch (data.type) {
        case 'INIT':
            init(data);
            return;
        case 'RESULT':
            result(data);
            return;
        case 'ROUND':
            round(data, callback);
    }
});

const init = (data) => {
    // TODO: irgendwas initialisieren?
};
const result = (data) => {
    // TODO: irgendwas aufräumen?
};
const round = (data, callback) => {
    // TODO: die bestmögliche Antwort liefern.
    // Buchstabe A-Z?
    callback('???');
};
