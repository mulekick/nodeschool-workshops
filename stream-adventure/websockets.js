'use strict';

const
    // eslint-disable-next-line no-shadow
    WebSocket = require(`ws`),
    // Create websocket client
    wsocket = new WebSocket(`ws://localhost:8099`),
    // Set stream to use in flowing mode
    wstream = WebSocket.createWebSocketStream(wsocket, {encoding: `utf8`});

// Pipe to stdout
wstream.pipe(process.stdout);
// Say hello to my little friend
wstream.end(`hello\n`);