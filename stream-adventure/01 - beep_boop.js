'use strict';

// console.log(`beep boop`);
const
    {bufferreader} = require(`./stream-lib`),
    readable = new bufferreader(Buffer.from(`beep boop\n`, `utf8`));

readable.pipe(process.stdout);
