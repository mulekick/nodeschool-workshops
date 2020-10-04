'use strict';

const {concat} = require(`./stream-lib`);


const c = new concat({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

process.stdin
    .pipe(c);