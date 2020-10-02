'use strict';

const
    {concatenator} = require(`./stream-lib`),
    cnct = new concatenator({decodeStrings: false, objectMode: false});

process.stdin
    .pipe(cnct)
    .pipe(process.stdout);