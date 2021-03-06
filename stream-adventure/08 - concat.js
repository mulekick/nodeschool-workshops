'use strict';

const
    {concatenator} = require(`./stream-lib`),
    cnct = new concatenator({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

process.stdin
    .pipe(cnct)
    .pipe(process.stdout);