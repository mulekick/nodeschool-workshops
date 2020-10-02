'use strict';

const
    {consolewriter} = require(`./stream-lib`),
    writable = new consolewriter();

process.stdin.pipe(writable);