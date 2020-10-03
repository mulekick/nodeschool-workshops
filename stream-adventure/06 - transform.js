'use strict';

const
    {uppercazer} = require(`./stream-lib`),
    upper = new uppercazer({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

process.stdin
    .pipe(upper)
    .pipe(process.stdout);