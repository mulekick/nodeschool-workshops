'use strict';

const
    {caseconverter} = require(`./stream-lib`),
    transformer = new caseconverter();

process.stdin
    .pipe(transformer)
    .pipe(process.stdout);