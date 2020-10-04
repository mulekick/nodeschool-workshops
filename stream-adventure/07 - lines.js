/* eslint-disable multiline-comment-style */
'use strict';

const
    {caseconverter} = require(`./stream-lib`),
    transformer = new caseconverter({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

process.stdin
    .pipe(transformer)
    .pipe(process.stdout);
