'use strict';

const
    {htmlmodifier} = require(`./stream-lib`),
    upper = new htmlmodifier({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

process.stdin
    .pipe(upper)
    .pipe(process.stdout);