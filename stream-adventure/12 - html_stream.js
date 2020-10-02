'use strict';

const
    {htmlmodifier} = require(`./stream-lib`),
    upper = new htmlmodifier();

process.stdin
    .pipe(upper)
    .pipe(process.stdout);