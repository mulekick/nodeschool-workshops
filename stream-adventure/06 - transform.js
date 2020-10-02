'use strict';

const
    {uppercazer} = require(`./stream-lib`),
    upper = new uppercazer();

process.stdin
    .pipe(upper)
    .pipe(process.stdout);