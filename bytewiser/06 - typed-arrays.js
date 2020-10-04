'use strict';

const {uint8reader} = require(`./stream-lib`);


const c = new uint8reader({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

process.stdin
    .pipe(c);