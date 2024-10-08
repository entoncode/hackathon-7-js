'use strict';

import { io } from 'socket.io-client';
import Solver from './solver.js';

const SECRET = process.argv[2] !== undefined ? process.argv[2] : '32cf92c3-2397-4519-915e-e43609695533'; // Das Secret des Bot
const GAMESERVER = 'https://games.uhno.de'; // URL zum Gameserver

if (SECRET === '') {
    console.error('NO SECRET.');
}

const socket = io(GAMESERVER, {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('Connecting...');
    socket.emit('authenticate', SECRET, (success) => {
        if (success) {
            console.log('Connected successfully.');
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

let solver;
let self;

const init = (data) => {
    solver = new Solver();
    self = data.self;

    console.log(`Match initialized: ${data.id}`);
};
const result = (data) => {
    for (const player of data.players) {
        if (player.id === self) {
            console.log(`Match complete, word was '${data.word}'. Score: ${player.score}`);
        }
    }

    solver.addWord(data.word);
};
const round = (data, callback) => {
    solver.save(data.word);

    const move = solver.next();
    console.log(`Making move '${move}'`);

    callback(move);
};
