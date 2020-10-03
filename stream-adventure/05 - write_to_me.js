'use strict';

const
    {consolewriter} = require(`./stream-lib`),
    writable = new consolewriter({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

process.stdin.pipe(writable);